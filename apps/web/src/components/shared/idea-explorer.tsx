"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search as SearchIcon, SearchX } from "lucide-react";
import type { ContentIdea } from "@/lib/data/types";
import { IdeaCard } from "./idea-card";
import { EmptyState } from "./empty-state";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_FORMATS, DIFFICULTY, PLATFORM_META, type Platform } from "@/lib/data/constants";
import { Rng } from "@/lib/data/rng";
import { toast } from "sonner";

export function IdeaExplorer({ ideas }: { ideas: ContentIdea[] }) {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState<string>("todos");
  const [platform, setPlatform] = useState<string>("todos");
  const [difficulty, setDifficulty] = useState<string>("todos");
  const [order, setOrder] = useState<number[]>(() => ideas.map((_, i) => i));
  const [refreshing, setRefreshing] = useState(false);

  const shuffled = useMemo(() => order.map((i) => ideas[i]), [order, ideas]);

  const filtered = useMemo(() => {
    return shuffled.filter((idea) => {
      if (search && !idea.hook.toLowerCase().includes(search.toLowerCase())) return false;
      if (format !== "todos" && idea.format !== format) return false;
      if (platform !== "todos" && idea.platform !== (platform as Platform)) return false;
      if (difficulty !== "todos" && idea.difficulty !== difficulty) return false;
      return true;
    });
  }, [shuffled, search, format, platform, difficulty]);

  const { visible, sentinelRef } = useInfiniteScroll(filtered.length, 12);

  const regenerate = () => {
    setRefreshing(true);
    const rng = new Rng(Date.now());
    setOrder(rng.shuffle(ideas.map((_, i) => i)));
    toast.success("Novas ideias priorizadas pela IA para hoje");
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div>
      <div className="glass-card mb-6 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="relative min-w-[180px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por gancho..." className="h-9 rounded-lg pl-8 text-[13px]" />
        </div>
        <Select value={format} onValueChange={(v) => setFormat(v ?? "todos")}>
          <SelectTrigger className="h-9 w-full rounded-lg text-[13px] sm:w-[170px]"><SelectValue placeholder="Formato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos formatos</SelectItem>
            {CONTENT_FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={(v) => setPlatform(v ?? "todos")}>
          <SelectTrigger className="h-9 w-full rounded-lg text-[13px] sm:w-[160px]"><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas plataformas</SelectItem>
            {Object.entries(PLATFORM_META).map(([key, meta]) => <SelectItem key={key} value={key}>{meta.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "todos")}>
          <SelectTrigger className="h-9 w-full rounded-lg text-[13px] sm:w-[140px]"><SelectValue placeholder="Dificuldade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Qualquer nível</SelectItem>
            {DIFFICULTY.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={regenerate} className="h-9 shrink-0 gap-2 rounded-lg">
          <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />
          Gerar novas ideias
        </Button>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">{filtered.length} ideias encontradas</p>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Nenhuma ideia encontrada" description="Ajuste os filtros para ver mais sugestões da IA." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, visible).map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
        </>
      )}
    </div>
  );
}
