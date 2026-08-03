/**
 * DADOS DE DEMONSTRAÇÃO (MOCK DATA)
 * ==================================
 * Este arquivo simula o que viria de uma API real de analytics do TikTok Shop.
 * Toda a estrutura foi pensada para ser substituída, sem mudar o resto do app,
 * por chamadas reais a:
 *   - TikTok Shop Partner / Seller API (dados de vendas da própria loja)
 *   - TikTok Creative Center (tendências de anúncios e criativos, público)
 *   - Ferramentas de terceiros: Kalodata, EchoTik, FastMoss, Sellersprite
 *     (essas plataformas já vendem acesso a rankings de produtos/vídeos)
 *
 * Basta criar funções como `fetchTrendingProducts()` que retornem objetos
 * no mesmo formato usado aqui, e trocar as constantes abaixo por chamadas
 * assíncronas (ver comentário no final do arquivo).
 */

const NICHES = [
  "Beleza & Skincare",
  "Casa & Cozinha",
  "Moda & Acessórios",
  "Eletrônicos & Gadgets",
  "Fitness & Saúde",
  "Pet",
];

/**
 * @typedef Product
 * @property {string} id
 * @property {string} name
 * @property {string} niche
 * @property {number} avgPriceBRL
 * @property {number} unitsSoldEstimate   - últimos 30 dias
 * @property {number} growthPercent       - variação vs. 30 dias anteriores
 * @property {"Baixa"|"Média"|"Alta"} competitionLevel
 * @property {string} whyTrending         - explicação curta do porquê está em alta
 * @property {string[]} bestVideoFormats  - ids de VIDEO_FORMATS
 */
const PRODUCTS = [
  { id: "p1", name: "Sérum Facial de Niacinamida", niche: "Beleza & Skincare", avgPriceBRL: 39.9, unitsSoldEstimate: 18400, growthPercent: 62, competitionLevel: "Alta", whyTrending: "Rotina 'skinimalism' viralizou; resultado visível em vídeos antes/depois.", bestVideoFormats: ["antes-depois", "review-sincero"] },
  { id: "p2", name: "Escova Alisadora Iônica", niche: "Beleza & Skincare", avgPriceBRL: 89.9, unitsSoldEstimate: 9200, growthPercent: 41, competitionLevel: "Média", whyTrending: "Demonstração em tempo real gera alto tempo de retenção.", bestVideoFormats: ["antes-depois", "tutorial"] },
  { id: "p3", name: "Organizador de Especiarias Giratório", niche: "Casa & Cozinha", avgPriceBRL: 59.9, unitsSoldEstimate: 7600, growthPercent: 35, competitionLevel: "Baixa", whyTrending: "Estética 'satisfying' de organização combina com formato ASMR.", bestVideoFormats: ["satisfatorio-asmr", "tour-produto"] },
  { id: "p4", name: "Faca de Chef Damasco", niche: "Casa & Cozinha", avgPriceBRL: 129.9, unitsSoldEstimate: 5100, growthPercent: 28, competitionLevel: "Média", whyTrending: "Testes de corte ('cutting test') geram compartilhamento alto.", bestVideoFormats: ["review-sincero", "satisfatorio-asmr"] },
  { id: "p5", name: "Mini Prensa de Waffle Portátil", niche: "Casa & Cozinha", avgPriceBRL: 74.9, unitsSoldEstimate: 6800, growthPercent: 53, competitionLevel: "Baixa", whyTrending: "Receitas rápidas em vídeos de 15s com CTA de compra direta.", bestVideoFormats: ["tutorial", "satisfatorio-asmr"] },
  { id: "p6", name: "Bolsa Transversal Couro Sintético", niche: "Moda & Acessórios", avgPriceBRL: 99.9, unitsSoldEstimate: 4300, growthPercent: 19, competitionLevel: "Alta", whyTrending: "Haul de looks com múltiplas combinações por vídeo.", bestVideoFormats: ["haul-lookbook", "tour-produto"] },
  { id: "p7", name: "Óculos de Sol Polarizado Retrô", niche: "Moda & Acessórios", avgPriceBRL: 49.9, unitsSoldEstimate: 8700, growthPercent: 47, competitionLevel: "Média", whyTrending: "Try-on em transições rápidas com áudio em alta.", bestVideoFormats: ["haul-lookbook", "antes-depois"] },
  { id: "p8", name: "Fone de Ouvido TWS com Cancelamento", niche: "Eletrônicos & Gadgets", avgPriceBRL: 149.9, unitsSoldEstimate: 12100, growthPercent: 33, competitionLevel: "Alta", whyTrending: "Comparativo de custo-benefício contra marcas premium.", bestVideoFormats: ["comparativo", "review-sincero"] },
  { id: "p9", name: "Mini Projetor Portátil", niche: "Eletrônicos & Gadgets", avgPriceBRL: 219.9, unitsSoldEstimate: 3900, growthPercent: 58, competitionLevel: "Baixa", whyTrending: "Setup 'quarto aconchegante' é tendência de lifestyle.", bestVideoFormats: ["tour-produto", "review-sincero"] },
  { id: "p10", name: "Garrafa Térmica Motivacional 2L", niche: "Fitness & Saúde", avgPriceBRL: 44.9, unitsSoldEstimate: 15300, growthPercent: 39, competitionLevel: "Média", whyTrending: "Desafio de hidratação diária (#watertok) impulsiona vendas.", bestVideoFormats: ["desafio-trend", "tutorial"] },
  { id: "p11", name: "Faixa Elástica de Resistência Kit", niche: "Fitness & Saúde", avgPriceBRL: 54.9, unitsSoldEstimate: 6200, growthPercent: 44, competitionLevel: "Baixa", whyTrending: "Treinos de 30s encaixam no formato de vídeo curto.", bestVideoFormats: ["tutorial", "desafio-trend"] },
  { id: "p12", name: "Cama Pet Ortopédica", niche: "Pet", avgPriceBRL: 119.9, unitsSoldEstimate: 4700, growthPercent: 66, competitionLevel: "Baixa", whyTrending: "Vídeos de reação do pet têm altíssimo engajamento emocional.", bestVideoFormats: ["reacao-pet", "antes-depois"] },
  { id: "p13", name: "Fonte de Água Automática para Pet", niche: "Pet", avgPriceBRL: 89.9, unitsSoldEstimate: 5400, growthPercent: 37, competitionLevel: "Média", whyTrending: "Formato satisfatório com som de água relaxante.", bestVideoFormats: ["satisfatorio-asmr", "reacao-pet"] },
];

/**
 * @typedef VideoFormat
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} avgEngagementRate  - % (curtidas+comentários+compart.) / views
 * @property {number} avgViews
 * @property {string[]} bestFor          - nomes de NICHES
 * @property {string} exampleHook        - gancho de abertura sugerido (primeiros 3s)
 */
const VIDEO_FORMATS = [
  { id: "antes-depois", name: "Antes e Depois", description: "Mostra a transformação/resultado do produto em uso.", avgEngagementRate: 9.8, avgViews: 184000, bestFor: ["Beleza & Skincare", "Moda & Acessórios", "Pet"], exampleHook: "Ninguém vai acreditar no que aconteceu depois de 7 dias usando isso..." },
  { id: "review-sincero", name: "Review Sincero", description: "Opinião direta, pontos positivos e negativos, sem filtro.", avgEngagementRate: 7.4, avgViews: 121000, bestFor: ["Eletrônicos & Gadgets", "Casa & Cozinha", "Beleza & Skincare"], exampleHook: "Comprei esse produto viral pra ver se vale o hype (verdade sem edição)." },
  { id: "satisfatorio-asmr", name: "Satisfatório / ASMR", description: "Foco em som e estética visual relaxante do produto em uso.", avgEngagementRate: 11.2, avgViews: 256000, bestFor: ["Casa & Cozinha", "Pet"], exampleHook: "Só assista até o final... esse som é viciante." },
  { id: "tutorial", name: "Tutorial Rápido", description: "Passo a passo objetivo de como usar o produto em até 30s.", avgEngagementRate: 8.1, avgViews: 143000, bestFor: ["Fitness & Saúde", "Casa & Cozinha", "Beleza & Skincare"], exampleHook: "3 passos pra resolver [problema] em menos de 1 minuto." },
  { id: "comparativo", name: "Comparativo", description: "Compara o produto com uma alternativa cara/conhecida.", avgEngagementRate: 8.6, avgViews: 168000, bestFor: ["Eletrônicos & Gadgets"], exampleHook: "Gastei R$50 vs R$500: qual entrega mais?" },
  { id: "tour-produto", name: "Tour do Produto", description: "Unboxing + apresentação de todos os recursos/detalhes.", avgEngagementRate: 6.9, avgViews: 98000, bestFor: ["Eletrônicos & Gadgets", "Casa & Cozinha", "Moda & Acessórios"], exampleHook: "Chegou o pacote misterioso mais pedido dos comentários..." },
  { id: "desafio-trend", name: "Desafio / Trend", description: "Usa um áudio ou desafio em alta encaixando o produto na narrativa.", avgEngagementRate: 10.4, avgViews: 231000, bestFor: ["Fitness & Saúde"], exampleHook: "Topei o desafio de 30 dias e o resultado surpreendeu até eu." },
  { id: "haul-lookbook", name: "Haul / Lookbook", description: "Sequência rápida de combinações/looks usando o produto.", avgEngagementRate: 7.9, avgViews: 137000, bestFor: ["Moda & Acessórios"], exampleHook: "5 looks com uma peça só, qual você usaria?" },
  { id: "reacao-pet", name: "Reação do Pet", description: "Foco na reação genuína e emocional do animal ao produto.", avgEngagementRate: 13.1, avgViews: 312000, bestFor: ["Pet"], exampleHook: "A reação dele quando viu a cama nova... 🥺" },
];

/**
 * @typedef VideoResult
 * @property {string} title
 * @property {string} formatId  - id de VIDEO_FORMATS
 * @property {number} views
 * @property {number} likes
 * @property {number} comments
 * @property {number} shares
 * @property {number} engagementRate - %
 *
 * @typedef CreatorProfile
 * @property {string} id
 * @property {string} name
 * @property {string} niche
 * @property {number} followers
 * @property {VideoResult[]} videos
 */
const CREATOR_PROFILES = [
  {
    id: "c1", name: "@bela.rotina", niche: "Beleza & Skincare", followers: 184000,
    videos: [
      { title: "Rotina de skincare que sumiu com minhas olheiras", formatId: "antes-depois", views: 412000, likes: 51000, comments: 2200, shares: 8700, engagementRate: 14.9 },
      { title: "Review sincero: sérum viral do TikTok vale a pena?", formatId: "review-sincero", views: 96000, likes: 6100, comments: 480, shares: 900, engagementRate: 7.8 },
      { title: "Tutorial: como aplicar niacinamida certo", formatId: "tutorial", views: 71000, likes: 4200, comments: 210, shares: 320, engagementRate: 6.6 },
    ],
  },
  {
    id: "c2", name: "@casa.pratica", niche: "Casa & Cozinha", followers: 96000,
    videos: [
      { title: "Organizando meu armário de temperos (satisfatório)", formatId: "satisfatorio-asmr", views: 289000, likes: 39000, comments: 1100, shares: 6400, engagementRate: 16.2 },
      { title: "Testando a faca que corta tomate no ar", formatId: "review-sincero", views: 58000, likes: 3600, comments: 190, shares: 410, engagementRate: 7.2 },
      { title: "Waffle em 3 minutos pro café da manhã", formatId: "tutorial", views: 133000, likes: 11800, comments: 540, shares: 1900, engagementRate: 10.7 },
    ],
  },
  {
    id: "c3", name: "@tech.bolso", niche: "Eletrônicos & Gadgets", followers: 251000,
    videos: [
      { title: "Fone de R$150 vs fone de R$1200: dá pra sentir diferença?", formatId: "comparativo", views: 502000, likes: 44000, comments: 3100, shares: 5200, engagementRate: 10.4 },
      { title: "Unboxing do mini projetor mais vendido do momento", formatId: "tour-produto", views: 118000, likes: 7200, comments: 310, shares: 640, engagementRate: 6.9 },
      { title: "Review sincero depois de 30 dias de uso", formatId: "review-sincero", views: 87000, likes: 5100, comments: 260, shares: 380, engagementRate: 6.6 },
    ],
  },
  {
    id: "c4", name: "@fit.emcasa", niche: "Fitness & Saúde", followers: 143000,
    videos: [
      { title: "Desafio de 30 dias com faixa elástica (resultado real)", formatId: "desafio-trend", views: 378000, likes: 41000, comments: 1800, shares: 7100, engagementRate: 13.0 },
      { title: "3 exercícios rápidos pra fazer no trabalho", formatId: "tutorial", views: 142000, likes: 12300, comments: 610, shares: 2000, engagementRate: 10.5 },
      { title: "Minha garrafa motivacional mudou meu hábito de beber água", formatId: "desafio-trend", views: 205000, likes: 19800, comments: 890, shares: 3300, engagementRate: 11.7 },
    ],
  },
  {
    id: "c5", name: "@petlover.br", niche: "Pet", followers: 312000,
    videos: [
      { title: "Reação dele vendo a cama ortopédica nova pela primeira vez", formatId: "reacao-pet", views: 890000, likes: 132000, comments: 5400, shares: 21000, engagementRate: 17.9 },
      { title: "Fonte de água automática: ele aprovou?", formatId: "satisfatorio-asmr", views: 264000, likes: 29000, comments: 1300, shares: 4900, engagementRate: 13.3 },
      { title: "Antes e depois: cama velha vs cama nova", formatId: "antes-depois", views: 198000, likes: 22000, comments: 950, shares: 3600, engagementRate: 13.4 },
    ],
  },
  {
    id: "c6", name: "@estilo.dia", niche: "Moda & Acessórios", followers: 122000,
    videos: [
      { title: "5 looks com uma bolsa só", formatId: "haul-lookbook", views: 176000, likes: 15200, comments: 640, shares: 2100, engagementRate: 10.2 },
      { title: "Try-on de óculos retrô que estão em alta", formatId: "haul-lookbook", views: 143000, likes: 11900, comments: 480, shares: 1600, engagementRate: 9.8 },
      { title: "Tour: tudo que cabe na minha bolsa transversal", formatId: "tour-produto", views: 64000, likes: 3800, comments: 170, shares: 260, engagementRate: 6.6 },
    ],
  },
];

/* ------------------------------------------------------------------------
 * COMO SUBSTITUIR POR DADOS REAIS
 * ------------------------------------------------------------------------
 * 1. Crie um backend (Node/Python) que consulte a TikTok Shop Partner API
 *    (vendas/estoque da sua loja) e/ou a API de uma ferramenta de terceiros
 *    (Kalodata, EchoTik, FastMoss) para rankings de produtos e vídeos.
 * 2. Exponha endpoints REST, ex: GET /api/products, GET /api/video-formats,
 *    GET /api/creators, retornando JSON no mesmo formato usado acima.
 * 3. Neste arquivo, troque as constantes por funções assíncronas, ex:
 *
 *    async function fetchProducts() {
 *      const res = await fetch("/api/products");
 *      return res.json();
 *    }
 *
 * 4. Em js/app.js, troque as referências diretas a PRODUCTS/VIDEO_FORMATS/
 *    CREATOR_PROFILES pelas chamadas assíncronas (await fetchProducts()...).
 * ------------------------------------------------------------------------ */
