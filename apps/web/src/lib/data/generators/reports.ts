import { Rng } from "../rng";
import { TOPICS } from "../vocab";
import type { DailyReport } from "../types";

export function generateDailyReport(seed: string | number = "report-v1"): DailyReport {
  const rng = new Rng(seed);

  const opportunities = Array.from({ length: 4 }).map(() => {
    const topic = rng.pick(TOPICS);
    return {
      title: `Oportunidade em ${topic}`,
      description: `Buscas e menções sobre ${topic} cresceram nas últimas 48h sem saturação de conteúdo — janela ideal para publicar.`,
      score: rng.int(65, 97),
    };
  });

  const threats = Array.from({ length: 3 }).map(() => {
    const topic = rng.pick(TOPICS);
    return {
      title: `Saturação em ${topic}`,
      description: `Concorrentes já publicaram volume alto sobre ${topic} nesta semana, reduzindo o potencial de alcance orgânico.`,
      severity: rng.pick(["baixa", "média", "alta"] as const),
    };
  });

  return {
    date: new Date().toISOString(),
    opportunities,
    threats,
    hotTopics: rng.pickMany(TOPICS, 6),
    saturatedTopics: rng.pickMany(TOPICS, 4),
    tomorrowForecast:
      "A IA projeta aumento de interesse em conteúdos sobre internet para home office e streaming, impulsionado por sazonalidade de fim de mês.",
    weekForecast:
      "Semana favorável para campanhas de fibra óptica residencial e combos com TV, com pico de conversão previsto para quinta e sexta-feira.",
    viralProbability: rng.int(48, 92),
    opportunityScore: rng.int(60, 95),
  };
}

export const DAILY_REPORT = generateDailyReport();
