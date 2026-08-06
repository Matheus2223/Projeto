import { cn } from "@/lib/utils";
import { PLATFORM_META, TREND_STATUS_META, type Platform, type TrendStatus } from "@/lib/data/constants";

export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  const meta = PLATFORM_META[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full bg-gradient-to-br", meta.gradient)} />
      {meta.label}
    </span>
  );
}

export function TrendStatusBadge({ status, className }: { status: TrendStatus; className?: string }) {
  const meta = TREND_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        meta.className,
        className,
      )}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
