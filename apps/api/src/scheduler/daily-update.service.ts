import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TrendsService } from '../trends/trends.service';
import { IdeasGenerationService } from '../ai/ideas-generation.service';
import { SOURCE_INTEGRATIONS } from '../integrations/integrations.module';
import type {
  SourceIntegration,
  CollectedTrend,
} from '../integrations/integration.interface';
import { TOPICS } from '../common/content-vocab';
import type { DailyUpdateLog } from '../../generated/prisma/client';

/**
 * The fully automated daily pipeline described in the product spec:
 * "Todos os dias às 07:00 da manhã: buscar tendências, notícias, vídeos,
 * hashtags, memes, músicas, campanhas, criativos, atualizar o banco de
 * dados, gerar novas ideias, remover tendências antigas, criar relatório
 * diário — sem intervenção humana."
 *
 * Each step is isolated with its own try/catch so one failing integration
 * (e.g. a revoked API key) never blocks the rest of the run — the log
 * records a PARCIAL status with the error instead of crashing silently.
 */
@Injectable()
export class DailyUpdateService {
  private readonly logger = new Logger(DailyUpdateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly trends: TrendsService,
    private readonly ideasGeneration: IdeasGenerationService,
    private readonly config: ConfigService,
    @Inject(SOURCE_INTEGRATIONS)
    private readonly integrations: SourceIntegration[],
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'daily-update',
    timeZone: 'America/Sao_Paulo',
  })
  async run(): Promise<DailyUpdateLog> {
    const startedAt = Date.now();
    this.logger.log('Starting daily update pipeline...');

    let sourcesProcessed = 0;
    let hasFailure = false;
    const allCollected: CollectedTrend[] = [];

    for (const integration of this.integrations) {
      try {
        const collected = await integration.collect();
        allCollected.push(...collected);
        sourcesProcessed += 1;
      } catch (error) {
        hasFailure = true;
        this.logger.error(
          `Integration "${integration.key}" failed: ${(error as Error).message}`,
        );
      }
    }

    const { created: trendsCreated, updated: trendsUpdated } =
      await this.trends.upsertCollected(allCollected);
    const trendsFound = trendsCreated + trendsUpdated;

    const topics =
      allCollected.length > 0
        ? allCollected.slice(0, 10).map((c) => c.title)
        : TOPICS;
    const ideasCount =
      Number(this.config.get<string>('DAILY_IDEAS_COUNT')) || 12;

    let ideasGenerated = 0;
    try {
      const result = await this.ideasGeneration.generateAndPersist(
        topics,
        ideasCount,
      );
      ideasGenerated = result.created;
      this.logger.log(
        `Generated ${ideasGenerated} ideas (usedAi=${result.usedAi}).`,
      );
    } catch (error) {
      hasFailure = true;
      this.logger.error(`Idea generation failed: ${(error as Error).message}`);
    }

    const pruned = await this.trends.pruneOlderThan(14);

    const log = await this.prisma.dailyUpdateLog.create({
      data: {
        sourcesProcessed,
        trendsFound,
        ideasGenerated,
        trendsPruned: pruned.count,
        status: hasFailure ? 'PARCIAL' : 'SUCESSO',
        durationMs: Date.now() - startedAt,
      },
    });

    this.logger.log(
      `Daily update finished in ${Date.now() - startedAt}ms — ${sourcesProcessed}/${this.integrations.length} sources OK, ` +
        `${trendsCreated} new trends, ${trendsUpdated} refreshed, ${ideasGenerated} ideas generated, ${pruned.count} pruned.`,
    );

    return log;
  }
}
