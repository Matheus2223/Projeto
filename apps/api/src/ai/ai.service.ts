import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GeneratedIdeaPayload } from './generated-idea.types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Você é a IA do TrendHub ISP AI, uma plataforma de inteligência de conteúdo para provedores de internet (ISPs) no Brasil. Responda em português do Brasil, de forma direta e acionável: gancho, roteiro, CTA, hashtags.`;

const IDEAS_SYSTEM_PROMPT = `Você é a IA de geração de conteúdo do TrendHub ISP AI, especializada em criar ideias de posts para redes sociais de provedores de internet brasileiros. Responda sempre em português do Brasil e SOMENTE com JSON válido, sem nenhum texto fora do JSON.`;

/**
 * Thin wrapper around the OpenAI Chat Completions API. Falls back to a
 * descriptive error the caller can catch — the Next.js frontend already
 * ships a self-contained fallback responder for demos without an API key,
 * this service is the "real" implementation for the production backend.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {}

  async chat(messages: ChatMessage[]): Promise<string> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!res.ok) {
      this.logger.error(
        `OpenAI request failed: ${res.status} ${await res.text()}`,
      );
      throw new Error('Falha ao consultar a IA');
    }

    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0]?.message?.content ?? '';
  }

  /**
   * Turns a list of hot topics/trend titles into structured content ideas
   * using OpenAI's JSON mode. Called by the daily scheduler
   * (DailyUpdateService) — throws when no API key is configured or the
   * request/parse fails, so the caller can fall back to
   * idea-fallback.generator.ts and the pipeline never produces zero ideas.
   */
  async generateContentIdeas(
    topics: string[],
    count: number,
  ): Promise<GeneratedIdeaPayload[]> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const prompt = `Gere exatamente ${count} ideias de conteúdo para redes sociais de um provedor de internet (ISP) brasileiro, inspiradas nestes assuntos em alta: ${topics.join(', ')}.

Responda com um objeto JSON no formato {"ideas": [...]}, onde cada item do array "ideas" tem exatamente estes campos:
- "format": um destes valores exatos: "Reels", "Stories", "Carrossel", "Post único", "Vídeo educativo", "Vídeo comercial"
- "title": título curto da ideia
- "hook": gancho de impacto para os primeiros 3 segundos
- "script": array com 3 a 5 passos do roteiro (strings)
- "estimatedTime": duração estimada do conteúdo final (ex: "15-30s")
- "cta": chamada para ação
- "caption": legenda pronta incluindo o CTA
- "hashtags": array com 4 a 6 hashtags (com #)
- "objective": objetivo de marketing da publicação
- "difficulty": um destes valores exatos: "Fácil", "Médio", "Difícil"
- "recordingTime": tempo estimado de gravação (ex: "20 min")
- "equipment": array com equipamentos necessários
- "platform": um destes valores exatos: "instagram", "tiktok", "facebook", "youtube_shorts", "threads"
- "segment": segmento de negócio do provedor relacionado (ex: "Fibra Óptica Residencial")`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: IDEAS_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      this.logger.error(
        `OpenAI ideas request failed: ${res.status} ${await res.text()}`,
      );
      throw new Error('Falha ao gerar ideias com a IA');
    }

    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const raw = data.choices[0]?.message?.content ?? '{}';

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Resposta da IA não é um JSON válido');
    }

    const ideas = (parsed as { ideas?: unknown }).ideas;
    if (!Array.isArray(ideas)) {
      throw new Error('Resposta da IA não contém um array "ideas"');
    }

    return ideas as GeneratedIdeaPayload[];
  }
}
