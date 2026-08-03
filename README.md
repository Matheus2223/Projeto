# TikTok Shop Market Analyzer

Site estático (HTML/CSS/JS puro, sem backend) que analisa o mercado do TikTok
Shop: mostra produtos em alta, quais formatos de vídeo mais vendem e engajam
em cada perfil de criador, e gera recomendações de produto + formato de vídeo
por nicho.

## Como rodar

Não há build nem dependências. Basta abrir `index.html` no navegador, ou
servir a pasta com qualquer servidor estático, por exemplo:

```bash
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.

## Estrutura

```
index.html        estrutura das 5 abas (Visão Geral, Produtos, Vídeos,
                   Recomendações, Sobre os Dados)
css/style.css      tema visual (dark, inspirado no TikTok)
js/data.js         dados de demonstração + schema documentado
js/app.js          renderização, filtros, gráficos e gerador de recomendações
```

## Sobre os dados

Todos os produtos, vendas e métricas de engajamento exibidos são **dados de
demonstração**, para mostrar como a ferramenta funciona. O arquivo
`js/data.js` documenta o formato exato esperado (produtos, formatos de vídeo,
perfis de criador) e explica, ao final, como substituí-lo por dados reais:

- **Vendas da própria loja:** TikTok Shop Partner/Seller API.
- **Tendências de mercado:** TikTok Creative Center + ferramentas de
  terceiros como Kalodata, EchoTik ou FastMoss (rankings de produtos e
  vídeos por nicho).
- **Desempenho de vídeos por perfil:** as mesmas ferramentas acima, ou a API
  do TikTok for Business.

Scraping direto do TikTok não é usado nem recomendado, por violar os Termos
de Serviço da plataforma.
