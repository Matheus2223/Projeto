import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string, take = 30, skip = 0) {
    return this.prisma.newsItem.findMany({
      where: search
        ? { title: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { publishedAt: 'desc' },
      take,
      skip,
    });
  }
}
