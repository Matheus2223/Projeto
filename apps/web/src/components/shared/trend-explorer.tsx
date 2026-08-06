"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { Trend } from "@/lib/data/types";
import { FilterBar, DEFAULT_FILTERS, applyPeriodFilter, type FilterState } from "./filter-bar";
import { TrendCard } from "./trend-card";
import { EmptyState } from "./empty-state";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { Platform } from "@/lib/data/constants";

export function TrendExplorer({
  trends,
  initialFilters,
  visibleFilters,
}: {
  trends: Trend[];
  initialFilters?: Partial<FilterState>;
  visibleFilters?: Partial<Record<keyof FilterState, boolean>>;
}) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, ...initialFilters });

  const filtered = useMemo(() => {
    return trends.filter((t) => {
      if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.platform !== "todos" && t.platform !== (filters.platform as Platform)) return false;
      if (filters.segment !== "todos" && t.segment !== filters.segment) return false;
      if (filters.state !== "todos" && t.state !== filters.state) return false;
      if (filters.city !== "todas" && t.city !== filters.city) return false;
      if (filters.status !== "todos" && t.status !== filters.status) return false;
      if (!applyPeriodFilter(t.date, filters.period)) return false;
      return true;
    });
  }, [trends, filters]);

  const { visible, sentinelRef } = useInfiniteScroll(filtered.length, 12);

  return (
    <div>
      <FilterBar value={filters} onChange={setFilters} show={visibleFilters} resultCount={filtered.length} />
      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Nenhuma tendência encontrada" description="Tente ajustar os filtros ou limpar a busca." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, visible).map((t, i) => (
              <TrendCard key={t.id} trend={t} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
        </>
      )}
    </div>
  );
}
