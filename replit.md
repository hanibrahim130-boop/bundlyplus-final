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
- **State**: React Context (cart, wishlist), localStorage persistence with Firestore sync when signed in
- **UI Components**: shadcn/ui (accordion, toast, tooltip)
- **Animations**: Framer Motion
- **Design**: Soft pastel gradients (peach-lavender-pink), glassmorphism cards, full dark/light mode
- **Theme**: ThemeProvider (`src/lib/theme.tsx`) with localStorage persistence + system preference detection; toggle in Navbar
- **i18n**: `src/lib/i18n.tsx` — bilingual EN/AR with RTL support, persists to localStorage

#### Authentication (Clerk + Firebase Auth)

- **Customer auth**: Clerk (Replit-managed) — email + Google + Apple sign-in.
  - `ClerkProvider` wraps the app in `src/App.tsx` with `buildClerkAppearance()` from `src/lib/clerk-appearance.ts`.
  - Localized for Arabic via `@clerk/localizations` (`arSA` / `enUS`).
  - Routes `/sign-in/*?` and `/sign-up/*?` render Clerk's `<SignIn>` / `<SignUp>` components.
  - Clerk publishable key resolved at runtime via `publishableKeyFromHost(host)` from `@clerk/react/internal` (no env needed for dev).
  - Frontend API requests are proxied through `/api/__clerk` by `clerkProxyMiddleware` in `artifacts/api-server/src/middlewares/`.
- **Admin auth**: Firebase Auth (kept separate). Admin sign-in still uses email/password against Firebase users with the `admin` custom claim.

#### Firestore Collections

- `users/{clerkUserId}` — `{ email, fullName, phone, preferredLang, preferredCurrency, wishlist: string[], cart: CartItem[], createdAt, updatedAt }`. Doc ID equals the Clerk user ID.
- `orders/{orderId}` — `{ userId, userEmail, userName, userPhone, items: OrderItem[], totalPriceUsd, status: pending|confirmed|delivered|cancelled, whatsappOpened, createdAt, updatedAt, deliveredAt? }`.
- `subscriptions/{subId}` — `{ userId, orderId, productName, productId, durationLabel, durationDays, startDate, expiryDate, status: active|expired|cancelled, reminderSentAt?, createdAt }`.
- `products/{productId}` — managed by admin (existing).

#### Account Pages

- `/account` — profile (name, email, phone, currency + language preference).
- `/account/subscriptions` — active/expired plans with "Renew on WhatsApp" CTA.
- `/account/orders` — order history with status badges and line items.
- All account routes are gated by Clerk's `<SignedIn>` — signed-out users are redirected to `/sign-in`.

#### Cart & Wishlist Sync

- `src/hooks/use-cart.tsx` and `src/hooks/use-wishlist.tsx` — when signed in, merge localStorage with Firestore on first load (deduped union), then debounced-push subsequent changes to `users/{id}.cart` / `.wishlist`. Sign-out reverts to localStorage-only.
- Checkout (`src/pages/Cart.tsx`): for signed-in users, writes a pending order to Firestore via `createOrder()` first, then opens WhatsApp with the order ref appended (`#XXXXXXXX`).

#### Admin Tabs (`/admin`)

`src/pages/Admin.tsx` is a tabbed shell. Sign in with a Firebase admin user, then switch between:
- **Products** (`src/components/admin/ProductsTab.tsx`) — existing CRUD with auto-fill.
- **Orders** (`OrdersTab.tsx`) — list/filter by status; mark confirmed / delivered / cancelled. "Mark delivered" auto-creates `subscriptions` based on each order item's quantity and duration.
- **Customers** (`CustomersTab.tsx`) — searchable list of users with active sub count and order count.
- **Reminders** (`RemindersTab.tsx`) — subscriptions expiring within 3 days (computed on read, no cron). One click opens WhatsApp with a bilingual renewal message; "Mark sent" stamps `reminderSentAt`.

Reminder window constant: `REMINDER_WINDOW_DAYS = 3` in `src/lib/users-store.ts`.

#### Security Notes

- **Firestore rules** live in `artifacts/bundlyplus/firestore.rules`. They assume `request.auth.uid` matches the Clerk user ID. To enforce them in production, deploy the rules and bridge Clerk -> Firebase via either (a) a server-side Clerk -> Firebase custom-token exchange, or (b) move all customer writes through `api-server` using the Firebase Admin SDK. Until one of these bridges is in place, the rules will reject browser writes — the dev environment currently runs against permissive Firebase project rules.
- **Admin gate**: `Admin.tsx` requires both a Firebase Auth session **and** the `admin` custom claim (`getIdTokenResult().claims.admin === true`). Use `pnpm --filter @workspace/scripts run set-admin-claim` to grant the claim.
- **Order delivery is idempotent**: `deliverOrderAndCreateSubscriptions` re-checks the order status and writes subscriptions with deterministic IDs (`${orderId}_${itemIdx}_${qtyIdx}`) so concurrent admin clicks or page refreshes never create duplicate subscriptions.

Key files:
- `src/App.tsx` — Main app with routing + ClerkProvider
- `src/lib/users-store.ts` — Firestore data layer for users/orders/subscriptions/reminders (single source of truth for all collections)
- `src/lib/clerk-appearance.ts` — Branded Clerk appearance (shadcn theme + brand pinks) and Arabic localization
- `src/lib/i18n.tsx` — EN/AR translations including all `account.*` and `admin.*` keys
- `src/components/layout/Navbar.tsx` — Sign in CTA / avatar dropdown (account, subscriptions, orders, sign out)
- `src/components/layout/BottomNav.tsx` — Mobile bottom nav with account icon when signed in
- `src/pages/Cart.tsx` — Shopping cart with Firestore order draft + WhatsApp checkout
- `src/utils/whatsapp.ts` — WhatsApp message builder (accepts optional order ref)

Data source: Products / bundles / settings come from PostgreSQL via the API server. Users / orders / subscriptions live in Firestore.
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
- `src/firestore-seed.ts` — Seeds Firestore (products, bundles, settings, promotions)
- Run: `pnpm --filter @workspace/scripts run seed`

## Admin: scheduling a discount popup

The homepage discount popup is driven by a `promotions` collection in Firestore. To schedule a new offer:

1. Sign in at `/admin` with a Firebase user that has the `admin` custom claim.
2. Click the **Promotions** tab, then **New Promotion**.
3. Fill in the badge title, discount label (e.g. `15% OFF`), bilingual body text, start/end dates, CTA copy/link, and pick a background gradient. Use **Auto-fill** to start from a 15% OFF template that runs for two weeks.
4. Make sure **Enabled** is toggled on, then **Create promotion**.

The popup automatically reads the latest enabled promotion whose date range covers `now`. Status badges in the admin list show whether each entry is **Scheduled**, **Live**, **Expired**, or **Disabled**. Visitors who dismiss the popup won't see it again for 24 hours, scoped per promotion ID — editing a live promotion's text will not re-spam dismissed visitors, but creating a brand-new promotion will.
