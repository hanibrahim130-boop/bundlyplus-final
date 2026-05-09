import type { Request, Response, NextFunction } from "express";

/**
 * Returns a markdown page for the given path when agents request text/markdown.
 */
function getMarkdown(path: string): string | null {
  const base = "https://bundlyplus.com";

  const pages: Record<string, { title: string; desc: string; links: [string, string][] }> = {
    "/": {
      title: "BundlyPlus — Premium Digital Subscriptions at Unbeatable Prices",
      desc: `**Save up to 80%** on 50+ premium digital subscriptions. Instant WhatsApp delivery across Lebanon & MENA.

- Netflix, Spotify, ChatGPT Plus, Adobe CC, YouTube Premium
- AI tools: Midjourney, GitHub Copilot, Perplexity, Cursor IDE
- Private & shared accounts available
- Local payment: Whish Money, OMT, USDT
- 250+ active customers`,
      links: [
        ["Browse Products", "/products"],
        ["Contact on WhatsApp", "/contact"],
      ],
    },
    "/products": {
      title: "All Products — Digital Subscriptions Catalog",
      desc: `Browse 50+ premium digital subscriptions at unbeatable prices. Filter by category, account type (private/shared), and sort by price or popularity.

**Categories:** AI & Software, Streaming, Productivity, Design, Gaming`,
      links: [
        ["Browse All", "/products"],
        ["View Home", "/"],
      ],
    },
    "/contact": {
      title: "Contact BundlyPlus — WhatsApp Support",
      desc: `Reach BundlyPlus customer support via WhatsApp for orders, renewals, and inquiries.

- Fast response in English & Arabic
- Order support, renewals, custom requests`,
      links: [
        ["Browse Products", "/products"],
        ["Home", "/"],
      ],
    },
    "/privacy": {
      title: "Privacy Policy — BundlyPlus",
      desc: `BundlyPlus privacy policy. We use privacy-friendly analytics with anonymized IPs and no session recording.`,
      links: [["Home", "/"]],
    },
    "/terms": {
      title: "Terms of Service — BundlyPlus",
      desc: `BundlyPlus terms of service for digital subscription purchases and delivery.`,
      links: [["Home", "/"]],
    },
    "/refund-policy": {
      title: "Refund Policy — BundlyPlus",
      desc: `BundlyPlus refund policy for digital subscription purchases. Replacement or refund if access cannot be delivered.`,
      links: [["Home", "/"]],
    },
  };

  const page = pages[path];
  if (!page) return null;

  const linksMd = page.links
    .map(([label, href]) => `- [${label}](${base}${href})`)
    .join("\n");

  return `# ${page.title}

${page.desc}

---

### Quick Links
${linksMd}

---
*BundlyPlus — Premium Digital Subscriptions for Lebanon & MENA*
`;
}

/**
 * Content negotiation middleware for AI agents.
 * When a request includes Accept: text/markdown, return a markdown
 * representation instead of the default HTML SPA shell.
 */
export function markdownNegotiation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accept = req.get("accept") || "";
  const wantsMarkdown =
    accept.includes("text/markdown") && !accept.includes("text/html");

  if (!wantsMarkdown) return next();

  const path = req.path;
  const md = getMarkdown(path);

  if (!md) {
    // For unknown paths, return a minimal markdown response
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("x-markdown-tokens", "true");
    return res.send(
      `# Page Not Found\n\nThe requested page does not exist.\n\n[Return to Home](https://bundlyplus.com/)`,
    );
  }

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("x-markdown-tokens", "true");
  res.setHeader("Vary", "Accept");
  res.send(md);
}
