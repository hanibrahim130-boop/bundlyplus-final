import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const distRoot = path.join(appRoot, "dist", "public");
const htmlPath = path.join(distRoot, "index.html");
const productsPath = path.join(appRoot, "src", "data", "products.json");

const privateRoutes = [
  [
    "/cart",
    "Your cart",
    "Your selected subscriptions are private and load securely in your browser.",
  ],
  [
    "/wishlist",
    "Your wishlist",
    "Saved subscriptions are private and load securely in your browser.",
  ],
  [
    "/sign-in",
    "Sign in",
    "Sign in to manage orders, subscriptions, wishlist, and checkout.",
  ],
  [
    "/sign-up",
    "Create account",
    "Create a BundlyPlus account to manage digital subscriptions.",
  ],
  [
    "/account",
    "Account dashboard",
    "Your profile and account data are private.",
  ],
  [
    "/account/subscriptions",
    "Account subscriptions",
    "Your active subscriptions are private.",
  ],
  ["/account/orders", "Account orders", "Your order history is private."],
  [
    "/admin",
    "Admin dashboard",
    "Administrative tools are private and restricted.",
  ],
];

const staticRoutes = [
  [
    "/coming-soon",
    "Coming soon",
    "New digital subscriptions and marketplace features are coming soon to BundlyPlus.",
  ],
  [
    "/contact",
    "Contact BundlyPlus",
    "Contact BundlyPlus on WhatsApp for Netflix, Spotify, ChatGPT Plus, Adobe, YouTube Premium, and other digital subscriptions.",
  ],
  [
    "/terms",
    "Terms of service",
    "Read the BundlyPlus terms for digital subscription purchases, delivery, account use, and support.",
  ],
  [
    "/privacy",
    "Privacy policy",
    "Read how BundlyPlus handles account, order, and support information.",
  ],
  [
    "/refund-policy",
    "Refund policy",
    "Read BundlyPlus refund, replacement, and support policies for digital subscription orders.",
  ],
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function productSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getPublicProducts(products) {
  return products
    .filter((product) => !product.out_of_stock)
    .sort(
      (a, b) =>
        Number(Boolean(b.hot)) - Number(Boolean(a.hot)) ||
        a.name.localeCompare(b.name),
    );
}

function getFeaturedProducts(products) {
  return getPublicProducts(products)
    .filter((product) => product.featured)
    .slice(0, 12);
}

function renderProduct(product) {
  const features = Array.isArray(product.features)
    ? product.features.slice(0, 3)
    : [];
  const slug = productSlug(product.name);
  return `
          <article class="seo-product-card">
            <p class="seo-product-category">${escapeHtml(product.category)}</p>
            <h3><a href="/products/${escapeHtml(slug)}" style="text-decoration:none;color:inherit">${escapeHtml(product.name)}</a></h3>
            <p>${escapeHtml(product.description)}</p>
            <ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
            <strong>${formatPrice(product.price)} / ${escapeHtml(product.duration || "month")}</strong>
          </article>`;
}

function renderProductGrid(products) {
  return products.map(renderProduct).join("");
}

function renderStyles() {
  return `<style>
    .seo-prerender{font-family:'Inter Tight',Inter,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#1D1D1F;background:#FBFBFD;min-height:100vh;padding:4rem 1.25rem}.seo-prerender section{max-width:1024px;margin:0 auto 4rem}.seo-hero{text-align:center;padding-top:3rem}.seo-eyebrow{color:#6E6E73;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:.75rem}.seo-hero h1{font-size:clamp(2.4rem,7vw,5.5rem);line-height:1.02;letter-spacing:-.04em;font-weight:700;margin:1rem auto;max-width:980px}.seo-hero p{font-size:1.0625rem;line-height:1.5;color:#6E6E73;max-width:640px;margin:0 auto}.seo-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:2rem}.seo-actions a{border-radius:999px;padding:.75rem 1.5rem;font-weight:600;font-size:.9375rem;text-decoration:none;letter-spacing:-.01em}.seo-primary{background:#EC4899;color:#fff;box-shadow:0 6px 20px -6px rgba(236,72,153,.55)}.seo-secondary{border:1px solid rgba(0,0,0,.12);color:#1D1D1F}.seo-section-title{font-size:1.875rem;line-height:1.1;font-weight:700;letter-spacing:-.025em;margin-bottom:.5rem}.seo-section-lead{color:#6E6E73;font-size:.9375rem;line-height:1.5;margin-bottom:1.5rem}.seo-product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem}.seo-product-card{border:1px solid rgba(0,0,0,.08);border-radius:.875rem;padding:1.25rem;background:#fff;transition:transform .2s,box-shadow .2s}.seo-product-card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.08)}.seo-product-card h3{font-size:1rem;font-weight:600;letter-spacing:-.01em;margin:.35rem 0}.seo-product-card p{color:#6E6E73;font-size:.875rem;line-height:1.5}.seo-product-card ul{padding-left:1.1rem;color:#86868B;font-size:.8125rem}.seo-product-card strong{display:block;margin-top:.75rem;font-size:1.125rem;font-weight:600;color:#EC4899}.seo-product-category{font-size:.6875rem;text-transform:uppercase;letter-spacing:.08em;font-weight:600;color:#6E6E73}.seo-pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.seo-price-card{border-radius:.875rem;padding:1.5rem;background:#F5F5F7;border:1px solid rgba(0,0,0,.08)}.seo-price-card strong{font-size:1.5rem;font-weight:700;color:#EC4899}@media(prefers-color-scheme:dark){.seo-prerender{background:#000;color:#F5F5F7}.seo-hero p,.seo-section-lead,.seo-product-card p,.seo-product-card ul{color:#A1A1A6}.seo-product-card,.seo-price-card{background:#1D1D1F;border-color:rgba(255,255,255,.1)}.seo-secondary{color:#F5F5F7;border-color:rgba(255,255,255,.14)}.seo-eyebrow{color:#A1A1A6}}
  </style>`;
}

function renderShell(eyebrow, title, description, content = "") {
  return `<div id="seo-prerender" class="seo-prerender" aria-hidden="true">
  ${renderStyles()}
  <section class="seo-hero">
    <p class="seo-eyebrow">${escapeHtml(eyebrow)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <div class="seo-actions">
      <a class="seo-primary" href="/products">Browse all subscriptions</a>
      <a class="seo-secondary" href="/contact">Chat on WhatsApp</a>
    </div>
  </section>
  ${content}
</div>`;
}

function renderHomepage(products) {
  return renderShell(
    "PREMIUM DIGITAL SUBSCRIPTIONS · LEBANON & MENA",
    "Everything you stream. For a fraction of the price.",
    "Netflix, ChatGPT, Adobe, Spotify, IPTV and 180+ more — delivered to your phone in minutes, paid in LBP, USDT or card.",
    `
  <section>
    <h2 class="seo-section-title">Featured subscriptions</h2>
    <p class="seo-section-lead">Popular accounts and tools available through BundlyPlus.</p>
    <div class="seo-product-grid">${renderProductGrid(products)}</div>
  </section>
  <section>
    <h2 class="seo-section-title">Simple pricing, local checkout</h2>
    <div class="seo-pricing">
      <div class="seo-price-card"><h3>Streaming</h3><strong>from $3.49/mo</strong><p>Netflix, Disney+, Prime Video, Apple TV+ and more.</p></div>
      <div class="seo-price-card"><h3>Music</h3><strong>from $1.99/mo</strong><p>Spotify, Anghami, Apple Music, Deezer and premium audio.</p></div>
      <div class="seo-price-card"><h3>AI & Creative</h3><strong>from $4.99/mo</strong><p>ChatGPT Plus, Canva Pro, Adobe CC and design platforms.</p></div>
    </div>
  </section>`,
  );
}

function renderProductsPage(products) {
  return renderShell(
    "Digital subscription catalog",
    "Browse premium subscriptions before JavaScript loads",
    "Explore Netflix, Spotify, ChatGPT Plus, Adobe Creative Cloud, YouTube Premium, Disney+, Canva Pro, and more with local checkout support.",
    `
  <section>
    <h2 class="seo-section-title">Available products</h2>
    <p class="seo-section-lead">${products.length} digital subscriptions are included in this static catalog snapshot.</p>
    <div class="seo-product-grid">${renderProductGrid(products)}</div>
  </section>`,
  );
}

function renderProductDetailPage(product) {
  const features = Array.isArray(product.features) ? product.features : [];
  const slug = productSlug(product.name);
  const cat = escapeHtml(product.category || "");
  const name = escapeHtml(product.name);
  const desc = escapeHtml(product.description || "");
  const price = formatPrice(product.price);
  const duration = escapeHtml(product.duration || "month");

  const featureList = features.length > 0
    ? features.map(f => `<li>${escapeHtml(f)}</li>`).join("")
    : "";

  return renderShell(
    `${cat} · BundlyPlus`,
    `${name} — Premium Subscription`,
    `${desc} Only ${price}/${duration} on BundlyPlus. Instant delivery via WhatsApp.`,  
    `
  <section>
    <div class="seo-product-detail">
      <h2 class="seo-section-title">${name} — ${price} / ${duration}</h2>
      <p class="seo-section-lead">${desc}</p>
      ${featureList ? `<h3>Features</h3><ul>${featureList}</ul>` : ""}
      <p style="margin-top:1.25rem">
        <strong>Category:</strong> ${cat} &middot;
        <strong>Account type:</strong> ${escapeHtml(product.account_type || "Shared")}
      </p>
      <div class="seo-actions">
        <a class="seo-primary" href="/products/${escapeHtml(slug)}">View on BundlyPlus</a>
        <a class="seo-secondary" href="/contact">Chat on WhatsApp</a>
      </div>
    </div>
  </section>
  <section>
    <h2 class="seo-section-title">More subscriptions</h2>
    <p class="seo-section-lead">Browse our full catalog of digital subscriptions.</p>
    <div class="seo-actions">
      <a class="seo-primary" href="/products">Browse all subscriptions</a>
    </div>
  </section>`,
  );
}

function createProductItemList(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BundlyPlus digital subscription catalog",
    itemListElement: products.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `https://bundlyplus.com/products/${escapeHtml(productSlug(product.name))}`,
    })),
  };
}

function createProductJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `https://bundlyplus.com/products/${escapeHtml(productSlug(product.name))}`,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

function setHead(html, { title, description, canonical, robots, jsonLd }) {
  let nextHtml = html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta name="robots" content=".*?" \/>/,
      `<meta name="robots" content="${escapeHtml(robots)}" />`,
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    )
    .replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    );
  if (!jsonLd) return nextHtml;
  return nextHtml.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
  );
}

function injectPrerenderedHtml(html, prerenderedHtml) {
  const rootPattern = /<div id="root"><\/div>/;
  if (!rootPattern.test(html))
    throw new Error("Could not find empty root element in built index.html");
  return html.replace(rootPattern, `<div id="root">${prerenderedHtml}</div>`);
}

async function writeRoute(routePath, html) {
  const routeDir = path.join(distRoot, routePath.replace(/^\//, ""));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

function createPage(baseHtml, page) {
  return injectPrerenderedHtml(setHead(baseHtml, page), page.body);
}

const baseHtml = await readFile(htmlPath, "utf8");
const products = JSON.parse(await readFile(productsPath, "utf8"));
const publicProducts = getPublicProducts(products);
const featuredProducts = getFeaturedProducts(products);

const homeHtml = createPage(baseHtml, {
  title: "BundlyPlus — Premium Digital Subscriptions at Unbeatable Prices",
  description:
    "Get Netflix, Spotify, ChatGPT Plus, Adobe CC and more at unbeatable prices. Instant delivery via WhatsApp.",
  canonical: "https://bundlyplus.com/",
  robots: "index, follow",
  body: renderHomepage(featuredProducts),
});

const productsHtml = createPage(baseHtml, {
  title: "Digital Subscription Catalog | BundlyPlus",
  description:
    "Browse Netflix, Spotify, ChatGPT Plus, Adobe, YouTube Premium and 100+ digital subscriptions before JavaScript loads.",
  canonical: "https://bundlyplus.com/products",
  robots: "index, follow",
  jsonLd: createProductItemList(publicProducts),
  body: renderProductsPage(publicProducts),
});

await writeFile(htmlPath, homeHtml);
await writeRoute("/products", productsHtml);

for (const [routePath, title, description] of staticRoutes) {
  await writeRoute(
    routePath,
    createPage(baseHtml, {
      title: `${title} | BundlyPlus`,
      description,
      canonical: `https://bundlyplus.com${routePath}`,
      robots: "index, follow",
      body: renderShell("BundlyPlus", title, description),
    }),
  );
}

for (const [routePath, title, description] of privateRoutes) {
  await writeRoute(
    routePath,
    createPage(baseHtml, {
      title: `${title} | BundlyPlus`,
      description,
      canonical: `https://bundlyplus.com${routePath}`,
      robots: "noindex, nofollow",
      body: renderShell("Private BundlyPlus page", title, description),
    }),
  );
}

// Prerender individual product detail pages
const seenSlugs = new Set();
for (const product of publicProducts) {
  const slug = productSlug(product.name);
  if (seenSlugs.has(slug)) continue; // skip collisions
  seenSlugs.add(slug);
  
  const routePath = `/products/${slug}`;
  await writeRoute(
    routePath,
    createPage(baseHtml, {
      title: `${escapeHtml(product.name)} | BundlyPlus`,
      description: `${escapeHtml(product.description)} Only ${formatPrice(product.price)}/${escapeHtml(product.duration || "month")} on BundlyPlus. Instant delivery via WhatsApp.`,
      canonical: `https://bundlyplus.com${routePath}`,
      robots: "index, follow",
      jsonLd: createProductJsonLd(product),
      body: renderProductDetailPage(product),
    }),
  );
}

// Also add a vercel.json rewrite for product detail routes
const vercelJsonPath = path.resolve(appRoot, "..", "..", "vercel.json");
try {
  const vercelRaw = await readFile(vercelJsonPath, "utf8");
  const vercelConfig = JSON.parse(vercelRaw);
  const productRewrite = { "source": "/products/:slug", "destination": "/products/:slug/index.html" };
  const exists = vercelConfig.rewrites.some(r => r.source === "/products/:slug");
  if (!exists && seenSlugs.size > 0) {
    // Insert right before the catch-all
    const catchAllIdx = vercelConfig.rewrites.findIndex(r => r.source.startsWith("/(("));
    if (catchAllIdx >= 0) {
      vercelConfig.rewrites.splice(catchAllIdx, 0, productRewrite);
    } else {
      vercelConfig.rewrites.push(productRewrite);
    }
    await writeFile(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
    console.log(`[prerender-homepage] added /products/:slug rewrite to vercel.json`);
  }
} catch {
  // vercel.json might be at a different path; skip silently
}

console.log(
  `[prerender-homepage] prerendered homepage, products catalog, ${staticRoutes.length} static routes, ${privateRoutes.length} noindex routes, and ${seenSlugs.size} product detail pages`,
);
