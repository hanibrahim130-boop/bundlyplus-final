# Workspace

## Overview
This project is a pnpm monorepo using TypeScript, designed to create a digital subscription marketplace called "BundlyPlus." It consists of an Express API server and a React-based frontend. The marketplace allows users to browse, purchase, and manage digital subscriptions and bundles, with a focus on a seamless user experience, including WhatsApp integration for ordering. The project aims to provide a robust, scalable platform for digital product sales.

## User Preferences
- I prefer clear and concise communication.
- I like iterative development with frequent, small updates.
- Please ask for confirmation before making any major architectural changes or introducing new external dependencies.
- I prefer detailed explanations for complex solutions.

## System Architecture

### UI/UX Decisions
- **Styling**: Tailwind CSS v4 with a glassmorphism design, pastel gradient aesthetic (peach-lavender-pink).
- **Fonts**: Space Grotesk (display) and Inter (body).
- **UI Components**: shadcn/ui (accordion, toast, tooltip).
- **Animations**: Framer Motion.
- **Theming**: Full dark/light mode with `ThemeProvider` for persistence and system preference detection.
- **Internationalization**: Bilingual EN/AR with RTL support and localStorage persistence.

### Technical Implementations
- **Monorepo**: pnpm workspaces for managing multiple packages.
- **Node.js**: Version 24.
- **TypeScript**: Version 5.9, utilizing composite projects for efficient type-checking across packages.
- **API Server**: Express 5, with routes defined in `src/routes/` and validation via `@workspace/api-zod`.
  - **Routes**: Health check, product listing/details, bundle listing/details, public site settings, order creation.
- **Frontend (BundlyPlus)**: React + Vite, using `wouter` for client-side routing.
  - **State Management**: React Context for cart/wishlist, with localStorage persistence and Firestore synchronization for signed-in users.
  - **Authentication**: Clerk for customer authentication (email, Google, Apple sign-in) with Arabic localization; Firebase Auth for admin authentication.
  - **Account Pages**: Profile management, subscriptions, and order history, gated by Clerk's `<SignedIn>`.
  - **Cart & Wishlist Sync**: Merges localStorage with Firestore upon sign-in, debounced pushes for changes.
  - **Checkout**: Creates a pending order in Firestore then opens WhatsApp with an order reference.
  - **Admin Panel**: Tabbed interface for managing products, orders, customers, reminders, promotions, and analytics.
    - **Order Delivery**: Idempotent delivery process that creates subscriptions based on order items.
    - **Promotions**: Driven by a Firestore `promotions` collection, enabling scheduling of discount popups with customizable content and date ranges.

### System Design Choices
- **Database**: PostgreSQL with Drizzle ORM for `api-server` data (products, bundles, orders, settings).
- **NoSQL Database**: Firestore for `bundlyplus` data (users, orders, subscriptions, promotions).
- **Validation**: Zod (`zod/v4`), `drizzle-zod`.
- **API Codegen**: Orval (from OpenAPI spec) for generating React Query hooks and Zod schemas.
- **Build Tool**: esbuild for CJS bundles.
- **Analytics**: PostHog for tracking user events (`product_viewed`, `add_to_cart`, `whatsapp_checkout_clicked`, etc.), with IP anonymization and UTM super-properties.
- **Security**: Firestore rules for data access control (note: dev environment uses permissive rules, production requires a Clerk-Firebase bridge); admin panel requires Firebase Auth and an `admin` custom claim.

## External Dependencies
- **pnpm**: Monorepo management.
- **Node.js**: Runtime environment.
- **TypeScript**: Programming language.
- **Express**: API framework.
- **PostgreSQL**: Relational database.
- **Drizzle ORM**: Object-relational mapper for PostgreSQL.
- **Zod**: Schema validation library.
- **Orval**: OpenAPI client code generator.
- **esbuild**: JavaScript bundler.
- **React**: Frontend library.
- **Vite**: Frontend build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **wouter**: React routing library.
- **Clerk**: User authentication service.
- **Firebase Auth**: Google's authentication service for admin users.
- **Firestore**: NoSQL database for user-specific data.
- **shadcn/ui**: Reusable UI components.
- **Framer Motion**: Animation library.
- **PostHog**: Product analytics platform.

## Analytics (PostHog)

The `bundlyplus` web app uses PostHog for product analytics and conversion funnels. Initialization is in `artifacts/bundlyplus/src/lib/analytics.ts` and is wired from `App.tsx` via `initAnalytics()`. Identification of signed-in users runs through `AnalyticsIdentityBridge` (Clerk → `identifyUser` / `resetAnalyticsUser`).

**Privacy posture (intentional):** session recording is **off**, IP anonymization is **on** (`ip: false`), autocapture is **on**, and pageviews + pageleaves are tracked. The bilingual footer (EN + AR) carries the privacy notice (`footer.analytics`).

**Environment variables:**

| Var | Where | Required | Purpose |
| --- | --- | --- | --- |
| `VITE_POSTHOG_KEY` | bundlyplus (browser) | yes (no-ops if missing) | PostHog project API key, used to capture events from the browser. |
| `VITE_POSTHOG_HOST` | bundlyplus (browser) | no | Ingest host. Defaults to `https://us.i.posthog.com`. |
| `VITE_POSTHOG_PROJECT_URL` | bundlyplus (browser) | no | Deep link to your PostHog project (e.g. `https://us.posthog.com/project/12345`). Powers the **Open dashboard** button on the Admin → Analytics tab. |
| `POSTHOG_PERSONAL_API_KEY` | api-server (secret) | only for live admin KPIs | Personal API key used by `GET /api/analytics/kpis` to query PostHog HogQL. **Never expose to the browser.** |
| `POSTHOG_PROJECT_ID` | api-server | only for live admin KPIs | Numeric project id (visible in your PostHog project URL). |
| `POSTHOG_HOST` | api-server | no | PostHog API host. Defaults to `https://us.posthog.com`. |

If browser env vars are unset, analytics silently no-op. If server env vars are unset, the Admin → Analytics tab shows a "Server-side KPIs not configured" hint instead of numbers.

**Hosting the API server (production):** the Express api-server is deployed via
**Replit Deployments** (autoscale). Publishing the workspace puts both
`bundlyplus` (frontend at `/`) and `api-server` (at `/api/*`) behind one
`*.replit.app` URL. The Vercel-hosted `bundlyplus.com` points at it via the
`VITE_API_BASE_URL` env var (set in Vercel Project Settings → Environment
Variables → Production). When set, `apiUrl()` in `artifacts/bundlyplus/src/lib/api-base.ts`
prefixes every `/api/*` call with that URL; when unset (Replit dev preview),
calls go to the same origin. See
[`docs/api-server-deployment.md`](./docs/api-server-deployment.md) for the
end-to-end walkthrough (Replit Secrets, publish, Vercel env, verification).

**Where to view dashboards:** Admin Panel → **Analytics** tab. It shows last-7-day counts, three conversion ratios (View → Cart, Cart → WhatsApp, View → WhatsApp), the full event list, and an **Open dashboard** link to PostHog itself for deeper exploration.

**Event taxonomy** (stable names — exported as `ANALYTICS_EVENTS` from `src/lib/analytics.ts`; build PostHog funnels against these):

| Event | Properties |
| --- | --- |
| `product_viewed` | `product_id`, `product_name`, `price_usd`, `currency`, `language`, `category?`, `account_type?`, `signed_in` |
| `bundle_viewed` | `bundle_id`, `bundle_name`, `price_usd`, `original_price_usd?`, `currency`, `language`, `signed_in` |
| `add_to_cart` | `product_id`, `product_name`, `price_usd`, `currency`, `language`, `category?`, `account_type?`, `quantity`, `item_type` (`'product' \| 'bundle'`), `signed_in` |
| `cart_viewed` | `total_items`, `total_price_usd`, `currency`, `language`, `signed_in` |
| `whatsapp_checkout_clicked` | `total_items`, `total_price_usd`, `currency`, `language`, `order_ref?`, `signed_in` |
| `wishlist_added` | `product_id`, `language`, `signed_in` |
| `discount_popup_shown` / `_dismissed` / `_cta_clicked` | `promotion_id`, `promotion_title?`, `discount_label?`, `cta_path?` (cta only) |
| `currency_toggled` | `from`, `to` |
| `language_toggled` | `from`, `to` |

**Super-properties** (auto-attached to every event after first visit): `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`. Captured once on first visit via `posthog.register()` from the URL.

**Recommended PostHog funnel:** `product_viewed` → `add_to_cart` → `cart_viewed` → `whatsapp_checkout_clicked`. Break down by `language`, `currency`, or `utm_source` for segmentation.

## Auth (Clerk)

Customer auth runs through Clerk. The publishable key is sourced from
`VITE_CLERK_PUBLISHABLE_KEY` in `artifacts/bundlyplus/src/App.tsx`, routed
through Clerk's `publishableKeyFromHost(hostname, envKey)` helper before being
passed to `<ClerkProvider>`. No code change is needed to swap dev↔prod — only
the env var changes.

**Environments:**

| Environment | Where the env var lives | Expected key prefix |
| --- | --- | --- |
| Replit dev preview | Replit Secrets (`VITE_CLERK_PUBLISHABLE_KEY`) | `pk_test_*` (intentional — keeps dev users out of the prod user table) |
| Vercel Preview deployments | Vercel env (Preview) | `pk_test_*` |
| Vercel Production (`bundlyplus.com`) | Vercel env (Production) | `pk_live_*` |

**Switching the live site to production keys:** see
[`docs/clerk-production-setup.md`](./docs/clerk-production-setup.md) for the
end-to-end walkthrough (Clerk prod instance, DNS, Google/Apple OAuth, Vercel
env, verification, rollback).