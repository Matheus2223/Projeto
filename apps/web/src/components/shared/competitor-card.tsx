"use client";

import { motion } from "framer-motion";
import { Users, Zap, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Competitor } from "@/lib/data/types";
import { PlatformBadge } from "./badges";
import { compactNumber } from "@/lib/format";

export function CompetitorCard({ competitor, index = 0 }: { competitor: Competitor; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card flex flex-col gap-4 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${competitor.colorPalette[0]}, ${competitor.colorPalette[1]})` }}>
          {competitor.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14.5px] font-semibold">{competitor.name}</h3>
          <p className="text-[12px] text-muted-foreground">{competitor.handle} · {competitor.segment}</p>
        </div>
        <div className="flex gap-1">
          {competitor.colorPalette.map((c) => (
            <span key={c} className="size-4 rounded-full border border-border/60" style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {competitor.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary/50 p-3 text-center">
        <div>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground"><Users className="size-3" /> Seguidores</p>
          <p className="text-[13.5px] font-semibold">{compactNumber(competitor.followers)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Posts/semana</p>
          <p className="text-[13.5px] font-semibold">{competitor.postFrequencyPerWeek}</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground"><Zap className="size-3" /> Engaj.</p>
          <p className="text-[13.5px] font-semibold">{competitor.avgEngagementRate}%</p>
        </div>
      </div>

      <p className="text-[12.5px] text-muted-foreground">
        <span className="font-medium text-foreground">Estilo visual: </span>
        {competitor.visualStyle}
      </p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-success/25 bg-success/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-success"><CheckCircle2 className="size-3.5" /> O que copiar</p>
          <ul className="space-y-1 text-[11.5px] text-foreground/90">
            {competitor.whatToCopy.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-danger/25 bg-danger/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-danger"><XCircle className="size-3.5" /> O que evitar</p>
          <ul className="space-y-1 text-[11.5px] text-foreground/90">
            {competitor.whatToAvoid.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-info/25 bg-info/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-info"><Lightbulb className="size-3.5" /> Oportunidades</p>
          <ul className="space-y-1 text-[11.5px] text-foreground/90">
            {competitor.opportunities.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
