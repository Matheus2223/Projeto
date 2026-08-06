# TrendHub ISP AI

Plataforma de inteligência de conteúdo com IA para provedores de internet (ISPs). Monitora tendências das redes sociais e do Google, e transforma tudo em ideias de conteúdo prontas para gravar — roteiro, gancho, CTA, legenda e hashtags incluídos.

## Estrutura do monorepo

```
apps/
  web/   Next.js 16 (App Router) — a plataforma completa, com UI premium e dados de demonstração
  api/   NestJS + Prisma — backend real, pronto para conectar a um Postgres + integrações
```

### `apps/web` — Frontend

Next.js, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), Framer Motion, Recharts, Zustand.

Todas as 20 páginas do menu estão implementadas: Dashboard, Assuntos em Alta, Conteúdos Virais, Reels Virais, TikTok/Instagram/Facebook/YouTube Shorts/Threads, Google Trends, Notícias, Calendário Editorial, Ideias de Conteúdo, IA (chat), Banco de Posts, Biblioteca de Ganchos, Banco de CTA, Banco de Headlines, Análise da Concorrência, Relatório e Configurações — com dark/light mode, busca global (⌘K), filtros por estado/cidade/plataforma/data/segmento, scroll infinito e PWA.

**Dados**: para rodar sem depender de credenciais de terceiros, o frontend usa um gerador de dados determinístico (`src/lib/data/`) que produz um conjunto realista e grande (500+ ganchos/CTAs/headlines, 170+ ideias diárias, tendências, posts, concorrentes etc.) com seed fixa — os mesmos dados aparecem em todo carregamento, sem gerar mismatch de hidratação.

**IA**: a página `/ia` e a rota `POST /api/ai/chat` chamam a OpenAI (`gpt-4o-mini`) quando `OPENAI_API_KEY` está configurada no ambiente; sem a chave, cai automaticamente em um respondedor local (`src/lib/ai/fallback-responder.ts`) que usa os mesmos dados mock para responder de forma coerente — a experiência funciona 100% mesmo sem nenhuma chave.

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
```

Variáveis de ambiente opcionais (`.env.local`):

```
OPENAI_API_KEY=       # ativa respostas reais da IA em /ia
```

### `apps/api` — Backend

NestJS + Prisma 7 (driver adapter `@prisma/adapter-pg`) + PostgreSQL + pgvector + Redis + JWT.

Modela o domínio completo em `prisma/schema.prisma`: `Trend`, `ContentIdea`, `BankItem`, `Post`, `Competitor`, `CalendarEntry`, `NewsItem`, `DailyReport`, `DailyUpdateLog`, `ContentEmbedding` (pgvector, para busca semântica) e `User` (auth JWT).

Módulos: `auth`, `trends`, `ideas`, `banks`, `posts`, `competitors`, `calendar`, `reports`, `news`, `ai` (chat + embeddings OpenAI), `integrations` (um serviço por fonte: Google Trends, YouTube, Reddit, X, Instagram, TikTok, Anatel, RSS) e `scheduler` — o job `@Cron` das 07:00 que orquestra a coleta diária, gera o relatório e limpa tendências antigas, sem intervenção humana.

```bash
cd apps/api
npm install
cp .env.example .env    # preencha DATABASE_URL, JWT_SECRET, etc.
npx prisma migrate dev  # cria as tabelas (requer Postgres com a extensão "vector")
npm run start:dev       # http://localhost:3333/health
```

As integrações externas (`src/integrations/*.integration.ts`) já vêm com a interface, o tratamento de erro e comentários indicando exatamente qual API chamar e qual variável de ambiente configurar — elas retornam `[]` de forma segura até que as credenciais reais sejam adicionadas, para que o pipeline diário nunca quebre por causa de uma fonte fora do ar.

## O que é real vs. o que é maquete

| Camada | Estado |
|---|---|
| Design system, UI, navegação, filtros, busca | ✅ Real e funcional |
| Geração de ideias, roteiros, calendário editorial | ✅ Real (determinístico, sem IA paga) |
| Chat de IA | ✅ Real com `OPENAI_API_KEY`; fallback local sem chave |
| Banco de dados (Prisma/Postgres) | ✅ Schema completo e migrável; requer um Postgres com `pgvector` |
| Integrações externas (TikTok, Instagram, YouTube, Reddit, X, Anatel...) | ⚙️ Scaffold pronto, aguardando credenciais de cada provedor |
| Cron diário das 07:00 | ✅ Implementado (`@nestjs/schedule`); a lógica de mapear dados coletados → `Trend`/`ContentIdea` está marcada com `TODO` para quando as integrações tiverem credenciais reais |

## Próximos passos para produção

1. Provisionar Postgres (com a extensão `vector`) e Redis; preencher `apps/api/.env`.
2. Contratar/gerar credenciais das integrações desejadas e implementar cada `collect()` em `apps/api/src/integrations/`.
3. Conectar o frontend ao backend real (hoje o frontend web é autossuficiente com dados mock; trocar os `src/lib/data/generators/*` por chamadas à API é a próxima etapa natural).
4. Configurar `OPENAI_API_KEY` em produção para respostas de IA reais e habilitar embeddings/busca semântica (`apps/api/src/ai/embeddings.service.ts`).
