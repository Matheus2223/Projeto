import { Injectable } from '@nestjs/common';
import { Platform, TrendStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
}
