import { Rng } from "../rng";
import { PLATFORMS, SEGMENTS, BR_STATES, BR_CITIES, TrendStatus } from "../constants";
import { TOPICS, HASHTAG_POOL } from "../vocab";
import type { Trend } from "../types";

const STATUSES: TrendStatus[] = ["crescendo", "explodindo", "viral", "caindo", "oportunidade", "saturado"];

const TITLE_TEMPLATES = [
  "Vídeos mostrando velocidade real de {topic} bombando",
  "Trend de comparação: {topic} antes e depois",
  "Áudio viral usado em posts sobre {topic}",
  "Formato 'POV' aplicado para {topic}",
  "Memes sobre {topic} circulando nas redes",
  "Desafio de 24h sem {topic}",
  "Transição criativa mostrando upgrade de {topic}",
  "Reação de clientes testando {topic} ao vivo",
  "Comparativo de provedores sobre {topic}",
  "Notícia sobre regulação de {topic} repercutindo",
  "Story com enquete sobre {topic}",
  "Carrossel educativo sobre {topic} salvando muito",
  "Live tirando dúvidas sobre {topic}",
  "Corte de podcast falando sobre {topic}",
  "Reels com humor sobre {topic} viralizando",
];

const ORIGINS = [
  "Alta viralização detectada no TikTok",
  "Aumento de buscas no Google Trends",
  "Pico de menções no Reddit e X",
  "Repercussão em portais de tecnologia",
  "Crescimento orgânico no Instagram Reels",
  "Matéria destaque em portal de telecom",
  "Discussão em alta em grupos do Facebook",
  "Aumento de perguntas no suporte ao cliente",
  "Tendência sazonal identificada pela IA",
  "Comunicado da Anatel repercutindo nas redes",
];

export function generateTrends(count: number, seed: string | number = "trends-v1"): Trend[] {
  const rng = new Rng(seed);
  const now = Date.now();
  const trends: Trend[] = [];

  for (let i = 0; i < count; i++) {
    const topic = rng.pick(TOPICS);
    const status = rng.pick(STATUSES);
    const platform = rng.pick(PLATFORMS);
    const segment = rng.pick(SEGMENTS);
    const state = rng.pick(BR_STATES);
    const cities = BR_CITIES[state] ?? ["Capital"];
    const city = rng.pick(cities);
    const daysAgo = rng.int(0, 6);

    const growthByStatus: Record<TrendStatus, [number, number]> = {
      crescendo: [55, 78],
      explodindo: [80, 96],
      viral: [88, 99],
      caindo: [10, 35],
      oportunidade: [40, 65],
      saturado: [20, 45],
    };
    const [gMin, gMax] = growthByStatus[status];

    trends.push({
      id: `trend-${i}`,
      title: rng.pick(TITLE_TEMPLATES).replace("{topic}", topic),
      summary: `A IA identificou um padrão consistente de crescimento em conteúdos sobre ${topic}, com repercussão em múltiplos perfis do segmento de ${segment.toLowerCase()}.`,
      platform,
      segment,
      status,
      growthIndex: rng.int(gMin, gMax),
      velocity: Number(rng.float(-8, 42).toFixed(1)),
      date: new Date(now - daysAgo * 86400000).toISOString(),
      origin: rng.pick(ORIGINS),
      aiConfidence: rng.int(62, 98),
      postSuggestion: `Grave um Reels de até 30s mostrando ${topic} na prática, usando um gancho de curiosidade e finalizando com uma chamada para orçamento gratuito.`,
      state,
      city,
      hashtags: rng.pickMany(HASHTAG_POOL, rng.int(3, 6)),
      views: rng.int(1200, 890000),
      engagementRate: Number(rng.float(1.2, 14.8).toFixed(1)),
    });
  }

  return trends.sort((a, b) => b.growthIndex - a.growthIndex);
}

export const TRENDS = generateTrends(140);
