"use client";

import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, Sparkles } from "lucide-react";
import { ALL_NAV_ITEMS } from "@/config/nav";
import { GlobalSearch } from "./global-search";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NOTIFICATIONS = [
  {
    title: "Atualização diária concluída",
    description: "IA processou 12 fontes e gerou 170 novas ideias de conteúdo.",
    time: "07:00",
  },
  {
    title: "Novo assunto viral detectado",
    description: "\"Wi-Fi mesh\" está explodindo no TikTok nas últimas 6h.",
    time: "09:14",
  },
  {
    title: "Concorrente publicou campanha",
    description: "ConectaMais Fibra lançou promoção de Dia dos Pais.",
    time: "10:32",
  },
];

export function Topbar() {
  const pathname = usePathname();
  const current = ALL_NAV_ITEMS.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <MobileNav />

      <div className="hidden min-w-0 flex-col md:flex">
        <h1 className="truncate text-[15px] font-semibold tracking-tight">
          {current?.label ?? "TrendHub ISP AI"}
        </h1>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
        <div className="hidden flex-1 sm:block sm:max-w-xs md:max-w-sm">
          <GlobalSearch />
        </div>

        <Badge
          variant="outline"
          className="hidden items-center gap-1.5 rounded-full border-success/30 bg-success/10 py-1.5 text-success lg:flex"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          IA atualizada às 07:00
        </Badge>

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="relative size-9 rounded-lg text-muted-foreground hover:text-foreground" />
            }
          >
            <Bell className="size-[17px]" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Notificações</p>
              <Sparkles className="size-4 text-primary" />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div key={n.title} className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium leading-tight">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="ml-1 rounded-full ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none" />
            }
          >
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-[11px] font-semibold text-white">
                SM
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Social Media</p>
              <p className="text-xs font-normal text-muted-foreground">equipe@provedor.com.br</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
