// Shared vocabulary for content the platform generates at *runtime* (the
// daily scheduler, the AI fallback generator). Uses Math.random on purpose —
// unlike apps/web's seeded mock generators (which need reproducibility for
// hydration), this content should genuinely vary from one real day to the
// next.

export const TOPICS = [
  'fibra óptica',
  'Wi-Fi em casa',
  'velocidade da internet',
  'plano de internet',
  'sinal do roteador',
  'internet para streaming',
  'internet para home office',
  'internet para jogos online',
  'instalação da fibra',
  'atendimento ao cliente',
  'suporte técnico',
  'internet rural',
  'combo internet + TV',
  'segurança digital em casa',
  'consumo de dados',
  'quedas de conexão',
  'upload e download',
  'cobertura de rede',
  'internet ilimitada',
  'Wi-Fi mesh',
];

export const SEGMENTS = [
  'Fibra Óptica Residencial',
  'Planos Empresariais',
  'Internet Rural',
  'Wi-Fi Mesh',
  'Suporte Técnico',
  'Planos e Preços',
  'Instalação e Ativação',
  'Velocidade e Performance',
  'Streaming',
  'Home Office',
  'Gamers',
  'Promoções e Ofertas',
  'Combo TV + Internet',
  'Atendimento ao Cliente',
  'Sustentabilidade e Rede Verde',
  'Segurança Digital',
];

export const HASHTAGS = [
  '#internet',
  '#fibraoptica',
  '#wifi',
  '#provedor',
  '#internetrapida',
  '#conectividade',
  '#homeoffice',
  '#streaming',
  '#gamer',
  '#tecnologia',
  '#semtravar',
  '#internetrural',
];

export const HOOK_TEMPLATES = [
  'Você está pagando caro por {topic} e nem sabe',
  '3 sinais de que sua {topic} está te prejudicando',
  'O erro que 9 em cada 10 clientes cometem com {topic}',
  'Ninguém te contou isso sobre {topic}',
  'A verdade que pouca gente conta sobre {topic}',
  'Como resolvi {topic} em menos de 5 minutos',
  'O segredo dos técnicos para melhorar {topic}',
  'Isso vai mudar a forma como você vê {topic}',
];

export const CTA_TEMPLATES = [
  'Peça agora sua avaliação gratuita de {topic}',
  'Fale com um consultor sobre {topic}',
  'Clique no link da bio e contrate hoje',
  'Chama no WhatsApp e garanta seu desconto',
  'Agende sua instalação gratuita ainda essa semana',
  'Peça um teste de velocidade sem compromisso',
];

export const OBJECTIVES = [
  'Gerar novos leads',
  'Aumentar reconhecimento de marca',
  'Educar sobre planos e velocidade',
  'Reduzir churn / cancelamentos',
  'Fortalecer atendimento e suporte',
  'Divulgar promoção',
  'Aumentar engajamento',
  'Fidelizar clientes atuais',
];

export const EQUIPMENT = [
  'Smartphone',
  'Tripé',
  'Microfone de lapela',
  'Ring light',
  'Estabilizador (gimbal)',
  'Notebook para edição',
];

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickMany<T>(arr: readonly T[], count: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
}

export function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function fillTemplate(template: string, topic: string): string {
  return template.replace('{topic}', topic);
}
