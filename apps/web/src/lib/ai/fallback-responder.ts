import { TRENDS } from "@/lib/data/generators/trends";
import { CONTENT_IDEAS } from "@/lib/data/generators/ideas";
import { DAILY_REPORT } from "@/lib/data/generators/reports";
import { TOPICS, HOOK_TEMPLATES, CTA_TEMPLATES } from "@/lib/data/vocab";
import { Rng } from "@/lib/data/rng";

function extractCount(text: string): number | null {
  const match = text.match(/(\d{1,3})/);
  return match ? Math.min(parseInt(match[1], 10), 30) : null;
}

function extractTopic(text: string): string {
  const lower = text.toLowerCase();
  const found = TOPICS.find((t) => lower.includes(t.split(" ")[0]));
  return found ?? "fibra óptica";
}

function buildIdeaBlock(rng: Rng, topic: string, format: string): string {
  const hook = rng.pick(HOOK_TEMPLATES).replace("{topic}", topic);
  const cta = rng.pick(CTA_TEMPLATES).replace("{topic}", topic);
  return `**${format}: ${hook}**\n- Gancho (0-3s): ${hook}\n- Desenvolvimento: mostre a solução na prática relacionada a ${topic}\n- CTA: ${cta}`;
}

export function generateFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const rng = new Rng(userMessage + Date.now());

  if (lower.includes("o que postar") || (lower.includes("postar") && lower.includes("hoje"))) {
    const top = TRENDS.slice(0, 3);
    return [
      "Aqui está o que eu recomendo postar hoje, com base nas tendências mais fortes do momento:",
      "",
      ...top.map(
        (t, i) =>
          `${i + 1}. **${t.title}** (${t.platform}) — índice de crescimento ${t.growthIndex}/100.\n   Sugestão: ${t.postSuggestion}`,
      ),
      "",
      `Score de oportunidade do dia: ${DAILY_REPORT.opportunityScore}/100. Probabilidade de viralização: ${DAILY_REPORT.viralProbability}%.`,
    ].join("\n");
  }

  if (lower.includes("ideia")) {
    const count = extractCount(lower) ?? 5;
    const topic = extractTopic(lower);
    const blocks = Array.from({ length: Math.min(count, 8) }).map(() => buildIdeaBlock(rng, topic, "Ideia"));
    return [`Aqui estão ${count} ideias sobre ${topic} (mostrando as primeiras ${blocks.length} em detalhe):`, "", ...blocks].join("\n\n");
  }

  if (lower.includes("reels")) {
    const topic = extractTopic(lower);
    const idea = CONTENT_IDEAS.find((i) => i.format === "Reels") ?? CONTENT_IDEAS[0];
    return [
      `Aqui está um roteiro de Reels viral sobre ${topic}:`,
      "",
      `**Gancho:** ${idea.hook}`,
      "",
      "**Roteiro:**",
      ...idea.script.map((s) => `- ${s}`),
      "",
      `**CTA:** ${idea.cta}`,
      `**Legenda:** ${idea.caption}`,
      `**Hashtags:** ${idea.hashtags.join(" ")}`,
    ].join("\n");
  }

  if (lower.includes("anúncio") || lower.includes("anuncio")) {
    const idea = CONTENT_IDEAS.find((i) => i.format === "Anúncio") ?? CONTENT_IDEAS[0];
    return [
      "Aqui está um anúncio pronto para rodar em Meta Ads / TikTok Ads:",
      "",
      `**Gancho:** ${idea.hook}`,
      `**Roteiro:**`,
      ...idea.script.map((s) => `- ${s}`),
      `**CTA:** ${idea.cta}`,
    ].join("\n");
  }

  if (lower.includes("campanha")) {
    const occasionMatch = ["dia dos pais", "dia das mães", "black friday", "volta às aulas", "natal", "aniversário"].find((o) =>
      lower.includes(o),
    );
    const occasion = occasionMatch ?? "sazonal";
    const topic = extractTopic(lower);
    return [
      `Campanha sugerida para ${occasion}, focada em ${topic}:`,
      "",
      "1. **Teaser** (3 dias antes): Reels de expectativa com contagem regressiva.",
      `2. **Lançamento**: Post + Stories anunciando a condição especial de ${occasion}.`,
      "3. **Prova social**: depoimento de cliente real usando o serviço.",
      "4. **Última chamada**: Stories com contagem regressiva e CTA direto para WhatsApp.",
      "",
      "Quer que eu detalhe o roteiro de cada etapa?",
    ].join("\n");
  }

  if (lower.includes("tendênc") || lower.includes("tendenc")) {
    const top = TRENDS.filter((t) => t.status === "explodindo" || t.status === "viral").slice(0, 5);
    return [
      "Estas são as tendências que eu aproveitaria agora:",
      "",
      ...top.map((t) => `- **${t.title}** — ${t.platform}, crescimento ${t.growthIndex}/100 (${t.status})`),
    ].join("\n");
  }

  const topic = extractTopic(lower);
  const idea = CONTENT_IDEAS[rng.int(0, CONTENT_IDEAS.length - 1)];
  return [
    `Posso ajudar com isso! Baseado no seu contexto sobre "${userMessage.slice(0, 80)}", aqui vai uma sugestão relacionada a ${topic}:`,
    "",
    `**${idea.format}: ${idea.hook}**`,
    `CTA: ${idea.cta}`,
    "",
    "Você também pode perguntar: \"o que postar hoje?\", \"me dê 10 ideias para fibra óptica\", \"crie um reels viral\" ou \"crie uma campanha para dia dos pais\".",
  ].join("\n");
}
