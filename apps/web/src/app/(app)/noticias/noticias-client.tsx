"use client";

import { useMemo, useState } from "react";
import { SearchX, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { NewsCard } from "@/components/shared/news-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { NewsItem } from "@/lib/data/types";

export function NoticiasClient({ news }: { news: NewsItem[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => news.filter((n) => n.title.toLowerCase().includes(search.toLowerCase())),
    [news, search],
  );
  const { visible, sentinelRef } = useInfiniteScroll(filtered.length, 12);

  return (
    <div>
      <PageHeader
        title="📰 Notícias"
        description="Notícias do setor de telecom relevantes para gerar conteúdo institucional e educativo."
      />

      <div className="glass-card mb-6 flex items-center gap-2 rounded-2xl p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar notícias..." className="h-9 rounded-lg pl-8 text-[13px]" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Nenhuma notícia encontrada" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((n, i) => (
              <NewsCard key={n.id} news={n} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
        </>
      )}
    </div>
  );
}
