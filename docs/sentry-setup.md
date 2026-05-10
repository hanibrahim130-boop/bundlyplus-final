# Sentry error monitoring

Both the `bundlyplus` frontend and the `api-server` ship Sentry wiring.
It is opt-in via env vars — set them on the host and both surfaces start
reporting; leave them unset and both surfaces no-op.

## Environment variables

| Var | Surface | Required | Purpose |
| --- | --- | --- | --- |
| `VITE_SENTRY_DSN` | frontend (browser) | no (no-ops without) | DSN for the browser SDK. |
| `VITE_SENTRY_ENVIRONMENT` | frontend | no | `production`, `preview`, `dev`. Defaults to `production` in built output and `dev` in dev. |
| `VITE_SENTRY_RELEASE` | frontend | no | Release identifier (usually the git SHA). Vercel sets `VERCEL_GIT_COMMIT_SHA` — wire that in. |
| `SENTRY_DSN` | api-server | no | DSN for the Node SDK. |
| `SENTRY_ENVIRONMENT` | api-server | no | Same semantics as the frontend. |
| `SENTRY_RELEASE` | api-server | no | Same semantics as the frontend. |

**Important:** use two separate Sentry projects — one "frontend" and one
"api-server" — rather than a shared project. Sentry's rate limits and
alert routing are per-project; mixing the two makes it impossible to
tell a client-side promise rejection from a server-side database error
at a glance.

## What we send

### Frontend (`artifacts/bundlyplus/src/lib/sentry.ts`)

- Uncaught JS errors and unhandled promise rejections.
- React render errors caught by `SentryErrorBoundary` in `App.tsx`.
  The user sees the `GlobalErrorFallback` component; Sentry gets the
  component stack.
- 10% of navigation traces (`tracesSampleRate: 0.1`). No session replays.
- The Clerk user id on sign-in (via `setSentryUser(user.id)`), reset on
  sign-out. **No email, name, or IP is attached.**

### API server (`artifacts/api-server/src/lib/sentry.ts`)

- Uncaught exceptions and unhandled rejections. Initialised in
  `index.ts` **before** `app.ts` imports Express, so the SDK hooks
  global error handlers first.
- Every 5xx response thrown by an Express route via
  `Sentry.setupExpressErrorHandler(app)` in `app.ts`. 4xx responses are
  ignored by default.
- 10% of request traces.
- `beforeSend` scrubs `Authorization` and `Cookie` headers as defence in
  depth on top of Pino's `redact` list.

## Privacy posture (intentional)

Both SDKs are configured with:

- `sendDefaultPii: false` — no IP addresses, cookies, or request bodies.
- `replaysSessionSampleRate: 0` and `replaysOnErrorSampleRate: 0` on the
  frontend — session replay is disabled entirely.
- Ignored client errors: `ResizeObserver loop`, non-`Error` rejections,
  `publishableKey` missing (Clerk preview builds), and network failures
  (`Failed to fetch` / `NetworkError`). These are either third-party
  noise or caused by the user going offline.

## Activating in production

1. Create two Sentry projects: one of type "React" for the frontend and
   one of type "Node" for the api-server.
2. Copy the DSNs into the matching env vars:
   - Vercel → Project Settings → Environment Variables → add
     `VITE_SENTRY_DSN`, `VITE_SENTRY_ENVIRONMENT=production`,
     `VITE_SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA`.
   - Replit → Secrets → add `SENTRY_DSN`, `SENTRY_ENVIRONMENT`,
     `SENTRY_RELEASE` (set release in your deploy script).
3. Redeploy both surfaces.
4. Smoke-test by throwing a test error: add `throw new Error("sentry-test")`
   in `App.tsx` inside the Router component for one render; once it
   appears in the Sentry issues list, remove the line and redeploy.

## Alert routing (recommended starting point)

Per the `observability-designer` skill's golden-signals framework —
start with two pages, both wired to a single on-call channel:

1. **Frontend project:** new issue with event count ≥ 5 in 5 min on
   `production` environment → page.
2. **API-server project:** new issue **at all** on `production`
   environment → page. Server-side errors block customer-facing flows
   so tolerance is lower.

Add burn-rate alerts once there's enough traffic to set meaningful SLOs.

## Backlog

- Wire `release` sourcemaps upload to the Vercel and Replit build steps
  so the dashboard shows original stack traces instead of minified ones.
- Consider migrating `/api/auth/firebase-token` and
  `/api/analytics/kpis` to a custom `captureException` handler that
  adds a `route` tag, so alert filters are more granular.
- Add a Playwright error-boundary smoke test that deliberately throws a
  render error and asserts `GlobalErrorFallback` renders.
