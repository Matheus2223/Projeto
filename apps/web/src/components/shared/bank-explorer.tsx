"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, ArrowDownWideNarrow } from "lucide-react";
import type { BankItem } from "@/lib/data/types";
import { BankItemRow } from "./bank-item-row";
import { EmptyState } from "./empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLATFORM_META, type Platform } from "@/lib/data/constants";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export function BankExplorer({ items }: { items: BankItem[] }) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("todos");
  const [sort, setSort] = useState<"performance" | "usage">("performance");

  const filtered = useMemo(() => {
    const list = items.filter((item) => {
      if (search && !item.text.toLowerCase().includes(search.toLowerCase())) return false;
      if (platform !== "todos" && item.platform !== (platform as Platform)) return false;
      return true;
    });
    return [...list].sort((a, b) =>
      sort === "performance" ? b.performanceScore - a.performanceScore : b.usageCount - a.usageCount,
    );
  }, [items, search, platform, sort]);

  const { visible, sentinelRef } = useInfiniteScroll(filtered.length, 24);

  return (
    <div>
      <div className="glass-card mb-5 flex flex-col gap-2.5 rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="h-9 rounded-lg pl-8 text-[13px]" />
        </div>
        <Select value={platform} onValueChange={(v) => setPlatform(v ?? "todos")}>
          <SelectTrigger className="h-9 w-full rounded-lg text-[13px] sm:w-[160px]"><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas plataformas</SelectItem>
            {Object.entries(PLATFORM_META).map(([key, meta]) => <SelectItem key={key} value={key}>{meta.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort((v as "performance" | "usage") ?? "performance")}>
          <SelectTrigger className="h-9 w-full rounded-lg text-[13px] sm:w-[170px]">
            <ArrowDownWideNarrow className="size-3.5" />
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="performance">Melhor performance</SelectItem>
            <SelectItem value="usage">Mais utilizados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{filtered.length} itens encontrados</p>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Nada encontrado" description="Tente outra busca." />
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {filtered.slice(0, visible).map((item, i) => (
              <BankItemRow key={item.id} item={item} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
        </>
      )}
    </div>
  );
}
