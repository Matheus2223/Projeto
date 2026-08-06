"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { RankedItem } from "@/lib/data/generators/dashboard-extras";
import { cn } from "@/lib/utils";

export function TopListCard({
  title,
  icon: Icon,
  items,
  index = 0,
}: {
  title: string;
  icon: LucideIcon;
  items: RankedItem[];
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card flex flex-col rounded-2xl p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </span>
        <h3 className="text-[13.5px] font-semibold">{title}</h3>
      </div>
      <ul className="flex flex-col gap-1">
        {items.slice(0, 8).map((item, i) => (
          <li key={item.label + i} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-accent/50">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                i < 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium leading-tight">{item.label}</p>
              {item.sub && <p className="truncate text-[10.5px] text-muted-foreground">{item.sub}</p>}
            </div>
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{item.metric}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
