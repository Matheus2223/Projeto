import { apiFetch, apiPost } from "./client";
import {
  mapPlatform,
  mapSegment,
  mapFormat,
  mapDifficulty,
  mapTrendStatus,
  mapBankCategory,
  mapPostStatus,
  mapCalendarStatus,
} from "./mappers";
import type { Trend, ContentIdea, BankItem, PostItem, Competitor, CalendarEntry, NewsItem, DailyReport } from "../data/types";

import { TRENDS } from "../data/generators/trends";
import { CONTENT_IDEAS } from "../data/generators/ideas";
import { BANKS } from "../data/generators/banks";
import { POSTS } from "../data/generators/posts";
import { COMPETITORS } from "../data/generators/competitors";
import { CALENDAR_ENTRIES } from "../data/generators/calendar";
import { NEWS } from "../data/generators/news";
import { DAILY_REPORT } from "../data/generators/reports";

// --- raw shapes returned by the NestJS API (camelCase, SCREAMING enums) ----

interface ApiTrend {
  id: string;
  title: string;
  summary: string;
  platform: string;
  segment: string;
  status: string;
  growthIndex: number;
  velocity: number;
  detectedAt: string;
  origin: string;
  aiConfidence: number;
  postSuggestion: string;
  state: string;
  city: string;
  hashtags: string[];
  views: number;
  engagementRate: number;
}

interface ApiContentIdea {
  id: string;
  format: string;
  title: string;
  hook: string;
  script: string[];
  estimatedTime: string;
  cta: string;
  caption: string;
  hashtags: string[];
  objective: string;
  difficulty: string;
  recordingTime: string;
  equipment: string[];
  aiPrompt: string;
  platform: string;
  segment: string;
  createdAt: string;
}

interface ApiBankItem {
  id: string;
  category: string;
  text: string;
  platform: string;
  segment: string;
  performanceScore: number;
  usageCount: number;
  tags: string[];
}

interface ApiPost {
  id: string;
  title: string;
  format: string;
  platform: string;
  segment: string;
  caption: string;
  hashtags: string[];
  status: string;
  scheduledAt: string | null;
  gradient: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

interface ApiCompetitor {
  id: string;
  name: string;
  handle: string;
  platforms: string[];
  segment: string;
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

interface ApiCalendarEntry {
  id: string;
  date: string;
  weekday: string;
  theme: string;
  objective: string;
  format: string;
  platform: string;
  script: string;
  caption: string;
  cta: string;
  suggestedTime: string;
  status: string;
}

interface ApiNewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  publishedAt: string;
  summary: string;
  relevanceScore: number;
  url: string;
}

interface ApiDailyReport {
  date: string;
  opportunities: { title: string; description: string; score: number }[];
  threats: { title: string; description: string; severity: string }[];
  hotTopics: string[];
  saturatedTopics: string[];
  tomorrowForecast: string;
  weekForecast: string;
  viralProbability: number;
  opportunityScore: number;
}

// --- mapping ----------------------------------------------------------------

const toTrend = (t: ApiTrend): Trend => ({
  id: t.id,
  title: t.title,
  summary: t.summary,
  platform: mapPlatform(t.platform),
  segment: mapSegment(t.segment),
  status: mapTrendStatus(t.status),
  growthIndex: t.growthIndex,
  velocity: t.velocity,
  date: t.detectedAt,
  origin: t.origin,
  aiConfidence: t.aiConfidence,
  postSuggestion: t.postSuggestion,
  state: t.state,
  city: t.city,
  hashtags: t.hashtags,
  views: t.views,
  engagementRate: t.engagementRate,
});

const toIdea = (i: ApiContentIdea): ContentIdea => ({
  id: i.id,
  format: mapFormat(i.format),
  title: i.title,
  hook: i.hook,
  script: i.script,
  estimatedTime: i.estimatedTime,
  cta: i.cta,
  caption: i.caption,
  hashtags: i.hashtags,
  objective: i.objective,
  difficulty: mapDifficulty(i.difficulty),
  recordingTime: i.recordingTime,
  equipment: i.equipment,
  aiPrompt: i.aiPrompt,
  platform: mapPlatform(i.platform),
  segment: mapSegment(i.segment),
  createdAt: i.createdAt,
});

const toBankItem = (b: ApiBankItem): BankItem => ({
  id: b.id,
  category: mapBankCategory(b.category),
  text: b.text,
  platform: mapPlatform(b.platform),
  segment: mapSegment(b.segment),
  performanceScore: b.performanceScore,
  usageCount: b.usageCount,
  tags: b.tags,
});

const toPost = (p: ApiPost): PostItem => ({
  id: p.id,
  title: p.title,
  format: mapFormat(p.format),
  platform: mapPlatform(p.platform),
  segment: mapSegment(p.segment),
  caption: p.caption,
  hashtags: p.hashtags,
  status: mapPostStatus(p.status),
  scheduledAt: p.scheduledAt ?? new Date().toISOString(),
  gradient: p.gradient,
  metrics: {
    views: p.viewsCount,
    likes: p.likesCount,
    comments: p.commentsCount,
    shares: p.sharesCount,
  },
});

const toCompetitor = (c: ApiCompetitor): Competitor => ({
  id: c.id,
  name: c.name,
  handle: c.handle,
  platforms: c.platforms.map(mapPlatform),
  segment: mapSegment(c.segment),
  followers: c.followers,
  postFrequencyPerWeek: c.postFrequencyPerWeek,
  avgEngagementRate: c.avgEngagementRate,
  colorPalette: c.colorPalette,
  visualStyle: c.visualStyle,
  strengths: c.strengths,
  weaknesses: c.weaknesses,
  whatToCopy: c.whatToCopy,
  whatToAvoid: c.whatToAvoid,
  opportunities: c.opportunities,
});

const toCalendarEntry = (c: ApiCalendarEntry): CalendarEntry => ({
  id: c.id,
  date: c.date,
  weekday: c.weekday,
  theme: c.theme,
  objective: c.objective,
  format: mapFormat(c.format),
  platform: mapPlatform(c.platform),
  script: c.script,
  caption: c.caption,
  cta: c.cta,
  suggestedTime: c.suggestedTime,
  status: mapCalendarStatus(c.status),
});

const toNews = (n: ApiNewsItem): NewsItem => ({
  id: n.id,
  title: n.title,
  source: n.source,
  category: n.category,
  publishedAt: n.publishedAt,
  summary: n.summary,
  relevanceScore: n.relevanceScore,
  url: n.url,
});

const toReport = (r: ApiDailyReport): DailyReport => ({
  date: r.date,
  opportunities: r.opportunities,
  threats: r.threats.map((t) => ({ ...t, severity: t.severity as DailyReport["threats"][number]["severity"] })),
  hotTopics: r.hotTopics,
  saturatedTopics: r.saturatedTopics,
  tomorrowForecast: r.tomorrowForecast,
  weekForecast: r.weekForecast,
  viralProbability: r.viralProbability,
  opportunityScore: r.opportunityScore,
});

// --- public fetchers: always resolve, falling back to mock on any failure --

export async function getTrends(): Promise<Trend[]> {
  try {
    const rows = await apiFetch<ApiTrend[]>("/trends?take=200");
    return rows.map(toTrend);
  } catch {
    return TRENDS;
  }
}

export async function getIdeas(): Promise<ContentIdea[]> {
  try {
    const rows = await apiFetch<ApiContentIdea[]>("/ideas?take=200");
    return rows.map(toIdea);
  } catch {
    return CONTENT_IDEAS;
  }
}

const BANK_CATEGORY_API: Record<keyof typeof BANKS, string> = {
  hooks: "HOOK",
  ctas: "CTA",
  headlines: "HEADLINE",
  questions: "QUESTION",
  objections: "OBJECTION",
  ideas: "IDEA",
};

export async function getBankItems(bank: keyof typeof BANKS): Promise<BankItem[]> {
  try {
    const rows = await apiFetch<ApiBankItem[]>(`/banks/${BANK_CATEGORY_API[bank]}?take=600`);
    return rows.map(toBankItem);
  } catch {
    return BANKS[bank];
  }
}

export async function getPosts(): Promise<PostItem[]> {
  try {
    const rows = await apiFetch<ApiPost[]>("/posts?take=200");
    return rows.map(toPost);
  } catch {
    return POSTS;
  }
}

export async function getCompetitors(): Promise<Competitor[]> {
  try {
    const rows = await apiFetch<ApiCompetitor[]>("/competitors");
    return rows.map(toCompetitor);
  } catch {
    return COMPETITORS;
  }
}

export async function createCompetitor(input: {
  name: string;
  handle: string;
  platforms: string[];
  segment: string;
}): Promise<Competitor | null> {
  try {
    const row = await apiPost<ApiCompetitor>("/competitors", {
      ...input,
      platforms: input.platforms.map((p) => p.toUpperCase()),
    });
    return toCompetitor(row);
  } catch {
    return null;
  }
}

export async function getCalendar(): Promise<CalendarEntry[]> {
  try {
    const rows = await apiFetch<ApiCalendarEntry[]>("/calendar");
    if (rows.length === 0) return CALENDAR_ENTRIES;
    return rows.map(toCalendarEntry);
  } catch {
    return CALENDAR_ENTRIES;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const rows = await apiFetch<ApiNewsItem[]>("/news?take=100");
    return rows.map(toNews);
  } catch {
    return NEWS;
  }
}

export async function getDailyReport(): Promise<DailyReport> {
  try {
    const row = await apiFetch<ApiDailyReport>("/reports/latest");
    return toReport(row);
  } catch {
    return DAILY_REPORT;
  }
}
