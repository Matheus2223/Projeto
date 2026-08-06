export type Platform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "youtube_shorts"
  | "threads"
  | "google_trends"
  | "google_news"
  | "reddit"
  | "x"
  | "pinterest"
  | "linkedin"
  | "blog"
  | "anatel";

export const PLATFORM_META: Record<
  Platform,
  { label: string; color: string; gradient: string }
> = {
  instagram: { label: "Instagram", color: "#E1306C", gradient: "from-fuchsia-500 to-orange-400" },
  tiktok: { label: "TikTok", color: "#25F4EE", gradient: "from-cyan-400 to-fuchsia-500" },
  facebook: { label: "Facebook", color: "#1877F2", gradient: "from-blue-500 to-blue-700" },
  youtube_shorts: { label: "YouTube Shorts", color: "#FF0000", gradient: "from-red-500 to-red-700" },
  threads: { label: "Threads", color: "#000000", gradient: "from-neutral-700 to-neutral-950" },
  google_trends: { label: "Google Trends", color: "#4285F4", gradient: "from-blue-400 to-emerald-400" },
  google_news: { label: "Google Notícias", color: "#EA4335", gradient: "from-red-400 to-amber-400" },
  reddit: { label: "Reddit", color: "#FF4500", gradient: "from-orange-500 to-red-600" },
  x: { label: "X", color: "#000000", gradient: "from-neutral-800 to-black" },
  pinterest: { label: "Pinterest", color: "#E60023", gradient: "from-rose-500 to-red-600" },
  linkedin: { label: "LinkedIn", color: "#0A66C2", gradient: "from-sky-500 to-blue-700" },
  blog: { label: "Blogs & Portais", color: "#8B5CF6", gradient: "from-violet-500 to-purple-700" },
  anatel: { label: "Anatel", color: "#059669", gradient: "from-emerald-500 to-teal-700" },
};

export const PLATFORMS: Platform[] = Object.keys(PLATFORM_META) as Platform[];

export type TrendStatus =
  | "crescendo"
  | "explodindo"
  | "viral"
  | "caindo"
  | "oportunidade"
  | "saturado";

export const TREND_STATUS_META: Record<
  TrendStatus,
  { label: string; emoji: string; className: string }
> = {
  crescendo: { label: "Crescendo", emoji: "🔥", className: "bg-warning/15 text-warning border-warning/30" },
  explodindo: { label: "Explodindo", emoji: "📈", className: "bg-danger/15 text-danger border-danger/30" },
  viral: { label: "Viral", emoji: "⚡", className: "bg-primary/15 text-primary border-primary/30" },
  caindo: { label: "Caindo", emoji: "📉", className: "bg-muted text-muted-foreground border-border" },
  oportunidade: { label: "Oportunidade", emoji: "🟢", className: "bg-success/15 text-success border-success/30" },
  saturado: { label: "Saturado", emoji: "🔴", className: "bg-danger/10 text-danger border-danger/20" },
};

export const SEGMENTS = [
  "Fibra Óptica Residencial",
  "Planos Empresariais",
  "Internet Rural",
  "Wi-Fi Mesh",
  "Suporte Técnico",
  "Planos e Preços",
  "Instalação e Ativação",
  "Velocidade e Performance",
  "Streaming",
  "Home Office",
  "Gamers",
  "Promoções e Ofertas",
  "Combo TV + Internet",
  "Atendimento ao Cliente",
  "Sustentabilidade e Rede Verde",
  "Segurança Digital",
] as const;
export type Segment = (typeof SEGMENTS)[number];

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const BR_CITIES: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Sorocaba", "Ribeirão Preto", "São José dos Campos"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Campos dos Goytacazes"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Montes Claros"],
  PR: ["Curitiba", "Londrina", "Maringá", "Cascavel"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Santa Maria"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Chapecó"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  PE: ["Recife", "Caruaru", "Petrolina"],
  CE: ["Fortaleza", "Juazeiro do Norte", "Sobral"],
  GO: ["Goiânia", "Anápolis", "Rio Verde"],
  PA: ["Belém", "Marabá", "Santarém"],
  DF: ["Brasília"],
  MT: ["Cuiabá", "Rondonópolis"],
  MS: ["Campo Grande", "Dourados"],
  ES: ["Vitória", "Vila Velha", "Serra"],
  AM: ["Manaus", "Parintins"],
};

export const CONTENT_FORMATS = [
  "Reels",
  "Stories",
  "Carrossel",
  "Post único",
  "Campanha",
  "Anúncio",
  "Vídeo engraçado",
  "Vídeo emocionante",
  "Vídeo educativo",
  "Vídeo comercial",
] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export const DIFFICULTY = ["Fácil", "Médio", "Difícil"] as const;
export type Difficulty = (typeof DIFFICULTY)[number];

export const EQUIPMENT_POOL = [
  "Smartphone",
  "Tripé",
  "Microfone de lapela",
  "Ring light",
  "Estabilizador (gimbal)",
  "Drone",
  "Câmera DSLR",
  "Iluminação softbox",
  "Notebook para edição",
  "Green screen",
];

export const OBJECTIVES = [
  "Gerar novos leads",
  "Aumentar reconhecimento de marca",
  "Educar sobre planos e velocidade",
  "Reduzir churn / cancelamentos",
  "Fortalecer atendimento e suporte",
  "Divulgar promoção",
  "Aumentar engajamento",
  "Posicionar como autoridade em conectividade",
  "Atrair público jovem/gamer",
  "Fidelizar clientes atuais",
] as const;
