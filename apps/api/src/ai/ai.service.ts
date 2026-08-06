import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Você é a IA do TrendHub ISP AI, uma plataforma de inteligência de conteúdo para provedores de internet (ISPs) no Brasil. Responda em português do Brasil, de forma direta e acionável: gancho, roteiro, CTA, hashtags.`;

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
}
