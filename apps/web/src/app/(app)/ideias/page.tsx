"use client";

import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { IdeaExplorer } from "@/components/shared/idea-explorer";
import { Badge } from "@/components/ui/badge";
import { CONTENT_IDEAS } from "@/lib/data/generators/ideas";
import { CONTENT_FORMATS } from "@/lib/data/constants";

export default function IdeiasPage() {
  const counts = CONTENT_FORMATS.map((format) => ({
    format,
    count: CONTENT_IDEAS.filter((i) => i.format === format).length,
  }));

  return (
    <div>
      <PageHeader
        title="💡 Ideias de Conteúdo"
        description={`A IA já gerou ${CONTENT_IDEAS.length} ideias específicas para provedores de internet hoje — roteiro completo, gancho, CTA e hashtags prontos.`}
        actions={
          <Badge variant="outline" className="gap-1.5 rounded-full border-primary/30 bg-primary/10 py-1.5 text-primary">
            <Sparkles className="size-3.5" /> Atualizado às 07:00
          </Badge>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {counts.map(({ format, count }) => (
          <span key={format} className="glass-card rounded-full px-3 py-1.5 text-[12px] font-medium">
            {format} <span className="text-muted-foreground">· {count}</span>
          </span>
        ))}
      </div>

      <IdeaExplorer ideas={CONTENT_IDEAS} />
    </div>
  );
}
