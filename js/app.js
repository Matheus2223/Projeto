/**
 * Lógica de renderização e interação do dashboard.
 * Depende das constantes NICHES, PRODUCTS, VIDEO_FORMATS e CREATOR_PROFILES
 * definidas em js/data.js.
 */

const fmtInt = (n) => n.toLocaleString("pt-BR");
const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatById = (id) => VIDEO_FORMATS.find((f) => f.id === id);

const competitionClass = { Baixa: "low", Média: "mid", Alta: "high" };

/* ---------------------------- Navegação por abas ---------------------------- */

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
    });
  });
}

/* ------------------------------- Visão Geral -------------------------------- */

function renderKpis() {
  const totalProducts = PRODUCTS.length;
  const avgGrowth = PRODUCTS.reduce((s, p) => s + p.growthPercent, 0) / PRODUCTS.length;
  const totalUnits = PRODUCTS.reduce((s, p) => s + p.unitsSoldEstimate, 0);
  const bestFormat = [...VIDEO_FORMATS].sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)[0];

  const kpis = [
    { label: "Produtos analisados", value: fmtInt(totalProducts), cls: "" },
    { label: "Crescimento médio (30 dias)", value: `+${avgGrowth.toFixed(0)}%`, cls: "green" },
    { label: "Unidades vendidas estimadas", value: fmtInt(totalUnits), cls: "cyan" },
    { label: "Formato mais engajador", value: bestFormat.name, cls: "pink" },
  ];

  document.getElementById("kpi-grid").innerHTML = kpis
    .map(
      (k) => `
      <div class="kpi-card">
        <div class="label">${k.label}</div>
        <div class="value ${k.cls}">${k.value}</div>
      </div>`
    )
    .join("");
}

function renderBarChart(containerId, rows, { valueSuffix = "", maxValue = null } = {}) {
  const max = maxValue ?? Math.max(...rows.map((r) => r.value));
  document.getElementById(containerId).innerHTML = rows
    .map((r) => {
      const pct = Math.max(4, Math.round((r.value / max) * 100));
      return `
        <div class="chart-row">
          <div class="label">${r.label}</div>
          <div class="chart-track"><div class="chart-fill" style="width:${pct}%"></div></div>
          <div class="val">${r.value}${valueSuffix}</div>
        </div>`;
    })
    .join("");
}

function renderOverviewCharts() {
  const growthByNiche = NICHES.map((niche) => {
    const items = PRODUCTS.filter((p) => p.niche === niche);
    const avg = items.length
      ? items.reduce((s, p) => s + p.growthPercent, 0) / items.length
      : 0;
    return { label: niche, value: Math.round(avg) };
  }).sort((a, b) => b.value - a.value);

  renderBarChart("chart-niche-growth", growthByNiche, { valueSuffix: "%" });

  const formatRows = [...VIDEO_FORMATS]
    .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)
    .map((f) => ({ label: f.name, value: f.avgEngagementRate }));

  renderBarChart("chart-format-engagement", formatRows, { valueSuffix: "%" });
}

/* -------------------------------- Produtos ---------------------------------- */

function populateNicheSelects() {
  const options = `<option value="all">Todos os nichos</option>` +
    NICHES.map((n) => `<option value="${n}">${n}</option>`).join("");
  document.getElementById("product-niche-filter").innerHTML = options;

  document.getElementById("rec-niche-select").innerHTML = NICHES.map(
    (n) => `<option value="${n}">${n}</option>`
  ).join("");
}

function renderProductCard(p) {
  const compCls = competitionClass[p.competitionLevel] || "mid";
  const formats = p.bestVideoFormats
    .map((id) => `<span class="tag">${formatById(id)?.name ?? id}</span>`)
    .join("");

  return `
    <div class="card">
      <div class="card-top">
        <h3>${p.name}</h3>
        <span class="pill ${compCls}">${p.competitionLevel} concorrência</span>
      </div>
      <span class="pill niche">${p.niche}</span>
      <div class="metrics">
        <div>Preço médio: <b>${fmtBRL(p.avgPriceBRL)}</b></div>
        <div>Vendidos (30d): <b>${fmtInt(p.unitsSoldEstimate)}</b></div>
        <div>Crescimento: <b style="color:var(--green)">+${p.growthPercent}%</b></div>
      </div>
      <p class="why">${p.whyTrending}</p>
      <div class="formats">${formats}</div>
    </div>`;
}

function renderProducts() {
  const search = document.getElementById("product-search").value.trim().toLowerCase();
  const niche = document.getElementById("product-niche-filter").value;
  const sort = document.getElementById("product-sort").value;

  let items = PRODUCTS.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search);
    const matchesNiche = niche === "all" || p.niche === niche;
    return matchesSearch && matchesNiche;
  });

  const sortMap = {
    growth: (a, b) => b.growthPercent - a.growthPercent,
    units: (a, b) => b.unitsSoldEstimate - a.unitsSoldEstimate,
    price: (a, b) => b.avgPriceBRL - a.avgPriceBRL,
  };
  items = items.sort(sortMap[sort] || sortMap.growth);

  const grid = document.getElementById("product-grid");
  grid.innerHTML = items.length
    ? items.map(renderProductCard).join("")
    : `<div class="empty-hint">Nenhum produto encontrado com esses filtros.</div>`;
}

function initProductFilters() {
  document.getElementById("product-search").addEventListener("input", renderProducts);
  document.getElementById("product-niche-filter").addEventListener("change", renderProducts);
  document.getElementById("product-sort").addEventListener("change", renderProducts);
}

/* --------------------------------- Vídeos ------------------------------------ */

function renderFormatCard(f) {
  const niches = f.bestFor.map((n) => `<span class="tag">${n}</span>`).join("");
  return `
    <div class="card">
      <div class="card-top">
        <h3>${f.name}</h3>
        <span class="pill low">${f.avgEngagementRate.toFixed(1)}% engajamento</span>
      </div>
      <p class="why">${f.description}</p>
      <div class="metrics">
        <div>Views médias: <b>${fmtInt(f.avgViews)}</b></div>
      </div>
      <div class="formats">${niches}</div>
    </div>`;
}

function renderFormats() {
  const sorted = [...VIDEO_FORMATS].sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);
  document.getElementById("format-grid").innerHTML = sorted.map(renderFormatCard).join("");
}

function renderCreatorVideoRow(v) {
  const format = formatById(v.formatId);
  return `
    <tr>
      <td>${v.title}</td>
      <td><span class="tag">${format?.name ?? v.formatId}</span></td>
      <td>${fmtInt(v.views)}</td>
      <td>${fmtInt(v.likes)}</td>
      <td>${fmtInt(v.shares)}</td>
      <td class="eng-strong">${v.engagementRate.toFixed(1)}%</td>
    </tr>`;
}

function renderCreators() {
  const html = CREATOR_PROFILES.map((c) => {
    const bestVideo = [...c.videos].sort((a, b) => b.engagementRate - a.engagementRate)[0];
    const bestFormat = formatById(bestVideo.formatId);
    const rows = [...c.videos]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .map(renderCreatorVideoRow)
      .join("");

    return `
      <div class="creator-card">
        <div class="creator-head">
          <div>
            <div class="name">${c.name}</div>
            <div class="meta">${c.niche} · ${fmtInt(c.followers)} seguidores</div>
          </div>
        </div>
        <div class="best-format-banner">
          🏆 Formato que mais vende e engaja neste perfil: <b>${bestFormat?.name ?? ""}</b>
          (${bestVideo.engagementRate.toFixed(1)}% de engajamento)
        </div>
        <table class="video-table">
          <thead>
            <tr>
              <th>Vídeo</th>
              <th>Formato</th>
              <th>Views</th>
              <th>Curtidas</th>
              <th>Compart.</th>
              <th>Engaj.</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join("");

  document.getElementById("creator-list").innerHTML = html;
}

/* ---------------------------- Recomendações --------------------------------- */

function generateRecommendation(niche) {
  const nicheProducts = PRODUCTS.filter((p) => p.niche === niche).sort(
    (a, b) => b.growthPercent - a.growthPercent
  );
  const nicheFormats = VIDEO_FORMATS.filter((f) => f.bestFor.includes(niche)).sort(
    (a, b) => b.avgEngagementRate - a.avgEngagementRate
  );

  if (!nicheProducts.length || !nicheFormats.length) {
    return `<div class="empty-hint">Sem dados suficientes para este nicho ainda.</div>`;
  }

  const topProduct = nicheProducts[0];
  const topFormat = nicheFormats[0];
  const hook = topFormat.exampleHook;

  const otherProducts = nicheProducts.slice(1, 3);

  return `
    <div class="rec-product">
      <div class="top-row">
        <div>
          <h4>Produto recomendado: ${topProduct.name}</h4>
          <div class="metrics">
            <div>Crescimento: <b style="color:var(--green)">+${topProduct.growthPercent}%</b></div>
            <div>Preço médio: <b>${fmtBRL(topProduct.avgPriceBRL)}</b></div>
            <div>Concorrência: <b>${topProduct.competitionLevel}</b></div>
          </div>
        </div>
        <span class="pill niche">${niche}</span>
      </div>
      <p class="why">${topProduct.whyTrending}</p>
    </div>

    <div class="rec-format-box">
      <b>Formato de vídeo recomendado: ${topFormat.name}</b>
      <p class="why" style="margin-top:0.4rem;">${topFormat.description} · Engajamento médio de ${topFormat.avgEngagementRate.toFixed(1)}%.</p>
      <div class="hook">Gancho sugerido (primeiros 3 segundos): "${hook}"</div>
    </div>

    ${
      otherProducts.length
        ? `<div>
            <p class="subtitle" style="margin-bottom:0.5rem;">Outras oportunidades no nicho:</p>
            <div class="card-grid">${otherProducts.map(renderProductCard).join("")}</div>
          </div>`
        : ""
    }
  `;
}

function initRecommendations() {
  const btn = document.getElementById("rec-generate-btn");
  const resultEl = document.getElementById("rec-result");
  btn.addEventListener("click", () => {
    const niche = document.getElementById("rec-niche-select").value;
    resultEl.innerHTML = generateRecommendation(niche);
    resultEl.classList.add("show");
  });
}

/* ---------------------------------- Boot ------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  populateNicheSelects();
  renderKpis();
  renderOverviewCharts();
  renderProducts();
  initProductFilters();
  renderFormats();
  renderCreators();
  initRecommendations();
});
