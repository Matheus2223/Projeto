import { Injectable } from '@nestjs/common';
import { Platform } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCompetitorInput {
  name: string;
  handle: string;
  platforms: Platform[];
  segment: string;
}

@Injectable()
export class CompetitorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.competitor.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /**
   * Registers a competitor for monitoring. Analysis fields (strengths,
   * whatToCopy, opportunities, ...) start empty and are filled in by the
   * daily scheduler once the AI has collected enough posts to analyze.
   */
  create(input: CreateCompetitorInput) {
    return this.prisma.competitor.create({
      data: {
        ...input,
        followers: 0,
        postFrequencyPerWeek: 0,
        avgEngagementRate: 0,
        colorPalette: [],
        visualStyle:
          'Em análise pela IA — os primeiros dados aparecerão após a próxima atualização diária.',
        strengths: [],
        weaknesses: [],
        whatToCopy: [],
        whatToAvoid: [],
        opportunities: [],
      },
    });
  }

  remove(id: string) {
    return this.prisma.competitor.delete({ where: { id } });
  }
}
