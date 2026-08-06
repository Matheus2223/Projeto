"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import type { PostItem } from "@/lib/data/types";
import { FilterBar, DEFAULT_FILTERS, type FilterState } from "./filter-bar";
import { PostCard } from "./post-card";
import { EmptyState } from "./empty-state";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { Platform } from "@/lib/data/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POST_STATUS_LABEL: Record<PostItem["status"], string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  publicado: "Publicado",
};

export function PostExplorer({
  posts,
  initialFilters,
  visibleFilters,
  showPostStatus = false,
}: {
  posts: PostItem[];
  initialFilters?: Partial<FilterState>;
  visibleFilters?: Partial<Record<keyof FilterState, boolean>>;
  showPostStatus?: boolean;
}) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, ...initialFilters });
  const [postStatus, setPostStatus] = useState<PostItem["status"] | "todos">("todos");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.platform !== "todos" && p.platform !== (filters.platform as Platform)) return false;
      if (filters.segment !== "todos" && p.segment !== filters.segment) return false;
      if (postStatus !== "todos" && p.status !== postStatus) return false;
      return true;
    });
  }, [posts, filters, postStatus]);

  const { visible, sentinelRef } = useInfiniteScroll(filtered.length, 12);

  return (
    <div>
      <FilterBar
        value={filters}
        onChange={setFilters}
        show={{ state: false, city: false, status: false, period: false, ...visibleFilters }}
        resultCount={filtered.length}
      />
      {showPostStatus && (
        <div className="-mt-4 mb-6">
          <Select value={postStatus} onValueChange={(v) => setPostStatus((v as PostItem["status"] | "todos") ?? "todos")}>
            <SelectTrigger className="h-9 w-[170px] rounded-lg text-[13px]"><SelectValue placeholder="Status do post" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(POST_STATUS_LABEL).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Nenhum conteúdo encontrado" description="Tente ajustar os filtros ou limpar a busca." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.slice(0, visible).map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
        </>
      )}
    </div>
  );
}
