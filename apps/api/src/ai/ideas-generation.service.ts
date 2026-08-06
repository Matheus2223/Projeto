import { Injectable, Logger } from '@nestjs/common';
import {
  ContentFormat,
  Difficulty,
  Platform,
  Prisma,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';
import { generateFallbackIdeas } from './idea-fallback.generator';
import type { GeneratedIdeaPayload } from './generated-idea.types';

const FORMAT_MAP: Record<string, ContentFormat> = {
  Reels: 'REELS',
  Stories: 'STORIES',
  Carrossel: 'CARROSSEL',
  'Post único': 'POST_UNICO',
  Campanha: 'CAMPANHA',
  Anúncio: 'ANUNCIO',
  'Vídeo engraçado': 'VIDEO_ENGRACADO',
  'Vídeo emocionante': 'VIDEO_EMOCIONANTE',
  'Vídeo educativo': 'VIDEO_EDUCATIVO',
  'Vídeo comercial': 'VIDEO_COMERCIAL',
};

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  Fácil: 'FACIL',
  Médio: 'MEDIO',
  Difícil: 'DIFICIL',
};

function mapPlatform(value: string): Platform {
  const upper = value.toUpperCase();
  const valid: string[] = [
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
  return (valid.includes(upper) ? upper : 'INSTAGRAM') as Platform;
}

function toContentIdeaInput(
  idea: GeneratedIdeaPayload,
  topic: string,
): Prisma.ContentIdeaCreateManyInput {
  const format = FORMAT_MAP[idea.format] ?? 'POST_UNICO';
  const difficulty = DIFFICULTY_MAP[idea.difficulty] ?? 'MEDIO';

  return {
    format,
    title: idea.title,
    hook: idea.hook,
    script: idea.script,
    estimatedTime: idea.estimatedTime,
    cta: idea.cta,
    caption: idea.caption,
    hashtags: idea.hashtags,
    objective: idea.objective,
    difficulty,
    recordingTime: idea.recordingTime,
    equipment: idea.equipment,
    aiPrompt: `Crie um roteiro de ${idea.format.toLowerCase()} para provedor de internet sobre "${topic}", com gancho de impacto nos primeiros 3 segundos, finalizando com a chamada: "${idea.cta}".`,
    platform: mapPlatform(idea.platform),
    segment: idea.segment,
  };
}

@Injectable()
export class IdeasGenerationService {
  private readonly logger = new Logger(IdeasGenerationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  /**
   * Generates `count` new ContentIdea rows from the given topics, trying
   * OpenAI first and transparently falling back to the local rule-based
   * generator (idea-fallback.generator.ts) when no API key is configured or
   * the request fails — the daily pipeline always produces ideas either way.
   */
  async generateAndPersist(
    topics: string[],
    count: number,
  ): Promise<{ created: number; usedAi: boolean }> {
    let payloads: GeneratedIdeaPayload[];
    let usedAi = true;

    try {
      payloads = await this.ai.generateContentIdeas(topics, count);
      if (payloads.length === 0) throw new Error('IA retornou zero ideias');
    } catch (error) {
      this.logger.warn(
        `Falling back to rule-based idea generation: ${(error as Error).message}`,
      );
      usedAi = false;
      payloads = generateFallbackIdeas(topics, count);
    }

    // topics[0] may be a full headline; truncate so the aiPrompt shown in
    // the UI reads as a topic reference, not a wall of text.
    const rawTopic = topics[0] ?? 'internet';
    const topic =
      rawTopic.length > 70 ? `${rawTopic.slice(0, 70)}...` : rawTopic;
    const data = payloads.map((idea) => toContentIdeaInput(idea, topic));

    const result = await this.prisma.contentIdea.createMany({ data });
    return { created: result.count, usedAi };
  }
}
