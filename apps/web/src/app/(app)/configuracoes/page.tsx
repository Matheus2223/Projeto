"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Moon, Sun, Monitor, Check, KeyRound } from "lucide-react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLATFORM_META } from "@/lib/data/constants";
import { cn } from "@/lib/utils";

const SOURCES = [
  { key: "instagram", label: "Instagram", connected: true },
  { key: "tiktok", label: "TikTok", connected: true },
  { key: "facebook", label: "Facebook", connected: true },
  { key: "youtube_shorts", label: "YouTube Data API", connected: true },
  { key: "threads", label: "Threads", connected: false },
  { key: "google_trends", label: "Google Trends", connected: true },
  { key: "google_news", label: "Google News", connected: true },
  { key: "reddit", label: "Reddit API", connected: false },
  { key: "x", label: "X API", connected: false },
  { key: "pinterest", label: "Pinterest", connected: false },
  { key: "linkedin", label: "LinkedIn", connected: false },
  { key: "blog", label: "RSS de portais especializados", connected: true },
  { key: "anatel", label: "Anatel", connected: true },
];

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
      <Separator className="my-4" />
      {children}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [updateTime, setUpdateTime] = useState("07:00");
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>(
    Object.fromEntries(SOURCES.map((s) => [s.key, s.connected])),
  );
  const [notifications, setNotifications] = useState({ email: true, push: true, weekly: false });

  useEffect(() => {
    // Intentional mounted-gate: avoids a hydration mismatch on the theme
    // buttons below, which can't know the resolved theme until after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const save = (message: string) => toast.success(message);

  return (
    <div className="max-w-3xl">
      <PageHeader title="⚙️ Configurações" description="Gerencie seu perfil, integrações e preferências da plataforma." />

      <div className="flex flex-col gap-5">
        <SectionCard title="Perfil" description="Suas informações pessoais dentro da plataforma.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="Equipe Social Media" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="equipe@provedor.com.br" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company">Nome do provedor</Label>
              <Input id="company" defaultValue="Minha Internet Provedor" />
            </div>
          </div>
          <Button className="mt-4 rounded-lg" onClick={() => save("Perfil atualizado")}>Salvar alterações</Button>
        </SectionCard>

        <SectionCard title="Automação diária" description="Configure o horário e a frequência da atualização automática da IA.">
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3.5">
            <div>
              <p className="text-[13.5px] font-medium">Atualização automática</p>
              <p className="text-[12px] text-muted-foreground">Buscar tendências, notícias e gerar novas ideias todos os dias</p>
            </div>
            <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="update-time" className="shrink-0">Horário da atualização</Label>
            <Select value={updateTime} onValueChange={(v) => setUpdateTime(v ?? "07:00")} disabled={!autoUpdate}>
              <SelectTrigger id="update-time" className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["05:00", "06:00", "07:00", "08:00", "09:00"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </SectionCard>

        <SectionCard title="Fontes monitoradas" description="A IA coleta dados dessas fontes automaticamente. Conecte novas integrações a qualquer momento.">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SOURCES.map((s) => (
              <div key={s.key} className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                <div className="flex items-center gap-2.5">
                  <span className={cn("size-2 rounded-full", enabledSources[s.key] ? "bg-success" : "bg-muted-foreground/30")} />
                  <span className="text-[13px] font-medium">{s.label}</span>
                </div>
                <Switch
                  checked={enabledSources[s.key]}
                  onCheckedChange={(v) => setEnabledSources((prev) => ({ ...prev, [s.key]: v }))}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Integrações e chaves de API" description="Conecte suas próprias credenciais para habilitar coleta de dados em tempo real.">
          <div className="flex flex-col gap-3">
            {[
              { name: "OpenAI API", placeholder: "sk-..." },
              { name: "YouTube Data API", placeholder: "AIza..." },
              { name: "Instagram Graph API", placeholder: "EAAG..." },
            ].map((integration) => (
              <div key={integration.name} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Label className="w-full shrink-0 sm:w-44">{integration.name}</Label>
                <div className="relative flex-1">
                  <KeyRound className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder={integration.placeholder} className="pl-8" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 rounded-lg" onClick={() => save("Chaves de API salvas com segurança")}>Salvar credenciais</Button>
        </SectionCard>

        <SectionCard title="Notificações" description="Escolha como você quer ser avisado sobre novidades e alertas da IA.">
          <div className="flex flex-col gap-3">
            {[
              { key: "email" as const, label: "Alertas por e-mail", desc: "Receba o relatório diário por e-mail" },
              { key: "push" as const, label: "Notificações push", desc: "Alertas de tendências virais em tempo real" },
              { key: "weekly" as const, label: "Resumo semanal", desc: "Um resumo consolidado toda segunda-feira" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3.5">
                <div>
                  <p className="text-[13.5px] font-medium">{n.label}</p>
                  <p className="text-[12px] text-muted-foreground">{n.desc}</p>
                </div>
                <Switch
                  checked={notifications[n.key]}
                  onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Aparência" description="Personalize a interface da plataforma.">
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "light", label: "Claro", icon: Sun },
              { key: "dark", label: "Escuro", icon: Moon },
              { key: "system", label: "Sistema", icon: Monitor },
            ].map((opt) => {
              const active = mounted && theme === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border/70 hover:bg-accent/50",
                  )}
                >
                  <opt.icon className="size-5" />
                  <span className="text-[12.5px] font-medium">{opt.label}</span>
                  {active && <Check className="size-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="flex flex-wrap gap-2 pb-4">
          {Object.entries(PLATFORM_META).map(([key, meta]) => (
            <Badge key={key} variant="outline" className="gap-1.5 rounded-full">
              <span className={cn("size-1.5 rounded-full bg-gradient-to-br", meta.gradient)} />
              {meta.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
