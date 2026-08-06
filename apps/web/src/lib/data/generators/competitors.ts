import { Rng } from "../rng";
import { PLATFORMS, SEGMENTS } from "../constants";
import type { Competitor } from "../types";

const NAMES = [
  "NetVelox Telecom",
  "ConectaMais Fibra",
  "TurboLink Internet",
  "OndaViva Telecom",
  "FibraSul Conecta",
  "RedeExpressa ISP",
  "NexoNet Provedor",
  "InfinitaBanda",
  "VoaNet Fibra Óptica",
  "PulseCom Internet",
];

const VISUAL_STYLES = [
  "Minimalista com tipografia bold e cores vibrantes",
  "Corporativo, tons sóbrios e muito uso de dados/gráficos",
  "Jovem e divertido, com memes e trends do TikTok",
  "Fotográfico realista com clientes reais em campo",
  "Motion graphics coloridos com muita animação",
];

const PALETTES = [
  ["#7C3AED", "#22D3EE", "#111827"],
  ["#F97316", "#111827", "#FFFFFF"],
  ["#059669", "#0EA5E9", "#F8FAFC"],
  ["#DC2626", "#111827", "#FBBF24"],
  ["#2563EB", "#F472B6", "#FFFFFF"],
];

const STRENGTHS = [
  "Alta frequência de postagem (quase diária)",
  "Boa resposta a comentários e DMs",
  "Vídeos curtos com edição muito dinâmica",
  "Uso consistente de depoimentos reais de clientes",
  "Anúncios pagos bem segmentados por bairro",
  "Presença forte em Reels e Stories",
];

const WEAKNESSES = [
  "Pouca variedade de formatos (só vídeo comercial)",
  "Legendas genéricas sem CTA claro",
  "Baixo engajamento em posts estáticos",
  "Não responde reclamações publicamente",
  "Excesso de promoção sem conteúdo educativo",
  "Falta de identidade visual consistente",
];

const WHAT_TO_COPY = [
  "Frequência alta de Reels curtos e diretos",
  "Uso de depoimentos reais de clientes satisfeitos",
  "CTA claro em todos os vídeos comerciais",
  "Resposta rápida a comentários públicos",
];

const WHAT_TO_AVOID = [
  "Excesso de promoção sem contexto ou storytelling",
  "Vídeos muito longos sem gancho inicial",
  "Falta de legendas e hashtags relevantes",
  "Tom robótico e pouco humano no atendimento público",
];

const OPPORTUNITIES = [
  "Explorar conteúdo educativo, que o concorrente ignora",
  "Investir em humor, formato pouco usado por eles",
  "Criar série fixa semanal para gerar recorrência",
  "Ocupar espaço em nichos como gamers e home office",
];

export function generateCompetitors(count: number, seed: string | number = "competitors-v1"): Competitor[] {
  const rng = new Rng(seed);
  const competitors: Competitor[] = [];

  for (let i = 0; i < count; i++) {
    const name = NAMES[i % NAMES.length];
    competitors.push({
      id: `competitor-${i}`,
      name,
      handle: `@${name.toLowerCase().replace(/\s+/g, "")}`,
      platforms: rng.pickMany(PLATFORMS, rng.int(2, 4)),
      segment: rng.pick(SEGMENTS),
      followers: rng.int(2500, 480000),
      postFrequencyPerWeek: rng.int(2, 14),
      avgEngagementRate: Number(rng.float(0.8, 9.5).toFixed(1)),
      colorPalette: rng.pick(PALETTES),
      visualStyle: rng.pick(VISUAL_STYLES),
      strengths: rng.pickMany(STRENGTHS, 3),
      weaknesses: rng.pickMany(WEAKNESSES, 3),
      whatToCopy: rng.pickMany(WHAT_TO_COPY, 3),
      whatToAvoid: rng.pickMany(WHAT_TO_AVOID, 3),
      opportunities: rng.pickMany(OPPORTUNITIES, 3),
    });
  }

  return competitors;
}

export const COMPETITORS = generateCompetitors(8);
