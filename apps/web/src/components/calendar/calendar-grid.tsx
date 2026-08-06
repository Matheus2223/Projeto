"use client";

import { useMemo, useState } from "react";
import type { CalendarEntry } from "@/lib/data/types";
import { PLATFORM_META } from "@/lib/data/constants";
import { CalendarDayDialog } from "./calendar-day-dialog";
import { cn } from "@/lib/utils";

const WEEKDAY_HEADERS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const STATUS_DOT: Record<CalendarEntry["status"], string> = {
  planejado: "bg-muted-foreground/40",
  produzido: "bg-info",
  publicado: "bg-success",
};

export function CalendarGrid({ entries }: { entries: CalendarEntry[] }) {
  const [selected, setSelected] = useState<CalendarEntry | null>(null);
  const [open, setOpen] = useState(false);

  const cells = useMemo(() => {
    if (entries.length === 0) return [];
    const offset = new Date(entries[0].date).getDay();
    const list: (CalendarEntry | null)[] = [...Array(offset).fill(null), ...entries];
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [entries]);

  const today = new Date().toDateString();

  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_HEADERS.map((d) => (
          <div key={d} className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((entry, i) => {
          if (!entry) return <div key={`empty-${i}`} />;
          const isToday = new Date(entry.date).toDateString() === today;
          const meta = PLATFORM_META[entry.platform];
          return (
            <button
              key={entry.id}
              onClick={() => {
                setSelected(entry);
                setOpen(true);
              }}
              className={cn(
                "flex min-h-[92px] flex-col gap-1.5 rounded-xl border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-accent/50 sm:min-h-[112px] sm:p-2.5",
                isToday && "border-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-semibold", isToday && "text-primary")}>
                  {new Date(entry.date).getDate()}
                </span>
                <span className={cn("size-1.5 rounded-full", STATUS_DOT[entry.status])} />
              </div>
              <p className="line-clamp-2 text-[11.5px] font-medium leading-snug">{entry.theme}</p>
              <span className={cn("mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-br px-1.5 py-0.5 text-[9.5px] font-medium text-white", meta.gradient)}>
                {entry.format}
              </span>
            </button>
          );
        })}
      </div>
      <CalendarDayDialog entry={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
