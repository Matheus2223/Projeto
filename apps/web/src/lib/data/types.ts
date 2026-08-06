import type { Platform, Segment, TrendStatus, ContentFormat, Difficulty } from "./constants";

export interface Trend {
  id: string;
  title: string;
  summary: string;
  platform: Platform;
  segment: Segment;
  status: TrendStatus;
  growthIndex: number; // 0-100
  velocity: number; // % per day
  date: string; // ISO
  origin: string;
  aiConfidence: number; // 0-100
  postSuggestion: string;
  state: string;
  city: string;
  hashtags: string[];
  views: number;
  engagementRate: number;
}

export interface ContentIdea {
  id: string;
  format: ContentFormat;
  title: string;
  hook: string;
  script: string[];
  estimatedTime: string;
  cta: string;
  caption: string;
  hashtags: string[];
  objective: string;
  difficulty: Difficulty;
  recordingTime: string;
  equipment: string[];
  aiPrompt: string;
  platform: Platform;
  segment: Segment;
  createdAt: string;
  favorited?: boolean;
}

export type BankCategory = "hook" | "cta" | "headline" | "question" | "objection" | "idea";

export interface BankItem {
  id: string;
  category: BankCategory;
  text: string;
  platform: Platform;
  segment: Segment;
  performanceScore: number;
  usageCount: number;
  tags: string[];
}

export interface PostItem {
  id: string;
  title: string;
  format: ContentFormat;
  platform: Platform;
  segment: Segment;
  caption: string;
  hashtags: string[];
  status: "rascunho" | "agendado" | "publicado";
  scheduledAt: string;
  gradient: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platforms: Platform[];
  segment: Segment;
  followers: number;
  postFrequencyPerWeek: number;
  avgEngagementRate: number;
  colorPalette: string[];
  visualStyle: string;
  strengths: string[];
  weaknesses: string[];
  whatToCopy: string[];
  whatToAvoid: string[];
  opportunities: string[];
}

export interface CalendarEntry {
  id: string;
  date: string;
  weekday: string;
  theme: string;
  objective: string;
  format: ContentFormat;
  platform: Platform;
  script: string;
  caption: string;
  cta: string;
  suggestedTime: string;
  status: "planejado" | "produzido" | "publicado";
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  publishedAt: string;
  summary: string;
  relevanceScore: number;
  url: string;
}

export interface DailyReport {
  date: string;
  opportunities: { title: string; description: string; score: number }[];
  threats: { title: string; description: string; severity: "baixa" | "média" | "alta" }[];
  hotTopics: string[];
  saturatedTopics: string[];
  tomorrowForecast: string;
  weekForecast: string;
  viralProbability: number;
  opportunityScore: number;
}
