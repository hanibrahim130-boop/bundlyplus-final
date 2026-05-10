# Performance notes

## Bundle strategy (as of May 2026)

### Critical path

The customer-facing SPA lives in `artifacts/bundlyplus`. Chunks that ship on
the first pageview:

| Chunk | ~ KB minified | Why it's eager |
| --- | --- | --- |
| `index-*.js` | 652 | App shell: routing, layout, i18n, theme, Clerk shell. |
| `vendor-react` | 13 | React + react-dom + wouter. |
| `vendor-firebase-app` | 256 | Firestore client (products, settings, promotions all hydrate from it on the home page). |
| `vendor-motion` | 120 | Framer Motion — animations on the navbar, intro splash, hero. |
| `vendor-ui` | 78 | lucide-react + Radix tooltip/toast. |
| `vendor-analytics` | 184 | posthog-js — loaded fire-and-forget, but parsed on first navigation. |

### Lazy chunks

Loaded only when the user lands on or triggers the relevant flow:

| Chunk | ~ KB | Trigger |
| --- | --- | --- |
| `vendor-firebase-auth` | 124 | `useFirebaseBridge` on signed-in Clerk sessions, plus the admin panel email/password sign-in. |
| `Admin-*.js` | 73 | `/admin` route. |
| `Cart-*.js` | 15 | `/cart` route. |
| `Testimonials-*`, `FAQ-*` | 7–8 | Below-the-fold sections on the home page. |
| Privacy / Terms / RefundPolicy / Contact | 6–10 each | Per-route. |
| Sign-in / Sign-up | 2 each | Route-level lazy. |

## Chunking decisions

Defined in `artifacts/bundlyplus/vite.config.ts`:

```ts
manualChunks: {
  "vendor-react": ["react", "react-dom", "wouter"],
  "vendor-firebase-app": ["firebase/app", "firebase/firestore"],
  "vendor-firebase-auth": ["firebase/auth"],   // lazy
  "vendor-motion": ["framer-motion"],
  "vendor-ui": ["lucide-react", "@radix-ui/react-tooltip", "@radix-ui/react-toast"],
  "vendor-analytics": ["posthog-js"],
}
```

- **Firebase auth split**: `use-firebase-bridge.ts` guards the `firebase/auth`
  import behind a Clerk signed-in check and uses dynamic `import()`.
  Anonymous visitors never download the auth SDK.
- **Analytics split**: PostHog is 184 KB. Isolating it into its own chunk
  means anti-tracking tooling (adblockers, DNT) that blocks the posthog
  endpoint skips parsing that code entirely.
- **Motion stays eager**: Framer Motion is used by the navbar's scroll
  behaviour and the intro splash, both of which render on every route.
  Further savings would require replacing specific animations with CSS.

## CI budget

`.github/workflows/ci.yml` fails the build if
`artifacts/bundlyplus/dist/public/assets/index-*.js` exceeds 800 KB
minified. Current size is 652 KB, so there's ~150 KB headroom.

Tighten the budget whenever a clean win lands (see backlog below).

## Backlog

Wins we know are available but haven't shipped:

1. **LazyMotion for framer-motion** (~50 KB). `framer-motion` ships a
   legacy animation surface that `LazyMotion` + `m.div` can strip. Needs a
   component-level audit of every `motion.*` call site.
2. **Clerk code-split on route boundary**. Clerk's React bindings (~200 KB)
   currently land in the main chunk. Wrapping `<ClerkProvider>` in a
   dynamic import + `<Suspense>` behind the routes that actually render
   Clerk UI (sign-in, sign-up, account) would move most of it off the
   critical path. Risk: the shell auth state checks need to wait for the
   provider, so the nav would briefly lack signed-in affordances.
3. **Tree-shake `@radix-ui/react-*` to the specific components used**.
   Current `vendor-ui` bundles tooltip + toast primitives; several routes
   only need one or the other.
4. **Switch `lucide-react` to on-demand imports**. We currently import
   individual icons by name, so Rollup tree-shakes most of them, but a
   lucide subset plugin or svg-to-component codegen would save another
   20–30 KB.
5. **Prerender preload hints**. The prerender script outputs static HTML
   for every route but the `<link rel="modulepreload">` tags are inserted
   for the shell's index-*.js only. Adding preloads for the matching
   route chunk would reduce the critical path on deep-linked navigation.

## How to measure

```pwsh
$env:PORT="3000"; $env:BASE_PATH="/"; pnpm --filter @workspace/bundlyplus run build
Get-ChildItem artifacts/bundlyplus/dist/public/assets -Filter "*.js" |
  Sort-Object Length -Descending |
  Select-Object Name, @{n='KB';e={[math]::Round($_.Length/1024, 1)}}
```

For a quick gzip check:

```pwsh
$main = Get-ChildItem "artifacts/bundlyplus/dist/public/assets/index-*.js" | Select-Object -First 1
[IO.File]::ReadAllBytes($main.FullName).Length
```
