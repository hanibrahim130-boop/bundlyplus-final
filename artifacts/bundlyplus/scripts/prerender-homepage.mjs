import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(appRoot, 'dist', 'public', 'index.html');
const productsPath = path.join(appRoot, 'src', 'data', 'products.json');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function selectFeaturedProducts(products) {
  return products
    .filter((product) => product.featured && !product.out_of_stock)
    .sort((a, b) => Number(Boolean(b.hot)) - Number(Boolean(a.hot)) || a.name.localeCompare(b.name))
    .slice(0, 12);
}

function renderProduct(product) {
  const features = Array.isArray(product.features) ? product.features.slice(0, 3) : [];
  return `
          <article class="seo-product-card">
            <p class="seo-product-category">${escapeHtml(product.category)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
            <strong>${formatPrice(product.price)} / ${escapeHtml(product.duration || 'month')}</strong>
          </article>`;
}

function renderProductGrid(products) {
  return products.map(renderProduct).join('');
}

function renderStyles() {
  return `<style>
    .seo-prerender{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a;background:#fff;min-height:100vh;padding:4rem 1.25rem}.seo-prerender section{max-width:1180px;margin:0 auto 4rem}.seo-hero{text-align:center;padding-top:3rem}.seo-eyebrow{color:#ec4899;font-weight:800;text-transform:uppercase;letter-spacing:.16em;font-size:.8rem}.seo-hero h1{font-size:clamp(2.4rem,7vw,5.5rem);line-height:.95;margin:1rem auto;max-width:980px}.seo-hero p{font-size:1.15rem;line-height:1.7;color:#475569;max-width:760px;margin:0 auto}.seo-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin-top:2rem}.seo-actions a{border-radius:999px;padding:.9rem 1.35rem;font-weight:800;text-decoration:none}.seo-primary{background:#0f172a;color:#fff}.seo-secondary{border:1px solid #e2e8f0;color:#0f172a}.seo-section-title{font-size:2.25rem;line-height:1.1;margin-bottom:.75rem}.seo-section-lead{color:#64748b;font-size:1rem;line-height:1.7;margin-bottom:1.5rem}.seo-product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem}.seo-product-card{border:1px solid #e2e8f0;border-radius:1.25rem;padding:1.25rem;background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06)}.seo-product-card h3{font-size:1.1rem;margin:.35rem 0}.seo-product-card p{color:#475569;line-height:1.55}.seo-product-card ul{padding-left:1.1rem;color:#64748b}.seo-product-card strong{display:block;margin-top:1rem;font-size:1.25rem;color:#db2777}.seo-product-category{font-size:.75rem;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:#ec4899}.seo-pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.seo-price-card{border-radius:1.25rem;padding:1.5rem;background:#f8fafc;border:1px solid #e2e8f0}.seo-price-card strong{font-size:1.8rem;color:#db2777}@media (prefers-color-scheme:dark){.seo-prerender{background:#020617;color:#f8fafc}.seo-hero p,.seo-section-lead,.seo-product-card p,.seo-product-card ul{color:#cbd5e1}.seo-product-card,.seo-price-card{background:#0f172a;border-color:#1e293b}.seo-secondary{color:#f8fafc;border-color:#334155}}
  </style>`;
}

function renderHomepage(products) {
  return `<div id="seo-prerender" class="seo-prerender">
  ${renderStyles()}
  <section class="seo-hero">
    <p class="seo-eyebrow">BundlyPlus Lebanon & MENA</p>
    <h1>Premium digital subscriptions at unbeatable prices</h1>
    <p>Get Netflix, Spotify, ChatGPT Plus, Adobe Creative Cloud, YouTube Premium and more with fast WhatsApp delivery, local payment support, and trusted customer service.</p>
    <div class="seo-actions">
      <a class="seo-primary" href="/products">Browse products</a>
      <a class="seo-secondary" href="/contact">Order on WhatsApp</a>
    </div>
  </section>
  <section>
    <h2 class="seo-section-title">Top digital subscriptions</h2>
    <p class="seo-section-lead">Popular accounts and tools available through BundlyPlus before JavaScript loads.</p>
    <div class="seo-product-grid">${renderProductGrid(products)}</div>
  </section>
  <section>
    <h2 class="seo-section-title">Simple pricing and local checkout</h2>
    <div class="seo-pricing">
      <div class="seo-price-card"><h3>Streaming</h3><strong>from $3.49/mo</strong><p>Netflix, Disney+, Prime Video, Apple TV+ and more.</p></div>
      <div class="seo-price-card"><h3>Music</h3><strong>from $1.99/mo</strong><p>Spotify, Anghami, Apple Music, Deezer and premium audio tools.</p></div>
      <div class="seo-price-card"><h3>AI & Creative</h3><strong>from $4.99/mo</strong><p>ChatGPT Plus, Canva Pro, Adobe Creative Cloud and design platforms.</p></div>
    </div>
  </section>
</div>`;
}

function injectPrerenderedHtml(html, prerenderedHtml) {
  const rootPattern = /<div id="root"><\/div>/;
  if (!rootPattern.test(html)) throw new Error('Could not find empty root element in built index.html');
  return html.replace(rootPattern, `<div id="root">${prerenderedHtml}</div>`);
}

const html = await readFile(htmlPath, 'utf8');
const products = JSON.parse(await readFile(productsPath, 'utf8'));
const featuredProducts = selectFeaturedProducts(products);
const updatedHtml = injectPrerenderedHtml(html, renderHomepage(featuredProducts));

await writeFile(htmlPath, updatedHtml);
console.log(`[prerender-homepage] injected ${featuredProducts.length} products into ${htmlPath}`);
