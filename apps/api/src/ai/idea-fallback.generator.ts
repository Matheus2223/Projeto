import {
  TOPICS,
  HOOK_TEMPLATES,
  CTA_TEMPLATES,
  OBJECTIVES,
  EQUIPMENT,
  SEGMENTS,
  pick,
  pickMany,
  randInt,
  fillTemplate,
} from '../common/content-vocab';
import type { GeneratedIdeaPayload } from './generated-idea.types';

const FORMATS = [
  'Reels',
  'Stories',
  'Carrossel',
  'Post único',
  'Vídeo educativo',
  'Vídeo comercial',
];
const PLATFORMS = [
  'instagram',
  'tiktok',
  'facebook',
  'youtube_shorts',
  'threads',
];
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil'];

/**
 * `topics` may be full-sentence trend/news titles (real headlines collected
 * by the integrations), which don't fit grammatically into a `{topic}`
 * placeholder ("O erro que 9 em cada 10 clientes cometem com <headline>").
 * The template-based fallback always draws from the curated, grammatically
 * safe ISP topic vocabulary — but biases towards whichever entry actually
 * appears in the collected headlines, so today's ideas still track what's
 * really trending. Free-form headlines are used as-is by the OpenAI path
 * instead, which can handle them properly.
 */
function pickRelevantTopic(topics: string[]): string {
  const haystack = topics.join(' ').toLowerCase();
  const matches = TOPICS.filter((topic) =>
    haystack.includes(topic.toLowerCase()),
  );
  return matches.length > 0 ? pick(matches) : pick(TOPICS);
}

/**
 * Deterministic-free, rule-based idea generator used whenever OPENAI_API_KEY
 * isn't configured — mirrors apps/web/src/lib/ai/fallback-responder.ts so
 * the daily pipeline always produces something, with or without an AI key.
 */
export function generateFallbackIdeas(
  topics: string[],
  count: number,
): GeneratedIdeaPayload[] {
  return Array.from({ length: count }).map(() => {
    const topic = pickRelevantTopic(topics);
    const hook = fillTemplate(pick(HOOK_TEMPLATES), topic);
    const cta = fillTemplate(pick(CTA_TEMPLATES), topic);
    const format = pick(FORMATS);

    return {
      format,
      title: `${format}: ${hook}`,
      hook,
      script: [
        `Abertura (0-3s): ${hook}.`,
        `Contexto (3-8s): mostre o problema real com ${topic}.`,
        `Demonstração (8-18s): grave a solução em ação.`,
        `Fechamento (24-30s): ${cta}.`,
      ],
      estimatedTime: '15-30s',
      cta,
      caption: `${hook} 👇 ${cta}`,
      hashtags: pickMany(
        [
          '#internet',
          '#fibraoptica',
          '#wifi',
          '#provedor',
          '#internetrapida',
          '#conectividade',
        ],
        4,
      ),
      objective: pick(OBJECTIVES),
      difficulty: pick(DIFFICULTIES),
      recordingTime: `${randInt(5, 45)} min`,
      equipment: pickMany(EQUIPMENT, randInt(2, 3)),
      platform: pick(PLATFORMS),
      segment: pick(SEGMENTS),
    };
  });
}
