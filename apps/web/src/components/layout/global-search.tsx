"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { NAV_GROUPS } from "@/config/nav";
import { TRENDS } from "@/lib/data/generators/trends";
import { CONTENT_IDEAS } from "@/lib/data/generators/ideas";
import { Button } from "@/components/ui/button";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const topTrends = TRENDS.slice(0, 6);
  const topIdeas = CONTENT_IDEAS.slice(0, 6);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full max-w-sm justify-start gap-2 rounded-lg border-border/70 bg-secondary/50 px-3 text-muted-foreground shadow-none hover:bg-secondary"
      >
        <Search className="size-4" />
        <span className="text-[13px]">Buscar tendências, ideias, páginas...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Busca global" description="Busque em toda a plataforma">
        <CommandInput placeholder="Digite para buscar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="size-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tendências em alta">
            {topTrends.map((trend) => (
              <CommandItem key={trend.id} onSelect={() => go("/tendencias")}>
                {trend.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ideias de conteúdo">
            {topIdeas.map((idea) => (
              <CommandItem key={idea.id} onSelect={() => go("/ideias")}>
                {idea.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
