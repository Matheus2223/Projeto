"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Video, Star, Wand2, Copy, Check } from "lucide-react";
import type { ContentIdea } from "@/lib/data/types";
import { PlatformBadge } from "./badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: "bg-success/15 text-success border-success/30",
  Médio: "bg-warning/15 text-warning border-warning/30",
  Difícil: "bg-danger/15 text-danger border-danger/30",
};

export function IdeaCard({ idea, index = 0 }: { idea: ContentIdea; index?: number }) {
  const [open, setOpen] = useState(false);
  const [favorited, setFavorited] = useState(!!idea.favorited);
  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    const text = [
      `Título: ${idea.title}`,
      `Gancho: ${idea.hook}`,
      "",
      "Roteiro:",
      ...idea.script,
      "",
      `CTA: ${idea.cta}`,
      `Legenda: ${idea.caption}`,
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    toast.success("Roteiro copiado para a área de transferência");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card group flex flex-col gap-3 rounded-2xl p-4 sm:p-5"
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full font-medium">
            {idea.format}
          </Badge>
          <PlatformBadge platform={idea.platform} />
          <button
            onClick={() => setFavorited((v) => !v)}
            className="ml-auto text-muted-foreground transition-colors hover:text-warning"
            aria-label="Favoritar"
          >
            <Star className={cn("size-4", favorited && "fill-warning text-warning")} />
          </button>
        </div>

        <h3 className="text-[14.5px] font-semibold leading-snug">{idea.hook}</h3>
        <p className="line-clamp-2 text-[13px] text-muted-foreground">{idea.objective}</p>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {idea.estimatedTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <Video className="size-3.5" /> {idea.recordingTime}
          </span>
          <span className={cn("rounded-full border px-2 py-0.5 font-medium", DIFFICULTY_COLOR[idea.difficulty])}>
            {idea.difficulty}
          </span>
        </div>

        <Button size="sm" variant="secondary" className="mt-1 rounded-lg" onClick={() => setOpen(true)}>
          Ver roteiro completo
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">{idea.format}</Badge>
              <PlatformBadge platform={idea.platform} />
            </div>
            <DialogTitle className="text-left text-lg leading-snug">{idea.title}</DialogTitle>
            <DialogDescription className="text-left">{idea.objective}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <section>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gancho</p>
              <p className="rounded-lg bg-secondary/60 p-3">{idea.hook}</p>
            </section>

            <section>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roteiro completo</p>
              <ol className="space-y-2">
                {idea.script.map((step, i) => (
                  <li key={i} className="rounded-lg border border-border/70 p-2.5 text-[13px]">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA</p>
                <p className="text-[13px]">{idea.cta}</p>
              </section>
              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dificuldade</p>
                <span className={cn("inline-block rounded-full border px-2 py-0.5 text-xs font-medium", DIFFICULTY_COLOR[idea.difficulty])}>
                  {idea.difficulty}
                </span>
              </section>
              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tempo de gravação</p>
                <p className="text-[13px]">{idea.recordingTime}</p>
              </section>
              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duração final</p>
                <p className="text-[13px]">{idea.estimatedTime}</p>
              </section>
            </div>

            <section>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Equipamentos</p>
              <div className="flex flex-wrap gap-1.5">
                {idea.equipment.map((eq) => (
                  <Badge key={eq} variant="outline" className="rounded-full font-normal">
                    {eq}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legenda pronta</p>
              <p className="rounded-lg bg-secondary/60 p-3 text-[13px]">{idea.caption}</p>
            </section>

            <section>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {idea.hashtags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary/70 px-2 py-0.5 text-[11px]">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <Wand2 className="size-3.5" /> Prompt para IA
              </p>
              <p className="text-[13px] text-foreground/90">{idea.aiPrompt}</p>
            </section>
          </div>

          <Button onClick={copyScript} className="mt-2 gap-2 rounded-lg">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copiado!" : "Copiar roteiro completo"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
