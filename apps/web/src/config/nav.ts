import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileBarChart,
  Flame,
  Sparkles,
  Clapperboard,
  TrendingUp,
  Newspaper,
  Music2,
  Camera,
  ThumbsUp,
  MonitorPlay,
  AtSign,
  CalendarDays,
  Lightbulb,
  BotMessageSquare,
  FolderKanban,
  Quote,
  MousePointerClick,
  Type,
  Users,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visão Geral",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Relatório", href: "/relatorio", icon: FileBarChart },
    ],
  },
  {
    label: "Tendências",
    items: [
      { label: "Assuntos em Alta", href: "/tendencias", icon: Flame },
      { label: "Conteúdos Virais", href: "/virais", icon: Sparkles },
      { label: "Reels Virais", href: "/reels", icon: Clapperboard },
      { label: "Google Trends", href: "/google-trends", icon: TrendingUp },
      { label: "Notícias", href: "/noticias", icon: Newspaper },
    ],
  },
  {
    label: "Redes Sociais",
    items: [
      { label: "TikTok", href: "/tiktok", icon: Music2 },
      { label: "Instagram", href: "/instagram", icon: Camera },
      { label: "Facebook", href: "/facebook", icon: ThumbsUp },
      { label: "YouTube Shorts", href: "/youtube-shorts", icon: MonitorPlay },
      { label: "Threads", href: "/threads", icon: AtSign },
    ],
  },
  {
    label: "Planejamento",
    items: [
      { label: "Calendário Editorial", href: "/calendario", icon: CalendarDays },
      { label: "Ideias de Conteúdo", href: "/ideias", icon: Lightbulb },
      { label: "IA", href: "/ia", icon: BotMessageSquare, badge: "Novo" },
    ],
  },
  {
    label: "Banco de Conteúdo",
    items: [
      { label: "Banco de Posts", href: "/banco-de-posts", icon: FolderKanban },
      { label: "Biblioteca de Ganchos", href: "/ganchos", icon: Quote },
      { label: "Banco de CTA", href: "/ctas", icon: MousePointerClick },
      { label: "Banco de Headlines", href: "/headlines", icon: Type },
    ],
  },
  {
    label: "Inteligência",
    items: [{ label: "Análise da Concorrência", href: "/concorrencia", icon: Users }],
  },
  {
    label: "Sistema",
    items: [{ label: "Configurações", href: "/configuracoes", icon: Settings }],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
