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

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed` — seed database from JSON files

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
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.mjs`)

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

Key files:
- `src/App.tsx` — Main app with routing (Home, Products, Bundles, Cart, 404)
- `src/pages/Home.tsx` — Homepage with Hero, Featured Products, WhyChooseUs, Pricing, Testimonials, FAQ
- `src/pages/Products.tsx` — Product catalog with search and category filters
- `src/pages/Bundles.tsx` — Bundle packages (Arabic content with RTL support)
- `src/pages/Cart.tsx` — Shopping cart with WhatsApp checkout
- `src/components/home/Hero.tsx` — Animated hero with rotating word, aurora gradient, subscription card marquee
- `src/hooks/use-cart.tsx` — Cart context with localStorage persistence
- `src/lib/settings.ts` — React Query hook for settings (fetches from API)
- `src/lib/brand-theme.ts` — Brand gradient maps and utilities
- `src/utils/logoUtils.ts` — Logo URL helpers (Clearbit + Google Favicons fallback)

Data source: All product, bundle, and settings data served from PostgreSQL via the API server.
WhatsApp number: 96176171003 (from database via API)

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/products.ts` — products table
- `src/schema/bundles.ts` — bundles table
- `src/schema/orders.ts` — orders table
- `src/schema/settings.ts` — settings key-value table
- `drizzle.config.ts` — requires `DATABASE_URL` (automatically provided by Replit)

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec (`openapi.yaml`) + Orval codegen config. Run `pnpm --filter @workspace/api-spec run codegen` to regenerate client hooks and Zod schemas.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for validation.

### `scripts` (`@workspace/scripts`)

- `src/seed.ts` — Seeds database from JSON files in bundlyplus/src/data/ (products, bundles, settings)
- Run: `pnpm --filter @workspace/scripts run seed`
