"use client";

import { motion } from "framer-motion";
import { MapPin, Gauge, BadgeCheck, Hash } from "lucide-react";
import type { Trend } from "@/lib/data/types";
import { PlatformBadge, TrendStatusBadge } from "./badges";
import { RelativeTime } from "./relative-time";
import { Progress } from "@/components/ui/progress";
import { compactNumber } from "@/lib/format";

export function TrendCard({ trend, index = 0 }: { trend: Trend; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card flex flex-col gap-3 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <TrendStatusBadge status={trend.status} />
        <PlatformBadge platform={trend.platform} />
        <span className="ml-auto text-[11px] text-muted-foreground">
          <RelativeTime iso={trend.date} />
        </span>
      </div>

      <h3 className="text-[14.5px] font-semibold leading-snug">{trend.title}</h3>
      <p className="line-clamp-2 text-[13px] text-muted-foreground">{trend.summary}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Gauge className="size-3.5" /> Índice de crescimento
          </span>
          <span className="font-semibold text-foreground">{trend.growthIndex}</span>
        </div>
        <Progress value={trend.growthIndex} className="h-1.5" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> {trend.city}/{trend.state}
        </span>
        <span className="inline-flex items-center gap-1 justify-self-end">
          <BadgeCheck className="size-3.5" /> IA {trend.aiConfidence}%
        </span>
      </div>

      <div className="flex flex-wrap gap-1 border-t border-border/60 pt-3">
        {trend.hashtags.slice(0, 4).map((tag) => (
          <span key={tag} className="inline-flex items-center gap-0.5 rounded-full bg-secondary/70 px-2 py-0.5 text-[10.5px] text-secondary-foreground">
            <Hash className="size-2.5" />
            {tag.replace("#", "")}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {compactNumber(trend.views)} visualizações · {trend.engagementRate}% engajamento
      </p>
    </motion.div>
  );
}
