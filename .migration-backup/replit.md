# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bundlyplus/         # BundlyPlus - Digital subscription marketplace (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
  - `GET /api/healthz` — health check
  - `GET /api/products` — list products (supports ?category, ?search, ?featured query params)
  - `GET /api/products/:id` — single product
  - `GET /api/bundles` — list bundles
  - `GET /api/bundles/:id` — single bundle
  - `GET /api/settings` — public site settings (allowlisted keys: site, bundles)
  - `POST /api/orders` — create order with item validation
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `artifacts/bundlyplus` (`@workspace/bundlyplus`)

BundlyPlus - Digital subscription marketplace website. Sells digital subscriptions (Netflix, Spotify, ChatGPT, etc.) and bundles. Users browse, add to cart, and order via WhatsApp.

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4 with glassmorphism design, pastel gradient aesthetic
- **Fonts**: Space Grotesk (display) + Inter (body)
- **Routing**: wouter (client-side)
- **State**: React Context (cart), localStorage persistence
- **UI Components**: shadcn/ui (accordion, toast, tooltip)
- **Animations**: Framer Motion
- **Design**: Soft pastel gradients (peach-lavender-pink), glassmorphism cards, full dark/light mode
- **Theme**: ThemeProvider (`src/lib/theme.tsx`) with localStorage persistence + system preference detection; toggle in Navbar

Architecture:
- `src/lib/settings.ts` — React Query hook for settings (useSettings, getWhatsAppUrl) — fetches from API
- `src/lib/brand-theme.ts` — Brand gradient maps and utilities (getBrandGradient, getInitials, indexedGradients)
- `src/components/shared/` — Shared design system components:
  - `Section.tsx` — Reusable section wrapper with consistent padding and max-width
  - `SectionHeader.tsx` — Reusable subtitle + title pattern for sections
  - `PageLayout.tsx` — Animated page wrapper with consistent top padding
  - `PageHeader.tsx` — Page title with gradient highlight word
  - `EmptyState.tsx` — Empty state pattern (used in Cart, Products no-results, 404)
  - `CategoryBadge.tsx` — Small category/tag badge
  - `ProductCard.tsx` — Product card with brand gradient logos
  - `BundleCard.tsx` — Bundle card with RTL text support

Key files:
- `src/App.tsx` — Main app with routing (Home, Products, Bundles, Cart, 404), scroll-to-top hook
- `src/pages/Home.tsx` — Homepage with Hero, Featured Products, WhyChooseUs, Pricing, Testimonials, FAQ
- `src/pages/Products.tsx` — Product catalog with search and category filters
- `src/pages/Bundles.tsx` — Bundle packages (Arabic content with RTL support)
- `src/pages/Cart.tsx` — Shopping cart with WhatsApp checkout, mobile-responsive layout
- `src/pages/not-found.tsx` — 404 page matching site theme
- `src/components/home/Hero.tsx` — Trendy hero: animated rotating word, live "X people upgraded today" counter, aurora gradient background, infinite-marquee of subscription cards (RTL-aware), bilingual copy
- `src/components/shared/ProductCard.tsx` — Product card with smart logo cascade (Clearbit → Google Favicons → gradient initials), in-cart visual state
- `src/utils/logoUtils.ts` — `getLogoUrl()` (Clearbit, high-res) and `getFallbackLogoUrl()` (Google Favicons fallback)
- `src/components/shared/BundleCard.tsx` — Bundle card with RTL text support, in-cart visual state
- `src/components/motion/ScrollReveal.tsx` — Reusable scroll-triggered animation components (ScrollReveal, StaggerContainer, StaggerItem)
- `src/lib/motion.ts` — Centralized motion system: durations, easings, variants (fadeUp, fadeIn, scaleIn, slideIn)
- `src/hooks/use-cart.tsx` — Cart context with localStorage persistence, isInCart helper
- `src/hooks/use-scroll-to-top.tsx` — Scroll restoration on route changes
- `src/components/layout/Navbar.tsx` — Nav with scroll-aware opacity, cart active state, mobile WhatsApp icon
- `src/components/layout/BottomNav.tsx` — Mobile nav with cart item count badge
- `src/components/layout/Footer.tsx` — Footer with mobile bottom padding for bottom nav overlap
- `src/utils/whatsapp.ts` — WhatsApp checkout link generator
- `src/data/products.json` — Product catalog seed data (59 products, now in PostgreSQL)
- `src/data/bundles.json` — Bundle packages seed data (Arabic, now in PostgreSQL)
- `src/data/settings.json` — Site settings seed data (now in PostgreSQL)

Data source: All product, bundle, and settings data now served from PostgreSQL via the API server. JSON files retained as seed source only.
WhatsApp number: 96176171003 (from database via API)

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/products.ts` — products table (id, name, description, category, duration, accountType, price, features, imageUrl, featured, hot)
- `src/schema/bundles.ts` — bundles table (id, name, description, price, originalPrice, duration, features)
- `src/schema/orders.ts` — orders table (id, items jsonb, total, customerNote, status, createdAt)
- `src/schema/settings.ts` — settings key-value table (key, value jsonb)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

- `src/seed.ts` — Seeds database from JSON files in bundlyplus/src/data/ (products, bundles, settings). Run: `pnpm --filter @workspace/scripts run seed`
