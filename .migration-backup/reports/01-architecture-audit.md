# Phase 1 — Architecture Audit Report
**Agent 1: Repo Architecture Auditor**
**Date**: 2026-04-29

---

## Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Framework | React (SPA via Vite) | React 19.1.0, Vite 7.3.0 |
| Routing | wouter | 3.3.5 |
| Styling | Tailwind CSS v4 + @tailwindcss/vite | 4.1.14 |
| Animations | Framer Motion | 12.23.24 |
| UI Components | Radix UI (shadcn/ui pattern) + Lucide React | multiple |
| Data | Firebase Firestore (client SDK) | 12.11.0 |
| State | React Context (Cart, Wishlist, Theme, I18n, Currency) | — |
| Build | Vite 7 with manual chunk splitting | — |
| Fonts | Google Fonts (Inter, Space Grotesk, Cairo for RTL) | — |
| Deployment | Vercel (SPA mode, index.html rewrite) | — |
| Package Manager | pnpm (workspace monorepo) | — |
| Icons | lucide-react + react-icons (potentially unused) | — |

## Folder Structure Summary

```
bundlyplus/
├── artifacts/
│   └── bundlyplus/           ← MAIN APP
│       ├── src/
│       │   ├── components/
│       │   │   ├── home/     ← Hero, LocalTrust, MadeForMENA, WhyChooseUs, Pricing, Testimonials, FAQ
│       │   │   ├── layout/   ← Background, Navbar, BottomNav, Footer, SocialProofToasts, CommandPalette
│       │   │   ├── motion/   ← ScrollReveal (stagger/reveal wrappers)
│       │   │   ├── shared/   ← ProductCard, BundleCard, etc.
│       │   │   └── ui/       ← 55 shadcn/ui components
│       │   ├── data/         ← products.json (65KB), bundles.json, payments.tsx, settings.json
│       │   ├── hooks/        ← use-cart, use-wishlist, use-mobile, use-toast, use-scroll-to-top
│       │   ├── lib/          ← firebase, firestore-hooks, motion, theme, i18n, currency, brand-theme
│       │   ├── pages/        ← Home, Products, Bundles, Cart, Wishlist, Admin, not-found
│       │   └── utils/        ← logoUtils, logoManifest, whatsapp
│       └── public/
│           └── logos/        ← 89 logo image files
├── lib/                      ← shared workspace libs (api-client, api-spec, db)
├── scripts/                  ← seed scripts, GitHub push
└── vercel.json               ← deployment config
```

## Important Components (Homepage Critical Path)

1. **Background.tsx** — Fixed-position animated blur blobs (always rendered)
2. **Navbar.tsx** — Fixed-position glass-panel with backdrop-blur (always rendered)
3. **BottomNav.tsx** — Fixed-position glass-panel bottom nav, mobile only (always rendered)
4. **Hero.tsx** — 3 aurora blobs (Framer Motion infinite), 2 marquee rows (Framer Motion infinite), rotating word animation
5. **ProductCard.tsx** — Each card uses motion.div with entry animation
6. **ScrollReveal.tsx** — whileInView animation wrapper used on every section
7. **SocialProofToasts.tsx** — Periodic toast popups with AnimatePresence
8. **CommandPalette.tsx** — Cmd+K palette that eagerly fetches all products from Firestore

## Risk Areas

### 🔴 Critical — Mobile Performance
- **6 simultaneous blur layers**: 3 in Background.tsx (blur-[100-140px]) + 3 in Hero.tsx (blur-3xl) = massive GPU compositing cost
- **backdrop-blur on scroll surfaces**: Navbar, BottomNav, Footer, glass-card, glass-button all use backdrop-blur during scrolling
- **Infinite CSS animations**: 3 blob-drift, float-logo, float-card, float-card-alt, glow-pulse, shimmer, marquee — all running concurrently
- **Infinite Framer Motion animations**: Hero aurora blobs (3x), marquee rows (2x) — JS-driven infinite animations

### 🟡 High — Bundle Size
- `firebase` (12.11.0) full client SDK imported; `firebase/auth` imported but appears unused
- `react-icons` (5.4.0) in dependencies — potential tree-shaking issue if any icon imported
- `products.json` at 65KB bundled statically
- Full `framer-motion` bundle (~120KB gzipped) — no LazyMotion used
- 55 shadcn/ui components — many likely unused

### 🟡 High — Rendering
- `CommandPalette` calls `useProducts()` on mount → fetches ALL products from Firestore even when never opened
- `AnimatePresence mode="wait"` wrapping all routes in App.tsx → blocks route transitions
- Each `ProductCard` has its own `motion.div` with `initial`/`animate` → re-animates on every render
- No React.memo on any frequently-rendered component

### 🟢 Medium — Code Quality
- `useSettings()` makes 2 Firestore reads (site + bundles) on every component mount — no caching/dedup
- Font loaded in BOTH `index.html` AND `index.css` (duplicate network requests)
- `SocialProofToasts` timer leak — recursive setTimeout, but only last `timeoutId` tracked
- `body overflow-x-hidden` masks horizontal overflow issues rather than fixing root cause

## Likely Performance Bottlenecks (Ranked)

1. **Blur layers on mobile** (Background + Hero + glass-* utilities) — #1 cause of mobile lag
2. **Infinite animations** running simultaneously (CSS + Framer Motion)
3. **backdrop-blur during scroll** on fixed elements (Navbar, BottomNav)
4. **Firebase bundle size** (~200KB+ for unused auth + firestore)
5. **Full Framer Motion bundle** without LazyMotion
6. **Duplicate font loading** (index.html + index.css)
7. **Eager Firestore fetch** in CommandPalette
8. **65KB products.json** inlined in bundle
9. **No image optimization** — 89 logos loaded as-is from /public/logos/
10. **No CSS containment** on animated sections
