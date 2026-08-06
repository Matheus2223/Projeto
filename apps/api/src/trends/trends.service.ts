import { Injectable, Logger } from '@nestjs/common';
import { Platform, TrendStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SEGMENTS, pick, randInt } from '../common/content-vocab';
import type { CollectedTrend } from '../integrations/integration.interface';

const KNOWN_PLATFORMS: string[] = [
  'INSTAGRAM',
  'TIKTOK',
  'FACEBOOK',
  'YOUTUBE_SHORTS',
  'THREADS',
  'GOOGLE_TRENDS',
  'GOOGLE_NEWS',
  'REDDIT',
  'X',
  'PINTEREST',
  'LINKEDIN',
  'BLOG',
  'ANATEL',
];

function mapCollectedPlatform(value: string): Platform {
  const upper = value.toUpperCase();
  return (KNOWN_PLATFORMS.includes(upper) ? upper : 'BLOG') as Platform;
}

export interface TrendQuery {
  search?: string;
  platform?: Platform;
  segment?: string;
  state?: string;
  city?: string;
  status?: TrendStatus;
  take?: number;
  skip?: number;
}

@Injectable()
export class TrendsService {
  private readonly logger = new Logger(TrendsService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: TrendQuery) {
    const {
      search,
      platform,
      segment,
      state,
      city,
      status,
      take = 24,
      skip = 0,
    } = query;

    return this.prisma.trend.findMany({
      where: {
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        platform,
        segment,
        state,
        city,
        status,
      },
      orderBy: { growthIndex: 'desc' },
      take,
      skip,
    });
  }

  findOne(id: string) {
    return this.prisma.trend.findUnique({ where: { id } });
  }

  /** Removes trends older than `days` — called by the daily scheduler. */
  pruneOlderThan(days: number) {
    const cutoff = new Date(Date.now() - days * 86_400_000);
    return this.prisma.trend.deleteMany({
      where: { detectedAt: { lt: cutoff } },
    });
  }

  /**
   * Persists items collected by the source integrations (see
   * src/integrations). A title seen before is treated as "still trending" —
   * its growth index and views are bumped and detectedAt refreshed; a new
   * title is inserted as a fresh CRESCENDO trend. Called by the daily
   * scheduler (DailyUpdateService).
   */
  async upsertCollected(
    items: CollectedTrend[],
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const item of items) {
      const existing = await this.prisma.trend.findFirst({
        where: { title: item.title },
      });

      if (existing) {
        const nextGrowth = Math.min(99, existing.growthIndex + randInt(1, 6));
        await this.prisma.trend.update({
          where: { id: existing.id },
          data: {
            growthIndex: nextGrowth,
            velocity: Number((existing.velocity + randInt(-2, 8)).toFixed(1)),
            status:
              nextGrowth >= 90
                ? 'VIRAL'
                : nextGrowth >= 75
                  ? 'EXPLODINDO'
                  : existing.status,
            views: existing.views + randInt(200, 5000),
            detectedAt: new Date(),
          },
        });
        updated += 1;
        continue;
      }

      await this.prisma.trend.create({
        data: {
          title: item.title,
          summary:
            item.summary ||
            `Assunto identificado automaticamente via ${item.origin}.`,
          platform: mapCollectedPlatform(item.platform),
          segment: pick(SEGMENTS),
          status: 'CRESCENDO',
          growthIndex: randInt(45, 70),
          velocity: randInt(2, 20),
          origin: item.origin,
          aiConfidence: randInt(60, 90),
          postSuggestion: `Considere criar um conteúdo curto abordando "${item.title}" enquanto o assunto está em alta.`,
          state: 'BR',
          city: 'Nacional',
          hashtags: item.hashtags,
          views: item.views || randInt(500, 5000),
          engagementRate:
            item.engagementRate || Number(randInt(10, 60).toFixed(1)) / 10,
        },
      });
      created += 1;
    }

    if (items.length > 0) {
      this.logger.log(
        `upsertCollected: ${created} new trends, ${updated} refreshed.`,
      );
    }

    return { created, updated };
  }
}
