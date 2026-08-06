import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }): string {
  return new Intl.DateTimeFormat("pt-BR", opts).format(new Date(iso));
}
