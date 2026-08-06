import { Rng } from "../rng";
import { TOPICS } from "../vocab";
import { CONTENT_FORMATS } from "../constants";
import { TRENDS } from "./trends";
import { POSTS } from "./posts";

export interface RankedItem {
  label: string;
  metric: string;
  sub?: string;
}

const MUSIC_ARTISTS = ["Anitta", "Marília Mendonça", "Jão", "Ludmilla", "Pedro Sampaio", "Ana Castela", "Duda Beat", "Matuê"];
const MUSIC_SUFFIX = ["(trend remix)", "- áudio original", "(slowed)", "- versão viral", "(speed up)"];

const MEME_FORMATS = [
  "Formato 'antes de sair de casa' aplicado à internet",
  "Meme 'ninguém: / absolutamente ninguém:' sobre Wi-Fi",
  "Trend do 'POV chorando de alívio' ao ver a conta",
  "Áudio de choro dramático usado para reclamar da internet",
  "Formato 'expectativa vs realidade' com velocidade",
  "Meme do personagem confuso olhando pro roteador",
  "Trend 'diz o nome que eu adivinho' aplicado a planos",
  "Formato humor 'ligando pro suporte às 3h da manhã'",
];

const SEARCH_SUFFIXES = [
  "caiu agora",
  "não conecta",
  "melhor provedor perto de mim",
  "quanto custa por mês",
  "teste de velocidade",
  "como aumentar sinal",
  "instalação quanto tempo demora",
  "vale a pena trocar",
];

const CREATOR_NAMES = [
  "@techcombras", "@internetsemenrolacao", "@conectadobr", "@fibraflow",
  "@wifihero", "@redesocialtech", "@provedorexplica", "@velocidadereal",
];

const CAMPAIGN_NAMES = [
  "Campanha Dia dos Pais — Combo Família Conectada",
  "Campanha Volta às Aulas — Home Office Turbo",
  "Campanha Black Friday — Fibra em Dobro",
  "Campanha Dia das Mães — Presente que Conecta",
  "Campanha Verão — Streaming sem Travar",
  "Campanha Aniversário da Empresa — Fidelidade Premiada",
];

export function generateDashboardExtras(seed: string | number = "dash-extras-v1") {
  const rng = new Rng(seed);

  const hashtagCounts = new Map<string, number>();
  [...TRENDS.flatMap((t) => t.hashtags), ...POSTS.flatMap((p) => p.hashtags)].forEach((tag) => {
    hashtagCounts.set(tag, (hashtagCounts.get(tag) ?? 0) + 1);
  });
  const topHashtags: RankedItem[] = [...hashtagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ label: tag, metric: `${count * rng.int(180, 640)} usos` }));

  const topMusics: RankedItem[] = Array.from({ length: 10 }).map(() => ({
    label: `${rng.pick(MUSIC_ARTISTS)} ${rng.pick(MUSIC_SUFFIX)}`,
    metric: `${rng.int(12, 890)}k vídeos`,
  }));

  const topMemes: RankedItem[] = rng.pickMany(MEME_FORMATS, 8).map((label) => ({
    label,
    metric: `+${rng.int(35, 210)}%`,
  }));

  const topSearches: RankedItem[] = Array.from({ length: 10 }).map(() => {
    const topic = rng.pick(TOPICS);
    return {
      label: `${topic} ${rng.pick(SEARCH_SUFFIXES)}`,
      metric: `${compactVolume(rng.int(800, 90000))}/mês`,
    };
  });

  const topCreators: RankedItem[] = rng.pickMany(CREATOR_NAMES, 8).map((label) => ({
    label,
    metric: `${rng.int(12, 480)}k seguidores`,
    sub: `Engajamento ${rng.float(2, 11).toFixed(1)}%`,
  }));

  const topCampaigns: RankedItem[] = CAMPAIGN_NAMES.map((label) => ({
    label,
    metric: `Score ${rng.int(60, 98)}`,
  }));

  const topFormats: RankedItem[] = CONTENT_FORMATS.map((format) => ({
    label: format,
    metric: `${rng.int(45, 98)}% de aprovação`,
  })).sort((a, b) => parseInt(b.metric) - parseInt(a.metric));

  return { topHashtags, topMusics, topMemes, topSearches, topCreators, topCampaigns, topFormats };
}

function compactVolume(n: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export const DASHBOARD_EXTRAS = generateDashboardExtras();
