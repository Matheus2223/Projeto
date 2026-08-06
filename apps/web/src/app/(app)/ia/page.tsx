"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Bot, Sparkles, User } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SimpleMarkdown } from "@/components/ai/simple-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "O que postar hoje?",
  "Me dê 10 ideias para fibra óptica",
  "Crie um Reels viral",
  "Crie um anúncio",
  "Me dê uma campanha para Dia dos Pais",
  "Quais tendências devo aproveitar?",
];

export default function IaPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });

      if (!res.body) throw new Error("Sem resposta");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "Não consegui responder agora. Tente novamente em instantes." } : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col">
      <PageHeader
        title="🤖 IA — Pesquisa Inteligente"
        description="Pergunte o que quiser: ideias, roteiros, campanhas ou análise de tendências para o seu provedor."
      />

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg">
              <Sparkles className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Como posso ajudar hoje?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Escolha uma sugestão ou digite sua pergunta abaixo.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="glass-card rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-transform hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-gradient-to-br from-violet-500 to-cyan-400 text-white",
              )}
            >
              {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
            </span>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                m.role === "user" ? "bg-primary text-primary-foreground" : "glass-card",
              )}
            >
              {m.content ? (
                <SimpleMarkdown text={m.content} />
              ) : (
                <span className="inline-flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current" />
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="glass-card flex items-end gap-2 rounded-2xl p-2.5"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Pergunte o que quiser sobre conteúdo, tendências ou campanhas..."
          className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" size="icon" className="size-9 shrink-0 rounded-lg" disabled={loading || !input.trim()}>
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  );
}
