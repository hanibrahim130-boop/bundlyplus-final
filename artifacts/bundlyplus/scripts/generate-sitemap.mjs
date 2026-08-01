#!/usr/bin/env node
// Generates public/sitemap.xml from static routes + product pages parsed from
// src/data/products.json + blog posts parsed from src/pages/Blog.tsx.
// Runs automatically before every build (see package.json "build"), or manually via `npm run sitemap`.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = process.env.SITEMAP_BASE_URL || "https://bundlyplus.com";
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/coming-soon", changefreq: "monthly", priority: "0.4" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
];

// Mirror of src/lib/product-slug.ts — keep the two in sync.
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

function productRoutes() {
  const raw = readFileSync(resolve(ROOT, "src/data/products.json"), "utf8");
  const products = JSON.parse(raw);
  const seen = new Set();
  const routes = [];
  for (const p of products) {
    if (!p || typeof p.name !== "string" || !p.name.trim()) continue;
    const slug = productSlug(p.name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    routes.push({
      path: "/products/" + slug,
      changefreq: "weekly",
      priority: "0.7",
    });
  }
  if (routes.length === 0) {
    console.warn("[sitemap] Warning: no products found in products.json.");
  }
  return routes;
}

function blogRoutes() {
  const src = readFileSync(resolve(ROOT, "src/pages/Blog.tsx"), "utf8");
  const routes = [];
  const re = /slug:\s*"([^"]+)"[\s\S]{0,600}?date:\s*"(\d{4}-\d{2}-\d{2})"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    routes.push({
      path: "/blog/" + m[1],
      changefreq: "monthly",
      priority: "0.6",
      lastmod: m[2],
    });
  }
  if (routes.length === 0) {
    console.warn("[sitemap] Warning: no blog posts found in Blog.tsx \u2014 check the slug/date regex.");
  }
  return routes;
}

function urlEntry(route) {
  const loc = BASE_URL + (route.path === "/" ? "/" : route.path);
  return [
    "  <url>",
    "    <loc>" + loc + "</loc>",
    "    <lastmod>" + (route.lastmod || TODAY) + "</lastmod>",
    "    <changefreq>" + route.changefreq + "</changefreq>",
    "    <priority>" + route.priority + "</priority>",
    '    <xhtml:link rel="alternate" hreflang="en" href="' + loc + '" />',
    '    <xhtml:link rel="alternate" hreflang="ar" href="' + loc + '" />',
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + loc + '" />',
    "  </url>",
  ].join("\n");
}

const routes = [...STATIC_ROUTES, ...productRoutes(), ...blogRoutes()];
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  routes.map(urlEntry).join("\n") +
  "\n</urlset>\n";

const outPath = resolve(ROOT, "public/sitemap.xml");
writeFileSync(outPath, xml);
console.log("[sitemap] Wrote " + routes.length + " URLs to " + outPath);
