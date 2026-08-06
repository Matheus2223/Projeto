import { Rng } from "../rng";
import {
  PLATFORMS,
  SEGMENTS,
  CONTENT_FORMATS,
  DIFFICULTY,
  EQUIPMENT_POOL,
  OBJECTIVES,
  ContentFormat,
} from "../constants";
import { TOPICS, HOOK_TEMPLATES, CTA_TEMPLATES, HASHTAG_POOL, EMOJIS_HOOK } from "../vocab";
import type { ContentIdea } from "../types";

const FORMAT_TARGET_COUNT: Record<ContentFormat, number> = {
  Reels: 30,
  Stories: 30,
  Carrossel: 20,
  "Post único": 20,
  Campanha: 15,
  Anúncio: 15,
  "Vídeo engraçado": 10,
  "Vídeo emocionante": 10,
  "Vídeo educativo": 10,
  "Vídeo comercial": 10,
};

const FORMAT_TIME: Record<ContentFormat, string> = {
  Reels: "15-30s",
  Stories: "10-15s",
  Carrossel: "5-8 slides",
  "Post único": "1 imagem",
  Campanha: "multi-formato",
  Anúncio: "15-20s",
  "Vídeo engraçado": "20-40s",
  "Vídeo emocionante": "30-60s",
  "Vídeo educativo": "45-90s",
  "Vídeo comercial": "20-30s",
};

function buildScript(rng: Rng, topic: string, hook: string, cta: string): string[] {
  return [
    `Abertura (0-3s): ${hook}.`,
    `Contexto (3-8s): Mostre na tela o problema real que o cliente enfrenta com ${topic}.`,
    `Demonstração (8-18s): Grave a solução em ação — técnico, app ou comparação de velocidade sobre ${topic}.`,
    `Prova social (18-24s): Insira depoimento rápido ou print de avaliação de cliente satisfeito.`,
    `Fechamento (24-30s): ${cta}.`,
  ];
}

export function generateIdeas(seed: string | number = "ideas-v1"): ContentIdea[] {
  const rng = new Rng(seed);
  const ideas: ContentIdea[] = [];
  let counter = 0;
  const now = Date.now();

  for (const format of CONTENT_FORMATS) {
    const target = FORMAT_TARGET_COUNT[format];
    for (let i = 0; i < target; i++) {
      const topic = rng.pick(TOPICS);
      const hookRaw = rng.pick(HOOK_TEMPLATES).replace("{topic}", topic);
      const emoji = rng.pick(EMOJIS_HOOK);
      const hook = `${emoji} ${hookRaw}`;
      const ctaRaw = rng.pick(CTA_TEMPLATES).replace("{topic}", topic);
      const segment = rng.pick(SEGMENTS);
      const platform = rng.pick(PLATFORMS);
      const objective = rng.pick(OBJECTIVES);
      const difficulty = rng.pick(DIFFICULTY);

      ideas.push({
        id: `idea-${counter++}`,
        format,
        title: `${format}: ${hookRaw}`,
        hook,
        script: buildScript(rng, topic, hookRaw, ctaRaw),
        estimatedTime: FORMAT_TIME[format],
        cta: ctaRaw,
        caption: `${hookRaw} 👇 ${ctaRaw} #${topic.replace(/\s+/g, "")}`,
        hashtags: rng.pickMany(HASHTAG_POOL, rng.int(4, 7)),
        objective,
        difficulty,
        recordingTime: `${rng.int(5, 45)} min`,
        equipment: rng.pickMany(EQUIPMENT_POOL, rng.int(2, 4)),
        aiPrompt: `Crie um roteiro de ${format.toLowerCase()} para provedor de internet sobre "${topic}", com gancho de impacto nos primeiros 3 segundos, tom ${rng.pick([
          "bem-humorado",
          "educativo",
          "emocional",
          "direto e comercial",
          "inspirador",
        ])}, finalizando com a chamada: "${ctaRaw}".`,
        platform,
        segment,
        createdAt: new Date(now - rng.int(0, 2) * 86400000).toISOString(),
        favorited: rng.bool(0.15),
      });
    }
  }

  return rng.shuffle(ideas);
}

export const CONTENT_IDEAS = generateIdeas();
