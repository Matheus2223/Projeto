import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { generateFallbackResponse } from "@/lib/ai/fallback-responder";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function textStream(text: string, chunkSize = 3): ReadableStream<Uint8Array> {
  const words = text.split(" ");
  const encoder = new TextEncoder();
  let i = 0;

  return new ReadableStream({
    async pull(controller) {
      if (i >= words.length) {
        controller.close();
        return;
      }
      const chunk = words.slice(i, i + chunkSize).join(" ") + " ";
      i += chunkSize;
      controller.enqueue(encoder.encode(chunk));
      await new Promise((resolve) => setTimeout(resolve, 25));
    },
  });
}

async function openAiStream(messages: ChatMessage[], apiKey: string): Promise<ReadableStream<Uint8Array>> {
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    throw new Error(`OpenAI request failed: ${upstream.status}`);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        } catch {
          // ignore malformed SSE fragments
        }
      }
    },
  });
}

export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json();
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    if (apiKey) {
      const stream = await openAiStream(messages, apiKey);
      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  } catch {
    // fall through to local fallback responder if the upstream call fails
  }

  const fallback = generateFallbackResponse(lastUserMessage);
  return new Response(textStream(fallback), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
