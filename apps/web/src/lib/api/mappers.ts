import type { Platform, ContentFormat, Difficulty, Segment } from "../data/constants";
import type { BankCategory } from "../data/types";

// The backend stores enums as SCREAMING_SNAKE_CASE (Prisma convention); the
// frontend uses lowercase / accented display strings. These map 1:1 with the
// domain, so failures here should be loud (uncaught) rather than silently
// falling back to a wrong label.

export function mapPlatform(apiPlatform: string): Platform {
  return apiPlatform.toLowerCase() as Platform;
}

export function mapSegment(apiSegment: string): Segment {
  return apiSegment as Segment;
}

const FORMAT_MAP: Record<string, ContentFormat> = {
  REELS: "Reels",
  STORIES: "Stories",
  CARROSSEL: "Carrossel",
  POST_UNICO: "Post único",
  CAMPANHA: "Campanha",
  ANUNCIO: "Anúncio",
  VIDEO_ENGRACADO: "Vídeo engraçado",
  VIDEO_EMOCIONANTE: "Vídeo emocionante",
  VIDEO_EDUCATIVO: "Vídeo educativo",
  VIDEO_COMERCIAL: "Vídeo comercial",
};

export function mapFormat(apiFormat: string): ContentFormat {
  return FORMAT_MAP[apiFormat] ?? "Post único";
}

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  FACIL: "Fácil",
  MEDIO: "Médio",
  DIFICIL: "Difícil",
};

export function mapDifficulty(apiDifficulty: string): Difficulty {
  return DIFFICULTY_MAP[apiDifficulty] ?? "Médio";
}

export function mapTrendStatus(apiStatus: string) {
  return apiStatus.toLowerCase() as import("../data/constants").TrendStatus;
}

export function mapBankCategory(apiCategory: string): BankCategory {
  return apiCategory.toLowerCase() as BankCategory;
}

export function mapPostStatus(apiStatus: string): "rascunho" | "agendado" | "publicado" {
  return apiStatus.toLowerCase() as "rascunho" | "agendado" | "publicado";
}

export function mapCalendarStatus(apiStatus: string): "planejado" | "produzido" | "publicado" {
  return apiStatus.toLowerCase() as "planejado" | "produzido" | "publicado";
}
