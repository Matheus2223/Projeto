import { Injectable } from '@nestjs/common';
import { BankCategory, Platform } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface BankQuery {
  category: BankCategory;
  search?: string;
  platform?: Platform;
  sort?: 'performance' | 'usage';
  take?: number;
  skip?: number;
}

@Injectable()
export class BanksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: BankQuery) {
    const {
      category,
      search,
      platform,
      sort = 'performance',
      take = 40,
      skip = 0,
    } = query;
    return this.prisma.bankItem.findMany({
      where: {
        category,
        platform,
        text: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy:
        sort === 'performance'
          ? { performanceScore: 'desc' }
          : { usageCount: 'desc' },
      take,
      skip,
    });
  }

  incrementUsage(id: string) {
    return this.prisma.bankItem.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}
