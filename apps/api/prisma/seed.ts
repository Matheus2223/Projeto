import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('trendhub123', 10);
  await prisma.user.upsert({
    where: { email: 'equipe@provedor.com.br' },
    update: {},
    create: { email: 'equipe@provedor.com.br', name: 'Equipe Social Media', passwordHash },
  });

  await prisma.trend.createMany({
    data: [
      {
        title: 'Carrossel educativo sobre fibra óptica salvando muito',
        summary: 'Crescimento consistente de conteúdos educativos sobre fibra óptica.',
        platform: 'TIKTOK',
        segment: 'Fibra Óptica Residencial',
        status: 'VIRAL',
        growthIndex: 96,
        velocity: 24.5,
        origin: 'Alta viralização detectada no TikTok',
        aiConfidence: 92,
        postSuggestion: 'Grave um Reels de até 30s comparando velocidade antes/depois da fibra.',
        state: 'SP',
        city: 'São Paulo',
        hashtags: ['#fibraoptica', '#internet', '#wifi'],
        views: 785100,
        engagementRate: 10.7,
      },
      {
        title: 'Desafio de 24h sem cobertura de rede',
        summary: 'Formato de desafio gerando alto engajamento sobre cobertura de sinal.',
        platform: 'YOUTUBE_SHORTS',
        segment: 'Velocidade e Performance',
        status: 'EXPLODINDO',
        growthIndex: 88,
        velocity: 31.2,
        origin: 'Crescimento orgânico no Instagram Reels',
        aiConfidence: 87,
        postSuggestion: 'Faça um vídeo mostrando a diferença de sinal em diferentes cômodos.',
        state: 'PR',
        city: 'Curitiba',
        hashtags: ['#internetrapida', '#conectividade'],
        views: 452300,
        engagementRate: 8.1,
      },
    ],
  });

  await prisma.bankItem.createMany({
    data: [
      { category: 'HOOK', text: 'Você está pagando caro por fibra óptica e nem sabe', platform: 'INSTAGRAM', segment: 'Planos e Preços', performanceScore: 92, usageCount: 340, tags: ['planos'] },
      { category: 'CTA', text: 'Peça agora sua avaliação gratuita de sinal', platform: 'TIKTOK', segment: 'Suporte Técnico', performanceScore: 88, usageCount: 210, tags: ['suporte'] },
      { category: 'HEADLINE', text: 'Chega de internet lenta: conheça a fibra óptica', platform: 'FACEBOOK', segment: 'Fibra Óptica Residencial', performanceScore: 85, usageCount: 150, tags: ['fibra'] },
    ],
  });

  await prisma.competitor.createMany({
    data: [
      {
        name: 'NetVelox Telecom',
        handle: '@netveloxtelecom',
        platforms: ['INSTAGRAM', 'TIKTOK'],
        segment: 'Combo TV + Internet',
        followers: 42000,
        postFrequencyPerWeek: 6,
        avgEngagementRate: 5.4,
        colorPalette: ['#7C3AED', '#22D3EE', '#111827'],
        visualStyle: 'Minimalista com tipografia bold e cores vibrantes',
        strengths: ['Alta frequência de postagem'],
        weaknesses: ['Pouca variedade de formatos'],
        whatToCopy: ['CTA claro em todos os vídeos'],
        whatToAvoid: ['Excesso de promoção sem contexto'],
        opportunities: ['Explorar conteúdo educativo'],
      },
    ],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.dailyReport.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      opportunities: [{ title: 'Oportunidade em fibra óptica', description: 'Baixa saturação de conteúdo.', score: 91 }],
      threats: [{ title: 'Saturação em Wi-Fi mesh', description: 'Concorrentes publicaram muito esta semana.', severity: 'alta' }],
      hotTopics: ['fibra óptica', 'Wi-Fi mesh', 'internet rural'],
      saturatedTopics: ['roteador antigo'],
      tomorrowForecast: 'Aumento de interesse em internet para home office.',
      weekForecast: 'Semana favorável para campanhas de fibra óptica residencial.',
      viralProbability: 78,
      opportunityScore: 84,
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
