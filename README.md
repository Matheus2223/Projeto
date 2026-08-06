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

**Dados — modo duplo (live + mock automático)**: cada página é um Server Component que busca dados reais em `apps/api` através de `src/lib/api/fetchers.ts`. Se o backend estiver no ar (Postgres populado), a página renderiza os dados reais; se estiver fora do ar, indisponível ou sem `API_URL` configurada, a mesma função cai automaticamente nos geradores determinísticos locais (`src/lib/data/`) — sem tela de erro, sem loading infinito. Isso significa que o frontend funciona sozinho (para demonstração) e também funciona 100% conectado ao backend real, sem nenhuma mudança de código entre os dois cenários. A camada de mock permanece como fallback: 500+ ganchos/CTAs/headlines, 170+ ideias diárias, tendências, posts, concorrentes etc., com seed fixa (mesmos dados a cada carregamento).

A autenticação com o backend acontece inteiramente no servidor: `src/lib/api/auth.ts` faz login como o usuário de demonstração semeado (`prisma/seed.ts`) e reutiliza o JWT entre requisições — o token nunca chega ao navegador.

**Concorrentes com CRUD real**: em `/concorrencia`, "Adicionar concorrente" chama uma Server Action (`src/app/(app)/concorrencia/actions.ts`) que grava de verdade no Postgres via `POST /competitors`; se o backend estiver fora do ar, cai num registro local sintético para não travar a experiência.

**IA**: a página `/ia` e a rota `POST /api/ai/chat` chamam a OpenAI (`gpt-4o-mini`) quando `OPENAI_API_KEY` está configurada no ambiente; sem a chave, cai automaticamente em um respondedor local (`src/lib/ai/fallback-responder.ts`) que usa os mesmos dados mock para responder de forma coerente — a experiência funciona 100% mesmo sem nenhuma chave.

```bash
cd apps/web
npm install
cp .env.example .env.local   # opcional — os padrões já apontam para o backend local
npm run dev      # http://localhost:3000
```

Variáveis de ambiente opcionais (`.env.local`, veja `.env.example`):

```
OPENAI_API_KEY=                              # ativa respostas reais da IA em /ia
API_URL=http://localhost:3333/api/v1         # backend NestJS; se ausente/indisponível, cai no mock
API_DEMO_EMAIL=equipe@provedor.com.br        # usuário semeado usado para autenticação servidor-a-servidor
API_DEMO_PASSWORD=trendhub123
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
npx prisma db seed      # popula um conjunto de demonstração (140 tendências, 170 ideias, 1200 itens de banco, 160 posts, 8 concorrentes, calendário de 30 dias, 60 notícias, 1 relatório + usuário demo)
npm run start:dev       # http://localhost:3333/health
```

Testado de ponta a ponta nesta entrega: Postgres 16 + pgvector local → migrações → seed → NestJS respondendo com dados reais → Next.js consumindo tudo (incluindo criação de concorrente via Server Action persistindo no banco).

As integrações externas (`src/integrations/*.integration.ts`) já vêm com a interface, o tratamento de erro e comentários indicando exatamente qual API chamar e qual variável de ambiente configurar — elas retornam `[]` de forma segura até que as credenciais reais sejam adicionadas, para que o pipeline diário nunca quebre por causa de uma fonte fora do ar.

## O que é real vs. o que é maquete

| Camada | Estado |
|---|---|
| Design system, UI, navegação, filtros, busca | ✅ Real e funcional |
| Geração de ideias, roteiros, calendário editorial | ✅ Real (determinístico, sem IA paga) |
| Frontend conectado ao backend real | ✅ Toda página busca dados via `apps/api`, com fallback automático para mock se o backend estiver fora do ar |
| Cadastro de concorrentes | ✅ CRUD real (Server Action → NestJS → Postgres), com fallback local se o backend estiver fora do ar |
| Chat de IA | ✅ Real com `OPENAI_API_KEY`; fallback local sem chave |
| Banco de dados (Prisma/Postgres) | ✅ Schema completo, migrável e semeado; testado com Postgres 16 + pgvector local |
| Integrações externas (TikTok, Instagram, YouTube, Reddit, X, Anatel...) | ⚙️ Scaffold pronto, aguardando credenciais de cada provedor |
| Cron diário das 07:00 | ✅ Implementado (`@nestjs/schedule`); a lógica de mapear dados coletados → `Trend`/`ContentIdea` está marcada com `TODO` para quando as integrações tiverem credenciais reais |

## Próximos passos para produção

1. Provisionar Postgres (com a extensão `vector`) e Redis gerenciados; preencher `apps/api/.env` com a URL real.
2. Contratar/gerar credenciais das integrações desejadas e implementar cada `collect()` em `apps/api/src/integrations/` — hoje elas alimentariam o pipeline diário que já existe.
3. Configurar `API_URL` do frontend apontando para o backend implantado (hoje ambos rodam localmente lado a lado nesta entrega).
4. Configurar `OPENAI_API_KEY` em produção para respostas de IA reais e habilitar embeddings/busca semântica (`apps/api/src/ai/embeddings.service.ts`).
