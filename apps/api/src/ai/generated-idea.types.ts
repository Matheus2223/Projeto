// Loosely-typed shape shared by the real (OpenAI) and fallback (rule-based)
// idea generators — string labels here, mapped to Prisma enums by the
// caller (see mapGeneratedIdea in ideas-generation.service.ts).

export interface GeneratedIdeaPayload {
  format: string; // "Reels" | "Stories" | "Carrossel" | "Post único" | "Vídeo educativo" | "Vídeo comercial" | ...
  title: string;
  hook: string;
  script: string[];
  estimatedTime: string;
  cta: string;
  caption: string;
  hashtags: string[];
  objective: string;
  difficulty: string; // "Fácil" | "Médio" | "Difícil"
  recordingTime: string;
  equipment: string[];
  platform: string; // "instagram" | "tiktok" | "facebook" | "youtube_shorts" | "threads" | ...
  segment: string;
}
