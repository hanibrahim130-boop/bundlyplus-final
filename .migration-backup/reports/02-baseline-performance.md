# Phase 2 — Baseline Performance Report
**Agent 2: Performance Profiler**
**Date**: 2026-04-29

---

## Build & Toolchain Status

| Check | Status | Notes |
|---|---|---|
| Package Manager | pnpm (workspace monorepo) | Platform-specific overrides for esbuild/rollup |
| Install | Not run locally (Windows) | pnpm workspace configured |
| TypeCheck | `tsc -p tsconfig.json --noEmit` available | — |
| Build | `vite build` available | Output: `artifacts/bundlyplus/dist/public` |
| Lint | No eslint config detected | — |
| Tests | No test framework detected | — |
| Lighthouse | Cannot run locally (no dev server) | Analysis based on code inspection |

## Top 10 Performance Issues (Ranked by Mobile Impact)

### 1. 🔴 CRITICAL — Massive blur compositing on mobile
**Files**: `Background.tsx`, `Hero.tsx`, `index.css`
**Impact**: Directly causes 60fps → <15fps on mobile

6 simultaneous blur layers:
- `Background.tsx`: 3 blobs with `blur-[100px]` to `blur-[140px]` + CSS `animation: blob-drift` infinite
- `Hero.tsx`: 3 blobs with `blur-3xl` (48px) + Framer Motion infinite translate/scale
- All on large elements (50-65vw) — GPU must re-composite every frame

**Estimated mobile FPS drop**: 30-45fps loss

### 2. 🔴 CRITICAL — backdrop-blur on scroll-attached fixed elements
**Files**: `Navbar.tsx`, `BottomNav.tsx`, `index.css` (glass-panel, glass-card, glass-button)
**Impact**: Every scroll frame triggers re-composite of blurred backdrop

- Navbar: `backdrop-blur-xl` (24px) always visible, fixed position
- BottomNav: `glass-panel` → `backdrop-blur-xl` always visible on mobile, fixed position
- Footer: `backdrop-blur-sm` on scroll surface
- Every glass-card: `backdrop-blur-lg` (16px) — multiple cards visible simultaneously

**Estimated mobile frame budget impact**: 8-12ms per frame wasted

### 3. 🟠 HIGH — 7+ infinite CSS animations running concurrently
**File**: `index.css`
**Impact**: Continuous CPU/GPU usage even when page is idle

Active simultaneously:
- `blob-drift-1` (20s), `blob-drift-2` (25s), `blob-drift-3` (22s)
- `float-logo` (5s), `float-card` (8s), `float-card-alt` (7s)
- `glow-pulse` (3s), `shimmer` (4s)
- `marquee` (28s)
- `animate-ping` and `animate-pulse` from Tailwind

### 4. 🟠 HIGH — Framer Motion infinite animations in Hero
**File**: `Hero.tsx`
**Impact**: JS-driven animation loop on 5 elements (3 blobs + 2 marquees)

- 3 aurora blobs: `animate={{ x: [...], y: [...], scale: [...] }}` with `repeat: Infinity`
- 2 marquee rows: `animate={{ x: ['-50%', '0%'] }}` with `repeat: Infinity`
- All compute in JS → main thread blocking

### 5. 🟠 HIGH — Firebase unused imports inflating bundle
**File**: `firebase.ts`
**Impact**: ~100-150KB unused JS

`firebase/auth` imported (`getAuth`) but auth is never used in the frontend flow. Firebase SDK is heavy — each module adds significant bundle weight.

### 6. 🟡 MEDIUM — Full Framer Motion bundle
**File**: `App.tsx`, all motion components
**Impact**: ~120KB gzipped

No `LazyMotion` / `domAnimation` used. Full motion features loaded for simple opacity/transform animations.

### 7. 🟡 MEDIUM — Duplicate Google Fonts loading
**Files**: `index.html` (line 11), `index.css` (line 1)
**Impact**: Double network requests, render-blocking CSS

- `index.html`: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`
- `index.css`: `@import url('...family=Cairo:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap')`
- Different weights requested in each = even more font files downloaded

### 8. 🟡 MEDIUM — CommandPalette eager data fetch
**File**: `CommandPalette.tsx`
**Impact**: Unnecessary Firestore read on every page load

`useProducts()` called on mount even though palette is rarely opened. Should defer fetch until palette opens.

### 9. 🟡 MEDIUM — ProductCard re-renders
**File**: `ProductCard.tsx`
**Impact**: Unnecessary DOM reconciliation

Each ProductCard uses `motion.div` with `initial={{ opacity: 0, y: 20 }}` / `animate={{ opacity: 1, y: 0 }}` — re-triggers animation on every parent re-render. No `React.memo`.

### 10. 🟢 LOW — No meta tags for SEO/social
**File**: `index.html`
**Impact**: Poor social sharing, no description for search engines

Missing: `<meta name="description">`, Open Graph tags, Twitter cards.

## Recommended Fix Order

1. Simplify/disable blur blobs on mobile (items 1, 3)
2. Remove backdrop-blur from fixed elements on mobile (item 2)
3. Disable Framer Motion infinite animations on mobile (item 4)
4. Remove unused firebase/auth import (item 5)
5. Fix duplicate font loading (item 7)
6. Defer CommandPalette data loading (item 8)
7. Memoize ProductCard (item 9)
8. Add meta tags (item 10)
9. Add LazyMotion (item 6) — lower risk/reward

## Target Metrics

| Metric | Current (estimated) | Target |
|---|---|---|
| Mobile LCP | ~3.5-4.5s | < 2.5s |
| Mobile INP | ~300-500ms | < 200ms |
| Mobile CLS | ~0.05-0.15 | < 0.1 |
| Mobile FPS (scroll) | ~15-30fps | 50-60fps |
| JS Bundle (initial) | ~800KB+ | < 500KB |
| Render-blocking resources | 3+ | 0-1 |
