"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BR_STATES, BR_CITIES, PLATFORM_META, SEGMENTS, TREND_STATUS_META, type Platform, type TrendStatus } from "@/lib/data/constants";

export interface FilterState {
  search: string;
  platform: Platform | "todos";
  segment: string | "todos";
  state: string | "todos";
  city: string | "todas";
  period: "24h" | "7d" | "30d" | "todos";
  status: TrendStatus | "todos";
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  platform: "todos",
  segment: "todos",
  state: "todos",
  city: "todas",
  period: "todos",
  status: "todos",
};

interface FilterBarProps {
  value: FilterState;
  onChange: (value: FilterState) => void;
  show?: Partial<Record<keyof FilterState, boolean>>;
  resultCount?: number;
}

export function FilterBar({ value, onChange, show, resultCount }: FilterBarProps) {
  const visible = {
    search: show?.search ?? true,
    platform: show?.platform ?? true,
    segment: show?.segment ?? true,
    state: show?.state ?? true,
    city: show?.city ?? true,
    period: show?.period ?? true,
    status: show?.status ?? true,
  };

  const cities = value.state !== "todos" ? BR_CITIES[value.state] ?? [] : [];
  const isDirty = JSON.stringify(value) !== JSON.stringify(DEFAULT_FILTERS);

  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="glass-card mb-6 flex flex-col gap-3 rounded-2xl p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-1 hidden items-center gap-1.5 text-muted-foreground sm:flex">
          <SlidersHorizontal className="size-4" />
        </div>

        {visible.search && (
          <div className="relative min-w-[180px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={value.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Buscar..."
              className="h-9 rounded-lg pl-8 text-[13px]"
            />
          </div>
        )}

        {visible.platform && (
          <Select value={value.platform} onValueChange={(v) => update({ platform: (v ?? "todos") as Platform | "todos" })}>
            <SelectTrigger className="h-9 w-[150px] rounded-lg text-[13px]"><SelectValue placeholder="Plataforma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas plataformas</SelectItem>
              {Object.entries(PLATFORM_META).map(([key, meta]) => (
                <SelectItem key={key} value={key}>{meta.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {visible.segment && (
          <Select value={value.segment} onValueChange={(v) => update({ segment: v ?? "todos" })}>
            <SelectTrigger className="h-9 w-[170px] rounded-lg text-[13px]"><SelectValue placeholder="Segmento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos segmentos</SelectItem>
              {SEGMENTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {visible.state && (
          <Select value={value.state} onValueChange={(v) => update({ state: v ?? "todos", city: "todas" })}>
            <SelectTrigger className="h-9 w-[110px] rounded-lg text-[13px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo BR</SelectItem>
              {BR_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {visible.city && (
          <Select value={value.city} onValueChange={(v) => update({ city: v ?? "todas" })} disabled={value.state === "todos"}>
            <SelectTrigger className="h-9 w-[140px] rounded-lg text-[13px]"><SelectValue placeholder="Cidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas cidades</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {visible.status && (
          <Select value={value.status} onValueChange={(v) => update({ status: v as TrendStatus | "todos" })}>
            <SelectTrigger className="h-9 w-[150px] rounded-lg text-[13px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              {Object.entries(TREND_STATUS_META).map(([key, meta]) => (
                <SelectItem key={key} value={key}>{meta.emoji} {meta.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {visible.period && (
          <Select value={value.period} onValueChange={(v) => update({ period: v as FilterState["period"] })}>
            <SelectTrigger className="h-9 w-[130px] rounded-lg text-[13px]"><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo período</SelectItem>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        )}

        {isDirty && (
          <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground" onClick={() => onChange(DEFAULT_FILTERS)}>
            <X className="size-3.5" /> Limpar
          </Button>
        )}
      </div>

      {typeof resultCount === "number" && (
        <p className="text-xs text-muted-foreground">{resultCount} resultado{resultCount === 1 ? "" : "s"} encontrado{resultCount === 1 ? "" : "s"}</p>
      )}
    </div>
  );
}

export function applyPeriodFilter(dateIso: string, period: FilterState["period"]): boolean {
  if (period === "todos") return true;
  const days = period === "24h" ? 1 : period === "7d" ? 7 : 30;
  const diff = Date.now() - new Date(dateIso).getTime();
  return diff <= days * 86400000;
}
