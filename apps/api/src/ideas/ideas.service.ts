import { Injectable } from '@nestjs/common';
import {
  ContentFormat,
  Difficulty,
  Platform,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface IdeaQuery {
  search?: string;
  format?: ContentFormat;
  platform?: Platform;
  difficulty?: Difficulty;
  take?: number;
  skip?: number;
}

@Injectable()
export class IdeasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: IdeaQuery) {
    const { search, format, platform, difficulty, take = 24, skip = 0 } = query;
    return this.prisma.contentIdea.findMany({
      where: {
        hook: search ? { contains: search, mode: 'insensitive' } : undefined,
        format,
        platform,
        difficulty,
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  findOne(id: string) {
    return this.prisma.contentIdea.findUnique({ where: { id } });
  }

  toggleFavorite(userId: string, ideaId: string) {
    return this.prisma.contentIdeaFavorite
      .delete({ where: { userId_ideaId: { userId, ideaId } } })
      .catch(() =>
        this.prisma.contentIdeaFavorite.create({ data: { userId, ideaId } }),
      );
  }
}
