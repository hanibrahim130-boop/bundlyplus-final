# API Server Hosting (Replit Deployments → bundlyplus.com)

This walks through hosting the Express `api-server` on Replit Deployments and
wiring the Vercel-hosted `bundlyplus.com` frontend to call it. Once it's done,
**Admin → Analytics** on the live site shows real PostHog KPIs instead of the
"Server-side KPIs not configured" placeholder.

## Architecture

| Piece | Host | URL shape |
| --- | --- | --- |
| `bundlyplus` (Vite SPA) | Vercel | `https://bundlyplus.com` |
| `api-server` (Express) | Replit Deployments (autoscale) | `https://<repl-slug>.replit.app/api/*` |

Replit autoscale deploys the **whole workspace**, so when you publish, both
`bundlyplus` and `api-server` go up under one URL with path-based routing
(frontend at `/`, api at `/api/*`). The Vercel site only consumes `/api/*` from
the Replit URL — everything else is served by Vercel.

The frontend reads `VITE_API_BASE_URL` at build time. When set, every `/api/*`
fetch gets prefixed with that URL; when unset, calls go to the same origin
(useful for the Replit dev preview where both run together).

## One-time setup

### 1. Set Replit Secrets for the api-server

In Replit → **Secrets** (workspace level), add:

| Secret | Required for | Notes |
| --- | --- | --- |
| `POSTHOG_PERSONAL_API_KEY` | live KPIs | PostHog → Personal API key (read access). Never expose to the browser. |
| `POSTHOG_PROJECT_ID` | live KPIs | Numeric project id from your PostHog project URL. |
| `POSTHOG_HOST` | optional | Defaults to `https://us.posthog.com`. Set to `https://eu.posthog.com` if your project lives in the EU region. |
| `CLERK_PUBLISHABLE_KEY` | future authenticated endpoints | Already set if Clerk is wired in dev. Same value as `VITE_CLERK_PUBLISHABLE_KEY` in dev; use the prod `pk_live_*` key once published. |

Replit Secrets are encrypted at rest and never committed to git — set them
through the Secrets pane, not in `.replit` or any TOML.

### 2. Publish the workspace

From the **main** workspace (not a task agent session), open the **Publishing**
tool and click **Publish**. The deployment uses the settings already in
`artifacts/api-server/.replit-artifact/artifact.toml`:

```toml
[services.production.build]
args = ["pnpm", "--filter", "@workspace/api-server", "run", "build"]

[services.production.run]
args = ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]

[services.production.run.env]
PORT = "8080"
NODE_ENV = "production"

[services.production.health.startup]
path = "/api/healthz"
```

The deployment is `autoscale` (set in `.replit`) — the server only spins up
when requests arrive, which is the right shape for an analytics-only API.

After publish, note the public URL (e.g. `https://bundlyplus.replit.app`).
Verify it's live:

```bash
curl https://<your-repl>.replit.app/api/healthz
# → {"status":"ok"}

curl 'https://<your-repl>.replit.app/api/analytics/kpis?days=7'
# → JSON with real counts when POSTHOG_* secrets are set
```

### 3. Point bundlyplus.com at the Replit api-server

In **Vercel → Project Settings → Environment Variables**, add for the
**Production** (and optionally **Preview**) environment:

| Var | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://<your-repl>.replit.app` (no trailing slash) |

Trigger a redeploy on Vercel so the new build picks up the env var. After it
lands:

1. Open `https://bundlyplus.com/admin` and sign in.
2. Click the **Analytics** tab.
3. The "Last 7 days" card should show real counts and conversion ratios. The
   "Server-side KPIs not configured" hint should be gone.

If you still see the "not configured" hint:

- The browser is talking to the api-server (otherwise you'd see a network
  error) — but the server doesn't have `POSTHOG_PERSONAL_API_KEY` /
  `POSTHOG_PROJECT_ID`. Re-check Replit Secrets and republish.

If you see a network/CORS error in the browser console:

- Confirm `VITE_API_BASE_URL` is set on Vercel and the build was redeployed.
- Confirm the Replit deployment is reachable (`/api/healthz` returns ok).
- The api-server already sets `cors({ credentials: true, origin: true })` —
  that reflects the request origin, so any caller is allowed. There is no
  origin allow-list to update.

## Local dev

In Replit dev, both artifacts run in the same workspace and the bundlyplus dev
server talks to the api-server through the path-based router at `/api/*`. Leave
`VITE_API_BASE_URL` unset locally — `apiUrl()` falls back to `BASE_URL`.

## Adding new server endpoints

Any new endpoint added to `artifacts/api-server/src/routes/` is automatically
exposed at `https://<your-repl>.replit.app/api/<path>` after the next publish.
On the frontend, call it through `apiUrl('/api/your-route')` from
`@/lib/api-base` so it works in both dev (same-origin) and prod (Vercel →
Replit cross-origin).
