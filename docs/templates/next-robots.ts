/**
 * Next.js App Router robots.ts template — kept here as a reference for
 * a future migration. Not wired into the current build.
 *
 * bundlyplus.com currently ships on Vite + React; the served file is
 * `artifacts/bundlyplus/public/robots.txt`, which is the source of truth.
 *
 * If/when the site moves to Next.js:
 *  1. Place this file at `app/robots.ts`.
 *  2. Delete `public/robots.txt` — the App Router generator takes over.
 *  3. Point Vercel at the new build; the /robots.txt path is auto-served.
 */

import type { MetadataRoute } from "next";

const SITE_URL = "https://bundlyplus.com";

// Paths that should never appear in search results. Order matches the
// current Vite robots.txt so the two stay in sync if either is edited.
const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/account/",
  "/cart/",
  "/checkout/",
  "/wishlist/",
  "/sign-in/",
  "/sign-up/",
  "/_next/", // Next.js-only: the asset path used by the framework.
];

// AI crawlers we opt out of training for. Search + grounded-answer uses
// are left allowed because they drive qualified traffic.
const AI_CRAWLERS = [
  "AIbot",
  "ChatGPT-User",
  "CCBot",
  "Google-Extended",
  "GPTBot",
  "anthropic-ai",
  "Claude-User",
  "cohere-ai",
  "PerplexityBot",
  "Applebot-Extended",
  "Diffbot",
  "FacebookBot",
  "meta-externalagent",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Collapse the AI crawlers into a single rule with a userAgent
      // array. The App Router expands this into one `User-agent` line
      // per entry at render time, which matches the current
      // public/robots.txt output.
      {
        userAgent: AI_CRAWLERS,
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
