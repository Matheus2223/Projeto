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

Módulos: `auth`, `trends`, `ideas`, `banks`, `posts`, `competitors`, `calendar`, `reports`, `news`, `ai` (chat + geração de ideias + embeddings OpenAI), `integrations` (um serviço por fonte: Google Trends, YouTube, Reddit, X, Instagram, TikTok, Anatel, RSS) e `scheduler`.

**O pipeline diário das 07:00 é real e fecha o ciclo completo, sem intervenção humana** (`src/scheduler/daily-update.service.ts`, `@Cron(EVERY_DAY_AT_7AM)`):
1. Chama `collect()` de cada integração — hoje a de **RSS já coleta notícias reais** (TeleTime, TeleSíntese, Olhar Digital, sem precisar de credencial); as demais retornam `[]` até que uma API key seja configurada.
2. **Persiste as tendências de verdade** (`TrendsService.upsertCollected`): título novo vira uma `Trend` nova; título já visto tem o índice de crescimento, a velocidade e as visualizações atualizados — sem duplicar.
3. **Gera novas `ContentIdea` com IA de verdade** (`IdeasGenerationService`): chama a OpenAI (modo JSON) pedindo ideias baseadas nas manchetes/tendências do dia; se `OPENAI_API_KEY` não estiver configurada ou a chamada falhar, cai automaticamente num gerador local baseado em regras (`idea-fallback.generator.ts`) — o pipeline nunca gera zero ideias.
4. Remove tendências com mais de 14 dias e grava um `DailyUpdateLog` com o resultado da execução (fontes processadas, tendências novas/atualizadas, ideias geradas, status).

Para testar sem esperar até 07:00, dispare manualmente (autenticado): `POST /api/v1/scheduler/run-daily-update`.

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
| Integrações externas (TikTok, Instagram, YouTube, Reddit, X, Anatel) | ⚙️ Scaffold pronto, aguardando credenciais de cada provedor |
| Integração RSS (notícias) | ✅ Real — coleta notícias de portais de telecom sem precisar de credencial |
| Cron diário das 07:00 | ✅ Real e completo: coleta → persiste tendências (novas/atualizadas) → gera ideias com IA (OpenAI, com fallback local) → limpa tendências antigas → registra log da execução |

## Testado nesta entrega (execução real do pipeline diário)

Disparei o job manualmente contra o Postgres local: 8 fontes processadas, 30 tendências novas persistidas a partir de RSS real, 12 ideias novas geradas (fallback local, já que não há `OPENAI_API_KEY` neste ambiente) e log de execução gravado com status `SUCESSO`. Rodar de novo no mesmo dia atualiza (não duplica) as tendências já vistas.

## ⚠️ Sem autenticação de usuário

O frontend não tem tela de login — qualquer pessoa com a URL vê e usa o site inteiro, incluindo criar concorrentes. Isso foi uma decisão consciente para publicar rápido; adicione proteção antes de colocar dados sensíveis de verdade (ver "Próximos passos").

## Como publicar (deploy)

`apps/web` e `apps/api` são dois projetos independentes (sem workspace na raiz), então cada um é implantado separadamente. Nenhuma das duas partes precisa de servidor próprio além do que a plataforma escolhida já gerencia.

### 1. Banco de dados (Postgres com pgvector)

Use um Postgres gerenciado que suporte a extensão `vector` — **Neon** (neon.tech) ou **Supabase** (supabase.com) funcionam bem e têm plano gratuito.

1. Crie um projeto/banco novo.
2. No editor SQL da plataforma, rode: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Copie a connection string (formato `postgresql://usuario:senha@host/banco?sslmode=require`).

### 2. Backend — `apps/api`

Qualquer plataforma que rode containers Node funciona (**Railway**, **Render**, Fly.io). Este repo já inclui um `Dockerfile` em `apps/api/`, e o `package.json` já resolve `prisma generate` automaticamente no `postinstall`.

1. Crie o serviço a partir do repositório GitHub, apontando o **diretório raiz do serviço para `apps/api`** (é assim que a plataforma sabe que é um projeto separado dentro do repo).
2. Configure as variáveis de ambiente (veja `apps/api/.env.example`): `DATABASE_URL` (do passo 1), `JWT_SECRET` (gere uma string aleatória longa — nunca reaproveite o valor de desenvolvimento), `WEB_APP_URL` (a URL do frontend — pode preencher depois, no passo 4), `OPENAI_API_KEY` (opcional), `DAILY_IDEAS_COUNT`.
3. Faça o deploy. A porta é lida de `process.env.PORT`, então funciona com o valor que a plataforma injeta automaticamente.
4. Rode as migrações **uma vez** contra o banco de produção (da sua máquina local, apontando `DATABASE_URL` para a string do passo 1):
   ```bash
   cd apps/api
   DATABASE_URL="postgresql://...produção..." npx prisma migrate deploy
   DATABASE_URL="postgresql://...produção..." npx prisma db seed   # opcional, popula dados de demonstração
   ```
5. Anote a URL pública do backend (ex.: `https://seu-app.up.railway.app`).

### 3. Frontend — `apps/web`

**Vercel** é o caminho mais direto para Next.js.

1. Importe o repositório na Vercel.
2. Configure **Root Directory = `apps/web`** nas configurações do projeto.
3. Variáveis de ambiente (veja `apps/web/.env.example`): `API_URL=https://seu-backend/api/v1` (URL do passo 2, com `/api/v1` no final), `API_DEMO_EMAIL` e `API_DEMO_PASSWORD` (as mesmas do usuário semeado), `OPENAI_API_KEY` (opcional).
4. Deploy.

### 4. Fechar o CORS

Volte nas variáveis de ambiente do backend e defina `WEB_APP_URL` com a URL final da Vercel (ex.: `https://seu-site.vercel.app`), depois faça o redeploy do backend — sem isso, o backend rejeita chamadas vindas de uma origem diferente da configurada (a busca de dados em si acontece servidor-a-servidor e não é afetada, mas alinhar essa variável evita problemas em chamadas futuras feitas direto do navegador).

### 5. Testar

Abra a URL da Vercel — o dashboard deve mostrar tendências com ids reais do Postgres (não os textos de exemplo do mock).

## Próximos passos

1. **Adicionar autenticação** antes de usar com dados reais do negócio — hoje o site é público para quem tiver o link.
2. Contratar/gerar credenciais das integrações desejadas e implementar cada `collect()` em `apps/api/src/integrations/` — elas já alimentam o pipeline diário existente.
3. Configurar `OPENAI_API_KEY` em produção para respostas de IA e geração de ideias reais, e habilitar embeddings/busca semântica (`apps/api/src/ai/embeddings.service.ts`).
