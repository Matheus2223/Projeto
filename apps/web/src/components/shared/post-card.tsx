"use client";

import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle, Share2, Play } from "lucide-react";
import type { PostItem } from "@/lib/data/types";
import { PlatformBadge } from "./badges";
import { Badge } from "@/components/ui/badge";
import { compactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<PostItem["status"], string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  publicado: "Publicado",
};

const STATUS_CLASS: Record<PostItem["status"], string> = {
  rascunho: "bg-muted text-muted-foreground border-border",
  agendado: "bg-info/15 text-info border-info/30",
  publicado: "bg-success/15 text-success border-success/30",
};

export function PostCard({ post, index = 0 }: { post: PostItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl"
    >
      <div className={cn("relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br", post.gradient)}>
        <Play className="size-9 fill-white/90 text-white/90 drop-shadow-lg transition-transform group-hover:scale-110" />
        <Badge className={cn("absolute left-2.5 top-2.5 rounded-full border text-[10px]", STATUS_CLASS[post.status])} variant="outline">
          {STATUS_LABEL[post.status]}
        </Badge>
        <span className="absolute right-2.5 top-2.5 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {post.format}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <PlatformBadge platform={post.platform} />
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{post.title}</p>
        <div className="mt-auto flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Eye className="size-3.5" />{compactNumber(post.metrics.views)}</span>
          <span className="inline-flex items-center gap-1"><Heart className="size-3.5" />{compactNumber(post.metrics.likes)}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" />{compactNumber(post.metrics.comments)}</span>
          <span className="inline-flex items-center gap-1"><Share2 className="size-3.5" />{compactNumber(post.metrics.shares)}</span>
        </div>
      </div>
    </motion.div>
  );
}
