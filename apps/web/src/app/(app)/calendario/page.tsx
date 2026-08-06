"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PlatformBadge } from "@/components/shared/badges";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarDayDialog } from "@/components/calendar/calendar-day-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CALENDAR_ENTRIES } from "@/lib/data/generators/calendar";
import { formatDate } from "@/lib/format";
import type { CalendarEntry } from "@/lib/data/types";

const STATUS_LABEL: Record<CalendarEntry["status"], string> = {
  planejado: "Planejado",
  produzido: "Produzido",
  publicado: "Publicado",
};

const STATUS_CLASS: Record<CalendarEntry["status"], string> = {
  planejado: "bg-muted text-muted-foreground border-border",
  produzido: "bg-info/15 text-info border-info/30",
  publicado: "bg-success/15 text-success border-success/30",
};

export default function CalendarioPage() {
  const [selected, setSelected] = useState<CalendarEntry | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="🗓️ Calendário Editorial"
        description="Os próximos 30 dias planejados automaticamente pela IA, com tema, objetivo, roteiro e horário sugerido para cada publicação."
      />

      <Tabs defaultValue="grid">
        <TabsList className="mb-5">
          <TabsTrigger value="grid">Grade</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <CalendarGrid entries={CALENDAR_ENTRIES} />
        </TabsContent>

        <TabsContent value="list">
          <div className="flex flex-col gap-2.5">
            {CALENDAR_ENTRIES.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  setSelected(entry);
                  setOpen(true);
                }}
                className="glass-card flex flex-col gap-2 rounded-xl p-3.5 text-left sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex w-24 shrink-0 flex-col">
                  <span className="text-[11px] font-medium text-muted-foreground">{entry.weekday}</span>
                  <span className="text-[13px] font-semibold">{formatDate(entry.date, { day: "2-digit", month: "short" })}</span>
                </div>
                <p className="flex-1 text-[13.5px] font-medium">{entry.theme}</p>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <PlatformBadge platform={entry.platform} />
                  <Badge variant="outline" className={STATUS_CLASS[entry.status]}>{STATUS_LABEL[entry.status]}</Badge>
                  <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <Clock className="size-3.5" /> {entry.suggestedTime}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CalendarDayDialog entry={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
