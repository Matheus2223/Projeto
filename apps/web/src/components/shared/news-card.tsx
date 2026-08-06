"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { NewsItem } from "@/lib/data/types";
import { RelativeTime } from "./relative-time";
import { Badge } from "@/components/ui/badge";

export function NewsCard({ news, index = 0 }: { news: NewsItem; index?: number }) {
  return (
    <motion.a
      href={news.url}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card group flex flex-col gap-2.5 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full">{news.category}</Badge>
        <span className="text-[11px] font-medium text-muted-foreground">{news.source}</span>
        <span className="ml-auto text-[11px] text-muted-foreground"><RelativeTime iso={news.publishedAt} /></span>
      </div>
      <h3 className="text-[14px] font-semibold leading-snug group-hover:text-primary">{news.title}</h3>
      <p className="line-clamp-2 text-[13px] text-muted-foreground">{news.summary}</p>
      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Relevância para o setor: <strong className="text-foreground">{news.relevanceScore}%</strong></span>
        <ExternalLink className="size-3.5" />
      </div>
    </motion.a>
  );
}
