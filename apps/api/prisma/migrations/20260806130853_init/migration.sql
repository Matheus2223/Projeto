-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'YOUTUBE_SHORTS', 'THREADS', 'GOOGLE_TRENDS', 'GOOGLE_NEWS', 'REDDIT', 'X', 'PINTEREST', 'LINKEDIN', 'BLOG', 'ANATEL');

-- CreateEnum
CREATE TYPE "TrendStatus" AS ENUM ('CRESCENDO', 'EXPLODINDO', 'VIRAL', 'CAINDO', 'OPORTUNIDADE', 'SATURADO');

-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('REELS', 'STORIES', 'CARROSSEL', 'POST_UNICO', 'CAMPANHA', 'ANUNCIO', 'VIDEO_ENGRACADO', 'VIDEO_EMOCIONANTE', 'VIDEO_EDUCATIVO', 'VIDEO_COMERCIAL');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL');

-- CreateEnum
CREATE TYPE "BankCategory" AS ENUM ('HOOK', 'CTA', 'HEADLINE', 'QUESTION', 'OBJECTION', 'IDEA');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('RASCUNHO', 'AGENDADO', 'PUBLICADO');

-- CreateEnum
CREATE TYPE "CalendarStatus" AS ENUM ('PLANEJADO', 'PRODUZIDO', 'PUBLICADO');

-- CreateEnum
CREATE TYPE "ThreatSeverity" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "UpdateRunStatus" AS ENUM ('SUCESSO', 'PARCIAL', 'FALHOU');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trends" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "segment" TEXT NOT NULL,
    "status" "TrendStatus" NOT NULL,
    "growthIndex" INTEGER NOT NULL,
    "velocity" DOUBLE PRECISION NOT NULL,
    "origin" TEXT NOT NULL,
    "aiConfidence" INTEGER NOT NULL,
    "postSuggestion" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "hashtags" TEXT[],
    "views" INTEGER NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_ideas" (
    "id" TEXT NOT NULL,
    "format" "ContentFormat" NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "script" TEXT[],
    "estimatedTime" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "hashtags" TEXT[],
    "objective" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "recordingTime" TEXT NOT NULL,
    "equipment" TEXT[],
    "aiPrompt" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "segment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_idea_favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_idea_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_items" (
    "id" TEXT NOT NULL,
    "category" "BankCategory" NOT NULL,
    "text" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "segment" TEXT NOT NULL,
    "performanceScore" INTEGER NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "format" "ContentFormat" NOT NULL,
    "platform" "Platform" NOT NULL,
    "segment" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "hashtags" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'RASCUNHO',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "gradient" TEXT NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "sharesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "platforms" "Platform"[],
    "segment" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "postFrequencyPerWeek" INTEGER NOT NULL,
    "avgEngagementRate" DOUBLE PRECISION NOT NULL,
    "colorPalette" TEXT[],
    "visualStyle" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "whatToCopy" TEXT[],
    "whatToAvoid" TEXT[],
    "opportunities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAnalyzedAt" TIMESTAMP(3),

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weekday" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "format" "ContentFormat" NOT NULL,
    "platform" "Platform" NOT NULL,
    "script" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "suggestedTime" TEXT NOT NULL,
    "status" "CalendarStatus" NOT NULL DEFAULT 'PLANEJADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "relevanceScore" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opportunities" JSONB NOT NULL,
    "threats" JSONB NOT NULL,
    "hotTopics" TEXT[],
    "saturatedTopics" TEXT[],
    "tomorrowForecast" TEXT NOT NULL,
    "weekForecast" TEXT NOT NULL,
    "viralProbability" INTEGER NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_update_logs" (
    "id" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcesProcessed" INTEGER NOT NULL,
    "trendsFound" INTEGER NOT NULL,
    "ideasGenerated" INTEGER NOT NULL,
    "trendsPruned" INTEGER NOT NULL,
    "status" "UpdateRunStatus" NOT NULL,
    "errorMessage" TEXT,
    "durationMs" INTEGER,

    CONSTRAINT "daily_update_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_embeddings" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "trends_platform_status_idx" ON "trends"("platform", "status");

-- CreateIndex
CREATE INDEX "trends_detectedAt_idx" ON "trends"("detectedAt");

-- CreateIndex
CREATE INDEX "content_ideas_format_idx" ON "content_ideas"("format");

-- CreateIndex
CREATE INDEX "content_ideas_createdAt_idx" ON "content_ideas"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "content_idea_favorites_userId_ideaId_key" ON "content_idea_favorites"("userId", "ideaId");

-- CreateIndex
CREATE INDEX "bank_items_category_idx" ON "bank_items"("category");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_platform_idx" ON "posts"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_entries_date_key" ON "calendar_entries"("date");

-- CreateIndex
CREATE INDEX "news_items_publishedAt_idx" ON "news_items"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reports_date_key" ON "daily_reports"("date");

-- CreateIndex
CREATE UNIQUE INDEX "content_embeddings_sourceType_sourceId_key" ON "content_embeddings"("sourceType", "sourceId");

-- AddForeignKey
ALTER TABLE "content_idea_favorites" ADD CONSTRAINT "content_idea_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_idea_favorites" ADD CONSTRAINT "content_idea_favorites_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "content_ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
