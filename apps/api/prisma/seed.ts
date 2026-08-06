import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import {
  PrismaClient,
  Prisma,
  Platform,
  TrendStatus,
  ContentFormat,
  Difficulty,
  BankCategory,
  PostStatus,
  CalendarStatus,
} from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// --- deterministic PRNG so re-seeding is stable -----------------------------
function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const int = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1));
const float = (min: number, max: number) => Number((min + rand() * (max - min)).toFixed(1));
const pick = <T,>(arr: readonly T[]): T => arr[int(0, arr.length - 1)];
const pickMany = <T,>(arr: readonly T[], n: number): T[] => {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const idx = int(0, pool.length - 1);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
};

// --- vocab -------------------------------------------------------------------
const TOPICS = [
  'fibra óptica', 'Wi-Fi em casa', 'velocidade da internet', 'plano de internet',
  'sinal do roteador', 'internet para streaming', 'internet para home office',
  'internet para jogos online', 'instalação da fibra', 'atendimento ao cliente',
  'suporte técnico', 'internet rural', 'combo internet + TV', 'segurança digital',
  'consumo de dados', 'quedas de conexão', 'upload e download', 'cobertura de rede',
  'internet ilimitada', 'Wi-Fi mesh',
];

const SEGMENTS = [
  'Fibra Óptica Residencial', 'Planos Empresariais', 'Internet Rural', 'Wi-Fi Mesh',
  'Suporte Técnico', 'Planos e Preços', 'Instalação e Ativação', 'Velocidade e Performance',
  'Streaming', 'Home Office', 'Gamers', 'Promoções e Ofertas', 'Combo TV + Internet',
  'Atendimento ao Cliente', 'Sustentabilidade e Rede Verde', 'Segurança Digital',
];

const BR_STATE_CITY: [string, string][] = [
  ['SP', 'São Paulo'], ['RJ', 'Rio de Janeiro'], ['MG', 'Belo Horizonte'], ['PR', 'Curitiba'],
  ['RS', 'Porto Alegre'], ['SC', 'Florianópolis'], ['BA', 'Salvador'], ['PE', 'Recife'],
  ['CE', 'Fortaleza'], ['GO', 'Goiânia'], ['PA', 'Belém'], ['DF', 'Brasília'],
];

const HASHTAGS = [
  '#internet', '#fibraoptica', '#wifi', '#provedor', '#internetrapida', '#conectividade',
  '#homeoffice', '#streaming', '#gamer', '#tecnologia', '#semtravar', '#internetrural',
];

const HOOK_TEMPLATES = [
  'Você está pagando caro por {topic} e nem sabe',
  '3 sinais de que sua {topic} está te prejudicando',
  'O erro que 9 em cada 10 clientes cometem com {topic}',
  'Ninguém te contou isso sobre {topic}',
  'A verdade que pouca gente conta sobre {topic}',
  'Como resolvi {topic} em menos de 5 minutos',
  'O segredo dos técnicos para melhorar {topic}',
  'Isso vai mudar a forma como você vê {topic}',
  'Antes de contratar, veja isso sobre {topic}',
  'O mito sobre {topic} que precisa acabar',
];

const CTA_TEMPLATES = [
  'Peça agora sua avaliação gratuita de {topic}',
  'Fale com um consultor sobre {topic}',
  'Clique no link da bio e contrate hoje',
  'Chama no WhatsApp e garanta seu desconto',
  'Deixe seu CEP nos comentários',
  'Agende sua instalação gratuita ainda essa semana',
  'Peça um teste de velocidade sem compromisso',
];

const HEADLINE_TEMPLATES = [
  '{n} motivos para ter {topic} na sua casa',
  'Chega de internet lenta: conheça {topic}',
  'A internet que sua casa merece',
  '{n} sinais de que está na hora de trocar de provedor',
  'Internet estável mesmo em dias de chuva',
  'O plano perfeito para {topic} existe, e é aqui',
];

const QUESTION_TEMPLATES = [
  'Minha internet cai toda noite, o que pode ser?',
  'Qual a diferença entre fibra óptica e internet via rádio?',
  'Quanto tempo demora a instalação de {topic}?',
  'Por que minha velocidade contratada não bate no teste?',
  'Tem multa se eu cancelar antes do prazo?',
  'Como faço para aumentar a cobertura de {topic} em casa?',
];

const OBJECTION_TEMPLATES = [
  'Já tenho contrato com outro provedor',
  'Acho o valor muito caro',
  'Minha região não tem cobertura ainda',
  'Já tentei trocar antes e não funcionou',
  'Prefiro esperar uma promoção melhor',
  'Não quero pagar multa de fidelidade',
];

const IDEA_TEMPLATES = [
  'Antes e depois: {topic} com e sem fibra óptica',
  'Cliente reagindo ao ver a velocidade real de {topic}',
  'Técnico explica {topic} em 60 segundos',
  'Bastidores da instalação de {topic}',
  'Comparativo real entre planos de {topic}',
  'Mitos e verdades sobre {topic}',
];

const NUMBERS = ['3', '5', '7', '10'];
const fill = (t: string) => t.replace('{topic}', pick(TOPICS)).replace('{n}', pick(NUMBERS));

const PLATFORMS = Object.values(Platform);
const FORMAT_COUNT: Record<ContentFormat, number> = {
  REELS: 30, STORIES: 30, CARROSSEL: 20, POST_UNICO: 20, CAMPANHA: 15, ANUNCIO: 15,
  VIDEO_ENGRACADO: 10, VIDEO_EMOCIONANTE: 10, VIDEO_EDUCATIVO: 10, VIDEO_COMERCIAL: 10,
};
const FORMAT_TIME: Record<ContentFormat, string> = {
  REELS: '15-30s', STORIES: '10-15s', CARROSSEL: '5-8 slides', POST_UNICO: '1 imagem',
  CAMPANHA: 'multi-formato', ANUNCIO: '15-20s', VIDEO_ENGRACADO: '20-40s',
  VIDEO_EMOCIONANTE: '30-60s', VIDEO_EDUCATIVO: '45-90s', VIDEO_COMERCIAL: '20-30s',
};
const EQUIPMENT = ['Smartphone', 'Tripé', 'Microfone de lapela', 'Ring light', 'Estabilizador (gimbal)', 'Notebook para edição'];
const OBJECTIVES = [
  'Gerar novos leads', 'Aumentar reconhecimento de marca', 'Educar sobre planos e velocidade',
  'Reduzir churn / cancelamentos', 'Fortalecer atendimento e suporte', 'Divulgar promoção',
  'Aumentar engajamento', 'Fidelizar clientes atuais',
];
const GRADIENTS = [
  'from-violet-500 to-indigo-500',
  'from-cyan-400 to-blue-500',
  'from-fuchsia-500 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-red-500',
  'from-sky-400 to-indigo-500',
  'from-purple-500 to-fuchsia-500',
];
const TREND_STATUSES: TrendStatus[] = ['CRESCENDO', 'EXPLODINDO', 'VIRAL', 'CAINDO', 'OPORTUNIDADE', 'SATURADO'];
const DIFFICULTIES: Difficulty[] = ['FACIL', 'MEDIO', 'DIFICIL'];
const POST_STATUSES: PostStatus[] = ['RASCUNHO', 'AGENDADO', 'PUBLICADO'];

async function seedUser() {
  const passwordHash = await bcrypt.hash('trendhub123', 10);
  return prisma.user.upsert({
    where: { email: 'equipe@provedor.com.br' },
    update: {},
    create: { email: 'equipe@provedor.com.br', name: 'Equipe Social Media', passwordHash },
  });
}

async function seedTrends(count: number) {
  const data = Array.from({ length: count }).map(() => {
    const [state, city] = pick(BR_STATE_CITY);
    const topic = pick(TOPICS);
    return {
      title: `Trend sobre ${topic} bombando`,
      summary: `A IA identificou crescimento consistente em conteúdos sobre ${topic}.`,
      platform: pick(PLATFORMS),
      segment: pick(SEGMENTS),
      status: pick(TREND_STATUSES),
      growthIndex: int(20, 99),
      velocity: float(-8, 42),
      origin: 'Alta viralização detectada automaticamente',
      aiConfidence: int(60, 98),
      postSuggestion: `Grave um Reels de até 30s mostrando ${topic} na prática.`,
      state,
      city,
      hashtags: pickMany(HASHTAGS, int(3, 6)),
      views: int(1200, 890000),
      engagementRate: float(1.2, 14.8),
    };
  });
  await prisma.trend.createMany({ data });
}

async function seedIdeas() {
  const rows: Prisma.ContentIdeaCreateManyInput[] = [];
  for (const format of Object.keys(FORMAT_COUNT) as ContentFormat[]) {
    for (let i = 0; i < FORMAT_COUNT[format]; i++) {
      const topic = pick(TOPICS);
      const hookText = fill(pick(HOOK_TEMPLATES));
      const ctaText = fill(pick(CTA_TEMPLATES));
      rows.push({
        format,
        title: `${format}: ${hookText}`,
        hook: hookText,
        script: [
          `Abertura (0-3s): ${hookText}.`,
          `Contexto (3-8s): mostre o problema real com ${topic}.`,
          `Demonstração (8-18s): grave a solução em ação.`,
          `Fechamento (24-30s): ${ctaText}.`,
        ],
        estimatedTime: FORMAT_TIME[format],
        cta: ctaText,
        caption: `${hookText} 👇 ${ctaText}`,
        hashtags: pickMany(HASHTAGS, int(4, 7)),
        objective: pick(OBJECTIVES),
        difficulty: pick(DIFFICULTIES),
        recordingTime: `${int(5, 45)} min`,
        equipment: pickMany(EQUIPMENT, int(2, 4)),
        aiPrompt: `Crie um roteiro de ${format.toLowerCase()} para provedor de internet sobre "${topic}", finalizando com: "${ctaText}".`,
        platform: pick(PLATFORMS),
        segment: pick(SEGMENTS),
      });
    }
  }
  await prisma.contentIdea.createMany({ data: rows });
}

async function seedBanks(perCategory: number) {
  const categories: [BankCategory, readonly string[]][] = [
    ['HOOK', HOOK_TEMPLATES],
    ['CTA', CTA_TEMPLATES],
    ['HEADLINE', HEADLINE_TEMPLATES],
    ['QUESTION', QUESTION_TEMPLATES],
    ['OBJECTION', OBJECTION_TEMPLATES],
    ['IDEA', IDEA_TEMPLATES],
  ];

  for (const [category, templates] of categories) {
    const rows = Array.from({ length: perCategory }).map((_, i) => ({
      category,
      text: fill(templates[i % templates.length]),
      platform: pick(PLATFORMS),
      segment: pick(SEGMENTS),
      performanceScore: int(38, 99),
      usageCount: int(0, 420),
      tags: pickMany(SEGMENTS, int(1, 2)).map((s) => s.toLowerCase()),
    }));
    await prisma.bankItem.createMany({ data: rows });
  }
}

async function seedPosts(count: number) {
  const now = Date.now();
  const data = Array.from({ length: count }).map(() => {
    const status = pick(POST_STATUSES);
    const hookText = fill(pick(HOOK_TEMPLATES));
    const offsetDays = status === 'PUBLICADO' ? -int(0, 20) : int(0, 20);
    return {
      title: hookText,
      format: pick(Object.keys(FORMAT_COUNT) as ContentFormat[]),
      platform: pick(PLATFORMS),
      segment: pick(SEGMENTS),
      caption: `${hookText} ${fill(pick(CTA_TEMPLATES))}`,
      hashtags: pickMany(HASHTAGS, int(3, 6)),
      status,
      scheduledAt: new Date(now + offsetDays * 86_400_000),
      publishedAt: status === 'PUBLICADO' ? new Date(now + offsetDays * 86_400_000) : null,
      gradient: pick(GRADIENTS),
      viewsCount: int(300, 420000),
      likesCount: int(20, 38000),
      commentsCount: int(0, 1800),
      sharesCount: int(0, 3200),
    };
  });
  await prisma.post.createMany({ data });
}

async function seedCompetitors() {
  const names = ['NetVelox Telecom', 'ConectaMais Fibra', 'TurboLink Internet', 'OndaViva Telecom', 'FibraSul Conecta', 'RedeExpressa ISP', 'NexoNet Provedor', 'InfinitaBanda'];
  const palettes = [['#7C3AED', '#22D3EE', '#111827'], ['#F97316', '#111827', '#FFFFFF'], ['#059669', '#0EA5E9', '#F8FAFC']];
  const data = names.map((name) => ({
    name,
    handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
    platforms: pickMany(PLATFORMS, int(2, 4)),
    segment: pick(SEGMENTS),
    followers: int(2500, 480000),
    postFrequencyPerWeek: int(2, 14),
    avgEngagementRate: float(0.8, 9.5),
    colorPalette: pick(palettes),
    visualStyle: 'Corporativo, tons sóbrios e muito uso de dados/gráficos',
    strengths: ['Alta frequência de postagem', 'Boa resposta a comentários'],
    weaknesses: ['Pouca variedade de formatos', 'Legendas genéricas'],
    whatToCopy: ['Frequência alta de Reels curtos', 'CTA claro em todos os vídeos'],
    whatToAvoid: ['Excesso de promoção sem contexto', 'Vídeos longos sem gancho'],
    opportunities: ['Explorar conteúdo educativo', 'Investir em humor'],
  }));
  await prisma.competitor.createMany({ data });
}

async function seedCalendar() {
  const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const TIMES = ['08:00', '12:30', '15:00', '18:00', '19:30', '21:00'];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const data = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(start.getTime() + i * 86_400_000);
    const topic = pick(TOPICS);
    const hook = fill(pick(HOOK_TEMPLATES));
    const cta = fill(pick(CTA_TEMPLATES));
    const status: CalendarStatus = i < 2 ? 'PUBLICADO' : i < 5 ? 'PRODUZIDO' : 'PLANEJADO';
    return {
      date,
      weekday: WEEKDAYS[date.getDay()],
      theme: `${topic[0].toUpperCase()}${topic.slice(1)}`,
      objective: pick(OBJECTIVES),
      format: pick(Object.keys(FORMAT_COUNT) as ContentFormat[]),
      platform: pick(PLATFORMS),
      script: hook,
      caption: `${hook} ${cta}`,
      cta,
      suggestedTime: pick(TIMES),
      status,
    };
  });

  for (const entry of data) {
    await prisma.calendarEntry.upsert({ where: { date: entry.date }, update: entry, create: entry });
  }
}

async function seedNews(count: number) {
  const sources = ['TeleSíntese', 'Convergência Digital', 'TudoCelular', 'Anatel Notícias', 'Portal Telecom', 'TechTudo'];
  const categories = ['Regulação', 'Mercado', 'Tecnologia', 'Consumo', 'Infraestrutura'];
  const titleTemplates = [
    'Anatel divulga novos dados sobre {topic} no Brasil',
    'Brasileiros consomem mais {topic} durante a alta temporada',
    'Provedores regionais investem em {topic}',
    'Pesquisa aponta crescimento de reclamações sobre {topic}',
    'Nova tecnologia promete revolucionar {topic}',
  ];
  const now = Date.now();
  const data = Array.from({ length: count }).map(() => {
    const topic = pick(TOPICS);
    return {
      title: fill(pick(titleTemplates)),
      source: pick(sources),
      category: pick(categories),
      publishedAt: new Date(now - int(0, 72) * 3_600_000),
      summary: `Levantamento mostra impacto direto no setor de provedores de internet, com oportunidades para conteúdo sobre ${topic}.`,
      relevanceScore: int(40, 99),
      url: '#',
    };
  });
  await prisma.newsItem.createMany({ data });
}

async function seedDailyReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const opportunities = Array.from({ length: 4 }).map(() => {
    const topic = pick(TOPICS);
    return { title: `Oportunidade em ${topic}`, description: `Buscas sobre ${topic} cresceram sem saturação de conteúdo.`, score: int(65, 97) };
  });
  const threats = Array.from({ length: 3 }).map(() => {
    const topic = pick(TOPICS);
    return { title: `Saturação em ${topic}`, description: `Concorrentes já publicaram muito sobre ${topic} esta semana.`, severity: pick(['baixa', 'média', 'alta']) };
  });

  await prisma.dailyReport.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      opportunities,
      threats,
      hotTopics: pickMany(TOPICS, 6),
      saturatedTopics: pickMany(TOPICS, 4),
      tomorrowForecast: 'A IA projeta aumento de interesse em conteúdos sobre internet para home office e streaming.',
      weekForecast: 'Semana favorável para campanhas de fibra óptica residencial e combos com TV.',
      viralProbability: int(48, 92),
      opportunityScore: int(60, 95),
    },
  });
}

async function main() {
  console.log('Seeding TrendHub ISP AI database...');
  await seedUser();
  await seedTrends(140);
  await seedIdeas();
  await seedBanks(200);
  await seedPosts(160);
  await seedCompetitors();
  await seedCalendar();
  await seedNews(60);
  await seedDailyReport();
  console.log('Seed completed.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
