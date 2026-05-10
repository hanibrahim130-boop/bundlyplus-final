# Accessibility audit — May 2026

## Scope

- Target: `artifacts/bundlyplus/src/` (the customer-facing SPA).
- Standard: WCAG 2.2 Level AA.
- Tool: [`a11y-audit`](https://github.com/alirezarezvani/claude-skills) Kiro skill (rules-based static scanner).
- Manual verification: Skip-link keyboard behaviour, heading order on Cart + Account pages, Clerk sign-in/sign-up page h1.

## Fixes landed

| # | WCAG | Severity | Fix |
|---|------|----------|-----|
| 1 | 2.4.1 Bypass Blocks | Critical | Added `<a href="#main-content">Skip to main content</a>` before the `<Navbar>` in `App.tsx`. Styled via Tailwind `sr-only focus:not-sr-only focus:fixed` so it only appears on keyboard focus. The `<main>` landmark now has `id="main-content"` so the skip link jumps to it. |
| 2 | 1.3.1 Info and Relationships | Critical | Added an `sr-only` `<h1>` to `SignIn.tsx` and `SignUp.tsx` (Clerk controls don't expose a page-level heading). |
| 3 | 1.3.1 Info and Relationships | Major | `Cart.tsx` heading skip h1 → h3 resolved by promoting the cart-item title and order summary to `<h2>`. `AccountSubscriptions.tsx` subscription item title was promoted to `<h2>` for the same reason. |

## Findings deliberately left as-is

- `Footer.tsx`, `Navbar.tsx`, `UserMenu.tsx` use `<img alt="">` next to visible brand text. Under WCAG 1.1.1 this is correct — the text already names the brand, so a duplicate alt would be redundant noise for screen readers.
- `Admin.tsx` has three conditional-state h1s (not-authorized, sign-in form, admin shell). Only one renders at a time; the static scanner can't track that.
- `Home.tsx` has no local `<h1>`. The hero component it composes (`Hero.tsx:188`) carries the page h1.
- False positives from the file-at-a-time scanner on `hooks/`, `lib/`, `components/ui/*`: these files are not pages and don't need their own `<main>`, `<nav>`, or skip link.

## Remaining real findings (to triage later)

- `components/ui/alert.tsx`, `field.tsx`, `spinner.tsx` — `aria-live` missing on Radix-derived primitives. Vendored source; patching upstream or wrapping with an `aria-live="polite"` region at the call site is preferred over editing the primitives.
- `components/ui/breadcrumb.tsx` — `link-bad-text` finding (placeholder "here"-style link).
- `components/IntroSplash.tsx` — `aria-live` missing on the splash text.

Tracking issue: open when/if we adopt the `senior-frontend` skill to sweep UI primitives.

## How to rerun the scan

```pwsh
python "$env:USERPROFILE\.kiro\skills\a11y-audit\scripts\a11y_scanner.py" `
  "artifacts\bundlyplus\src" --json > a11y-scan.json
```

Filter out the file-at-a-time noise rules (`landmark-no-main`, `landmark-no-nav`,
`landmark-no-skip-link`) when reviewing output — those fire on every non-page
file and are handled once at the shell level (`App.tsx`).

## What's next

- Add the a11y scan to CI once the scanner supports a baseline-diff mode so the
  pipeline only fails on *new* violations.
- Run a manual keyboard-navigation pass on Cart + Admin (the two forms-heavy
  pages) once the Clerk test-mode is set up.
- Capture axe-core results against the built site via Playwright
  (`@axe-core/playwright`) and gate on zero critical violations.
