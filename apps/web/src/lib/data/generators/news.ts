import { Rng } from "../rng";
import { TOPICS } from "../vocab";
import type { NewsItem } from "../types";

const SOURCES = [
  "TeleSíntese",
  "Convergência Digital",
  "TudoCelular",
  "Anatel Notícias",
  "Portal Telecom",
  "TechTudo",
  "Olhar Digital",
  "Mobile Time",
];

const CATEGORIES = ["Regulação", "Mercado", "Tecnologia", "Consumo", "Infraestrutura"];

const TITLE_TEMPLATES = [
  "Anatel divulga novos dados sobre {topic} no Brasil",
  "Brasileiros consomem mais {topic} durante a alta temporada",
  "Provedores regionais investem em {topic} para competir com grandes operadoras",
  "Pesquisa aponta crescimento de reclamações sobre {topic}",
  "Nova tecnologia promete revolucionar {topic}",
  "Governo anuncia programa de incentivo à {topic} em áreas rurais",
  "Consumidores buscam mais transparência sobre {topic}",
  "Setor de telecom debate futuro de {topic} em evento nacional",
];

export function generateNews(count: number, seed: string | number = "news-v1"): NewsItem[] {
  const rng = new Rng(seed);
  const now = Date.now();
  const items: NewsItem[] = [];

  for (let i = 0; i < count; i++) {
    const topic = rng.pick(TOPICS);
    const title = rng.pick(TITLE_TEMPLATES).replace("{topic}", topic);
    items.push({
      id: `news-${i}`,
      title,
      source: rng.pick(SOURCES),
      category: rng.pick(CATEGORIES),
      publishedAt: new Date(now - rng.int(0, 72) * 3600000).toISOString(),
      summary: `Levantamento mostra impacto direto no setor de provedores de internet, com oportunidades para conteúdo educativo e institucional sobre ${topic}.`,
      relevanceScore: rng.int(40, 99),
      url: "#",
    });
  }

  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const NEWS = generateNews(60);
