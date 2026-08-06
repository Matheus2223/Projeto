import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TrendsService } from '../trends/trends.service';
import { SOURCE_INTEGRATIONS } from '../integrations/integrations.module';
import type { SourceIntegration } from '../integrations/integration.interface';

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
    @Inject(SOURCE_INTEGRATIONS)
    private readonly integrations: SourceIntegration[],
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'daily-update',
    timeZone: 'America/Sao_Paulo',
  })
  async run() {
    const startedAt = Date.now();
    this.logger.log('Starting daily update pipeline...');

    let sourcesProcessed = 0;
    let trendsFound = 0;
    let hasFailure = false;

    for (const integration of this.integrations) {
      try {
        const collected = await integration.collect();
        trendsFound += collected.length;
        sourcesProcessed += 1;
        // TODO: map `collected` (CollectedTrend[]) into Trend rows —
        // compute growthIndex/velocity/status by diffing against the
        // previous run's data for the same title/platform.
      } catch (error) {
        hasFailure = true;
        this.logger.error(
          `Integration "${integration.key}" failed: ${(error as Error).message}`,
        );
      }
    }

    // TODO: generate new ContentIdea rows from the freshly collected
    // trends (via AiService or a rule-based generator, mirroring
    // apps/web/src/lib/ai/fallback-responder.ts).
    const ideasGenerated = 0;

    const pruned = await this.trends.pruneOlderThan(14);

    await this.prisma.dailyUpdateLog.create({
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
      `Daily update finished in ${Date.now() - startedAt}ms — ${sourcesProcessed}/${this.integrations.length} sources OK, ${trendsFound} trends found, ${pruned.count} pruned.`,
    );
  }
}
