"use client";

import { Clock, Target } from "lucide-react";
import type { CalendarEntry } from "@/lib/data/types";
import { PlatformBadge } from "@/components/shared/badges";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

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

export function CalendarDayDialog({
  entry,
  open,
  onOpenChange,
}: {
  entry: CalendarEntry | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={STATUS_CLASS[entry.status]}>{STATUS_LABEL[entry.status]}</Badge>
            <PlatformBadge platform={entry.platform} />
          </div>
          <DialogTitle className="text-left text-lg">{entry.theme}</DialogTitle>
          <DialogDescription className="text-left">
            {entry.weekday}, {formatDate(entry.date, { day: "2-digit", month: "long" })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-4 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Target className="size-3.5" /> {entry.objective}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {entry.suggestedTime}</span>
          </div>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Formato</p>
            <Badge variant="secondary" className="rounded-full">{entry.format}</Badge>
          </section>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roteiro / gancho</p>
            <p className="rounded-lg bg-secondary/60 p-3">{entry.script}</p>
          </section>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legenda</p>
            <p className="rounded-lg bg-secondary/60 p-3">{entry.caption}</p>
          </section>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA</p>
            <p>{entry.cta}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
