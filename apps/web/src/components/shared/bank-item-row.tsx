"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { BankItem } from "@/lib/data/types";
import { PlatformBadge } from "./badges";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BankItemRow({ item, index = 0 }: { item: BankItem; index?: number }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(item.text);
    setCopied(true);
    toast.success("Copiado para a área de transferência");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 10) * 0.02 }}
      className="glass-card flex flex-col gap-2.5 rounded-xl p-3.5 sm:flex-row sm:items-center sm:gap-4"
    >
      <p className="flex-1 text-[13.5px] leading-snug">{item.text}</p>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <PlatformBadge platform={item.platform} />
        <Badge
          variant="outline"
          className={cn(
            "gap-1 rounded-full text-[10.5px]",
            item.performanceScore >= 80 ? "border-success/30 bg-success/10 text-success" : "border-border",
          )}
        >
          <TrendingUp className="size-3" /> {item.performanceScore}
        </Badge>
        <button
          onClick={copy}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70"
          aria-label="Copiar"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
