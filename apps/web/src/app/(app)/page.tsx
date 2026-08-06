"use client";

import {
  Flame,
  Lightbulb,
  Target,
  Zap,
  Hash,
  Music2,
  Laugh,
  TrendingUp,
  Newspaper,
  HelpCircle,
  Search,
  Sparkles,
  Layers,
  UserRound,
  Clapperboard,
  Megaphone,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { TopListCard } from "@/components/shared/top-list";
import { TrendCard } from "@/components/shared/trend-card";
import { LinkButton } from "@/components/shared/link-button";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { PlatformMixChart } from "@/components/dashboard/platform-mix-chart";
import { Card } from "@/components/ui/card";
import { TRENDS } from "@/lib/data/generators/trends";
import { CONTENT_IDEAS } from "@/lib/data/generators/ideas";
import { DAILY_REPORT } from "@/lib/data/generators/reports";
import { DASHBOARD_EXTRAS } from "@/lib/data/generators/dashboard-extras";
import { POSTS } from "@/lib/data/generators/posts";
import { BANKS } from "@/lib/data/generators/banks";
import { NEWS } from "@/lib/data/generators/news";

export default function DashboardPage() {
  const top10 = TRENDS.slice(0, 10);
  const viralPosts = [...POSTS].sort((a, b) => b.metrics.views - a.metrics.views).slice(0, 8);
  const topQuestions = [...BANKS.questions].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 8);
  const topNews = [...NEWS].sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Bom dia 👋 Aqui está o resumo de hoje"
        description="Atualizado automaticamente às 07:00 com dados de 13 fontes. Tudo que você precisa para decidir o que postar hoje."
        actions={
          <>
            <LinkButton href="/relatorio" variant="outline" className="rounded-lg">Ver relatório completo</LinkButton>
            <LinkButton href="/ideias" className="rounded-lg gap-2"><Sparkles className="size-4" /> Gerar ideias agora</LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard index={0} label="Assuntos em alta hoje" value={String(TRENDS.filter((t) => t.status !== "caindo" && t.status !== "saturado").length)} delta={12.4} icon={Flame} iconClassName="bg-warning/15 text-warning" />
        <StatCard index={1} label="Ideias geradas hoje" value={String(CONTENT_IDEAS.length)} delta={8.1} icon={Lightbulb} iconClassName="bg-primary/15 text-primary" />
        <StatCard index={2} label="Score de oportunidade" value={`${DAILY_REPORT.opportunityScore}/100`} delta={5.6} icon={Target} iconClassName="bg-success/15 text-success" />
        <StatCard index={3} label="Probabilidade de viralização" value={`${DAILY_REPORT.viralProbability}%`} delta={-2.3} icon={Zap} iconClassName="bg-info/15 text-info" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="glass-card col-span-1 rounded-2xl border-0 p-4 sm:p-5 lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Evolução de tendências e engajamento</h3>
            <span className="text-[11px] text-muted-foreground">Últimos 14 dias</span>
          </div>
          <GrowthChart />
        </Card>
        <Card className="glass-card col-span-1 rounded-2xl border-0 p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Tendências por plataforma</h3>
          </div>
          <PlatformMixChart />
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">🔥 Top 10 assuntos do dia</h2>
          <LinkButton href="/tendencias" variant="link" size="sm">Ver todos</LinkButton>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {top10.map((t, i) => (
            <TrendCard key={t.id} trend={t} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[15px] font-semibold">Radar completo do dia</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <TopListCard title="Top hashtags" icon={Hash} items={DASHBOARD_EXTRAS.topHashtags} index={0} />
          <TopListCard title="Top músicas" icon={Music2} items={DASHBOARD_EXTRAS.topMusics} index={1} />
          <TopListCard title="Top memes" icon={Laugh} items={DASHBOARD_EXTRAS.topMemes} index={2} />
          <TopListCard
            title="Top trends"
            icon={TrendingUp}
            items={top10.map((t) => ({ label: t.title, metric: `${t.growthIndex}` }))}
            index={3}
          />
          <TopListCard
            title="Top notícias"
            icon={Newspaper}
            items={topNews.map((n) => ({ label: n.title, metric: `${n.relevanceScore}` }))}
            index={4}
          />
          <TopListCard
            title="Top dúvidas dos clientes"
            icon={HelpCircle}
            items={topQuestions.map((q) => ({ label: q.text, metric: `${q.performanceScore}` }))}
            index={5}
          />
          <TopListCard title="Top pesquisas no Google" icon={Search} items={DASHBOARD_EXTRAS.topSearches} index={6} />
          <TopListCard
            title="Top conteúdos virais"
            icon={Sparkles}
            items={viralPosts.map((p) => ({ label: p.title, metric: `${new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(p.metrics.views)} views` }))}
            index={7}
          />
          <TopListCard title="Top formatos" icon={Layers} items={DASHBOARD_EXTRAS.topFormats} index={8} />
          <TopListCard title="Top criadores" icon={UserRound} items={DASHBOARD_EXTRAS.topCreators} index={9} />
          <TopListCard
            title="Top vídeos"
            icon={Clapperboard}
            items={viralPosts.slice(0, 8).map((p) => ({ label: p.title, metric: `${p.metrics.likes.toLocaleString("pt-BR")} likes` }))}
            index={10}
          />
          <TopListCard title="Top campanhas" icon={Megaphone} items={DASHBOARD_EXTRAS.topCampaigns} index={11} />
        </div>
      </div>
    </div>
  );
}
