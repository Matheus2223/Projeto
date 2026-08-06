import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface SimilarContent {
  id: string;
  sourceType: string;
  sourceId: string;
  content: string;
  distance: number;
}

/**
 * Embeddings + semantic search over generated content using pgvector.
 * Requires `CREATE EXTENSION IF NOT EXISTS vector;` on the database
 * (already declared in prisma/schema.prisma via `extensions = [vector]`).
 *
 * Prisma Client cannot type a `vector` column, so writes/reads go through
 * raw SQL here — this is the standard, documented approach for pgvector
 * with Prisma.
 */
@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async embed(text: string): Promise<number[]> {
    const apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
    });

    if (!res.ok) {
      this.logger.error(`OpenAI embeddings request failed: ${res.status}`);
      throw new Error('Falha ao gerar embedding');
    }

    const data = (await res.json()) as { data: { embedding: number[] }[] };
    return data.data[0].embedding;
  }

  async upsert(sourceType: string, sourceId: string, content: string) {
    const embedding = await this.embed(content);
    const vector = `[${embedding.join(',')}]`;

    await this.prisma.$executeRaw`
      INSERT INTO content_embeddings (id, "sourceType", "sourceId", content, embedding, "createdAt")
      VALUES (gen_random_uuid()::text, ${sourceType}, ${sourceId}, ${content}, ${vector}::vector, now())
      ON CONFLICT ("sourceType", "sourceId")
      DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding
    `;
  }

  async findSimilar(query: string, limit = 8): Promise<SimilarContent[]> {
    const embedding = await this.embed(query);
    const vector = `[${embedding.join(',')}]`;

    return this.prisma.$queryRaw<SimilarContent[]>`
      SELECT id, "sourceType", "sourceId", content, embedding <=> ${vector}::vector AS distance
      FROM content_embeddings
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${limit}
    `;
  }
}
