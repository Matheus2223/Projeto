"use client";

import { Target, Zap, TrendingUp, TrendingDown, AlertTriangle, CalendarClock, CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DailyReport } from "@/lib/data/types";

const SEVERITY_CLASS: Record<string, string> = {
  baixa: "bg-success/15 text-success border-success/30",
  média: "bg-warning/15 text-warning border-warning/30",
  alta: "bg-danger/15 text-danger border-danger/30",
};

export function RelatorioClient({ report: r }: { report: DailyReport }) {
  return (
    <div>
      <PageHeader
        title="📄 Relatório Diário"
        description={`Gerado automaticamente em ${formatDate(r.date, { day: "2-digit", month: "long", year: "numeric" })} às 07:00.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard index={0} label="Score de oportunidade" value={`${r.opportunityScore}/100`} icon={Target} iconClassName="bg-success/15 text-success" />
        <StatCard index={1} label="Probabilidade de viralização" value={`${r.viralProbability}%`} icon={Zap} iconClassName="bg-primary/15 text-primary" />
        <StatCard index={2} label="Assuntos quentes" value={String(r.hotTopics.length)} icon={TrendingUp} iconClassName="bg-warning/15 text-warning" />
        <StatCard index={3} label="Assuntos saturados" value={String(r.saturatedTopics.length)} icon={TrendingDown} iconClassName="bg-danger/15 text-danger" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-[15px] font-semibold">🟢 Oportunidades do dia</h2>
          <div className="flex flex-col gap-3">
            {r.opportunities.map((op) => (
              <div key={op.title} className="glass-card rounded-2xl p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[13.5px] font-semibold">{op.title}</p>
                  <span className="text-[13px] font-semibold text-success">{op.score}</span>
                </div>
                <p className="mb-2 text-[12.5px] text-muted-foreground">{op.description}</p>
                <Progress value={op.score} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-[15px] font-semibold">🔴 Ameaças</h2>
          <div className="flex flex-col gap-3">
            {r.threats.map((t) => (
              <div key={t.title} className="glass-card rounded-2xl p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold"><AlertTriangle className="size-3.5 text-danger" /> {t.title}</p>
                  <Badge variant="outline" className={cn("rounded-full text-[10.5px]", SEVERITY_CLASS[t.severity])}>{t.severity}</Badge>
                </div>
                <p className="text-[12.5px] text-muted-foreground">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-[13.5px] font-semibold">🔥 Assuntos quentes</h3>
          <div className="flex flex-wrap gap-2">
            {r.hotTopics.map((t) => (
              <span key={t} className="rounded-full bg-warning/10 px-3 py-1.5 text-[12px] font-medium text-warning">{t}</span>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-[13.5px] font-semibold">🧊 Assuntos saturados</h3>
          <div className="flex flex-wrap gap-2">
            {r.saturatedTopics.map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="mb-2 flex items-center gap-2 text-[13.5px] font-semibold"><CalendarClock className="size-4 text-primary" /> Previsão para amanhã</h3>
          <p className="text-[13px] text-muted-foreground">{r.tomorrowForecast}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="mb-2 flex items-center gap-2 text-[13.5px] font-semibold"><CalendarRange className="size-4 text-primary" /> Previsão da semana</h3>
          <p className="text-[13px] text-muted-foreground">{r.weekForecast}</p>
        </div>
      </div>
    </div>
  );
}
