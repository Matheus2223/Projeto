import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-[14px] font-semibold">{title}</p>
        {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
