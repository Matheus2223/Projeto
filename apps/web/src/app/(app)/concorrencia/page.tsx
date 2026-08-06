"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { CompetitorCard } from "@/components/shared/competitor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPETITORS } from "@/lib/data/generators/competitors";
import { SEGMENTS } from "@/lib/data/constants";
import { Rng } from "@/lib/data/rng";
import type { Competitor } from "@/lib/data/types";

const PALETTE_OPTIONS = [
  ["#7C3AED", "#22D3EE", "#111827"],
  ["#F97316", "#111827", "#FFFFFF"],
  ["#059669", "#0EA5E9", "#F8FAFC"],
];

export default function ConcorrenciaPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(COMPETITORS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [segment, setSegment] = useState<string>(SEGMENTS[0]);

  const addCompetitor = () => {
    if (!name.trim()) return;
    const rng = new Rng(name + Date.now());
    const newCompetitor: Competitor = {
      id: `competitor-custom-${Date.now()}`,
      name: name.trim(),
      handle: handle.trim() || `@${name.toLowerCase().replace(/\s+/g, "")}`,
      platforms: rng.pickMany(["instagram", "tiktok", "facebook"], 2),
      segment: segment as Competitor["segment"],
      followers: rng.int(1500, 90000),
      postFrequencyPerWeek: rng.int(2, 10),
      avgEngagementRate: Number(rng.float(1, 8).toFixed(1)),
      colorPalette: rng.pick(PALETTE_OPTIONS),
      visualStyle: "Em análise pela IA — os primeiros dados aparecerão após a próxima atualização diária.",
      strengths: ["Aguardando primeira coleta de dados"],
      weaknesses: ["Aguardando primeira coleta de dados"],
      whatToCopy: ["A IA ainda está coletando os primeiros posts deste concorrente"],
      whatToAvoid: ["Disponível após a próxima atualização às 07:00"],
      opportunities: ["Disponível após a próxima atualização às 07:00"],
    };
    setCompetitors((prev) => [newCompetitor, ...prev]);
    toast.success(`${name} adicionado. A IA vai analisá-lo na próxima atualização.`);
    setOpen(false);
    setName("");
    setHandle("");
  };

  return (
    <div>
      <PageHeader
        title="🕵️ Análise da Concorrência"
        description="Cadastre concorrentes e deixe a IA analisar frequência, visual, engajamento e padrões de conteúdo."
        actions={
          <Button onClick={() => setOpen(true)} className="gap-2 rounded-lg">
            <Plus className="size-4" /> Adicionar concorrente
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {competitors.map((c, i) => (
          <CompetitorCard key={c.id} competitor={c} index={i} />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar concorrente</DialogTitle>
            <DialogDescription>A IA vai monitorar automaticamente o perfil na próxima atualização diária.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="competitor-name">Nome do provedor</Label>
              <Input id="competitor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: NetVelox Telecom" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="competitor-handle">@ nas redes sociais</Label>
              <Input id="competitor-handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@netvelox" />
            </div>
            <div className="space-y-1.5">
              <Label>Segmento principal</Label>
              <Select value={segment} onValueChange={(v) => setSegment(v ?? SEGMENTS[0])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={addCompetitor} disabled={!name.trim()}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
