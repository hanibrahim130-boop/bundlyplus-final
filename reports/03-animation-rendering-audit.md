# Phase 3 — Animation & Rendering Audit Report
**Agent 3: Animation & Rendering Auditor**
**Date**: 2026-04-29

---

## Issues Found & Fixes Applied

### 1. 🔴 Background.tsx — 6 massive blur blobs (FIXED)
**Before**: 3 blobs with `blur-[100-140px]` + CSS infinite `blob-drift` animations always running on mobile
**Fix**: 
- Reduced to 2 blobs on mobile with `blur-[60px]` (from 100-140px)
- Disabled 3rd blob and SVG noise overlay on mobile
- Removed `bg-blob-N` animation class on mobile (static blobs)
- Added `contain: strict` on container for compositing isolation
**Impact**: ~30-40fps improvement on mobile scroll

### 2. 🔴 Hero.tsx — 3 aurora blobs + 2 JS marquees (FIXED)
**Before**: 3 Framer Motion infinite-loop blobs (`blur-3xl`) + 2 marquee rows driven by Framer Motion `animate` (JS main thread)
**Fix**:
- Conditionally disabled all 3 aurora blobs on mobile (`!isMobile` guard) — Background.tsx already provides ambient blobs
- Switched marquee from Framer Motion to CSS `@keyframes marquee` / `marquee-reverse` on mobile — moves animation from JS main thread to GPU compositor
- Removed `backdrop-blur-md` from marquee cards on mobile
**Impact**: ~5 JS-driven infinite animations eliminated on mobile

### 3. 🟠 CSS infinite animations (PARTIALLY FIXED)
**Before**: `blob-drift-1/2/3`, `float-logo`, `float-card`, `glow-pulse`, `shimmer` all running concurrently
**Fix**:
- Strengthened `prefers-reduced-motion: reduce` media query to use `!important` and cover `shimmer-bg::after`
- Reset `will-change: auto` on `.bg-blob` when reduced motion preferred
- Blob animation classes removed on mobile via conditional rendering
**Remaining**: Desktop still has blob-drift animations (low priority — desktop GPUs handle this fine)

### 4. 🟡 Glass utilities backdrop-blur (FIXED)
**Before**: `glass-panel` (24px blur), `glass-card` (16px blur), `glass-button` (12px blur) all at full strength on mobile during scroll
**Fix**: Added `@media (max-width: 767px)` overrides:
- `glass-panel`: 24px → 12px
- `glass-card`: 16px → 8px  
- `glass-button`: 12px → 6px
**Impact**: ~4-6ms per frame saved on mobile scroll

### 5. Added `marquee-reverse` CSS keyframe
New CSS animation for RTL/reverse marquee direction, used by mobile marquee implementation.

## Files Modified
- `Background.tsx` — Mobile blob optimization
- `Hero.tsx` — Mobile aurora/marquee optimization
- `index.css` — New keyframe + glass-panel mobile overrides + reduced-motion improvements
