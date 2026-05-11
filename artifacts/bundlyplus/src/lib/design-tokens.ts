/**
 * BundlyPlus design tokens — Apple-style, light-first with dark override.
 *
 * These are the raw values that back the CSS variables declared in
 * `src/index.css`. Import them in TS/React code when you need a raw
 * hex or need to compute a variant programmatically; otherwise use the
 * CSS variables so the light / dark toggle continues to work.
 *
 * Sourced from the design spec produced during the Apple-style rebuild:
 *   - Inspired by apple.com's 2024 marketing pages (white space, slim
 *     type, 12px radii on cards, 999px pills on CTAs, hairline borders)
 *   - Brand hot-pink (#EC4899) kept as the only saturated accent
 *   - Category hues spaced ~30° apart for visual variety while still
 *     meeting WCAG AA contrast on both themes
 */

export const appleColors = {
  // Light palette
  light: {
    bg: "#FFFFFF",
    bgSoft: "#FBFBFD",
    bgMuted: "#F5F5F7",
    surface: "#FFFFFF",
    surfaceMuted: "#F5F5F7",
    textPrimary: "#1D1D1F",
    textSecondary: "#6E6E73",
    textTertiary: "#86868B",
    border: "rgba(0,0,0,0.08)",
    hairline: "rgba(0,0,0,0.12)",
    divider: "#D2D2D7",
  },

  // Dark palette
  dark: {
    bg: "#000000",
    bgSoft: "#0B0B0D",
    bgMuted: "#1D1D1F",
    surface: "#1D1D1F",
    surfaceMuted: "#2C2C2E",
    textPrimary: "#F5F5F7",
    textSecondary: "#A1A1A6",
    textTertiary: "#86868B",
    border: "rgba(255,255,255,0.1)",
    hairline: "rgba(255,255,255,0.14)",
    divider: "#2C2C2E",
  },
} as const;

export const brandPink = {
  50: "#FDF2F8",
  100: "#FCE7F3",
  200: "#FBCFE8",
  300: "#F9A8D4",
  400: "#F472B6",
  500: "#EC4899",
  600: "#DB2777",
  700: "#BE185D",
  800: "#9D174D",
  900: "#831843",
} as const;

export const typography = {
  display: "'Inter Tight', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  arabic: "'Cairo', 'Inter', system-ui, sans-serif",

  // Sizes (rem). Use clamp() in CSS for fluid hero type.
  sizes: {
    caption: "0.8125rem",   // 13px
    small: "0.875rem",      // 14px
    body: "1rem",           // 16px
    bodyLg: "1.0625rem",    // 17px
    lead: "1.25rem",        // 20px
    h4: "1.5rem",           // 24px
    h3: "1.875rem",         // 30px
    h2: "2.5rem",           // 40px
    h1: "3.5rem",           // 56px
    displaySm: "4.5rem",    // 72px
    displayLg: "6rem",      // 96px
  },

  // Tracking
  tracking: {
    headline: "-0.04em",
    display: "-0.025em",
    body: "-0.011em",
    caption: "0",
    overline: "0.08em",
  },

  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  // Apple's content rails
  contentMax: "1440px",
  contentStd: "1024px",
  contentNarrow: "720px",

  // Typical page gutters
  gutterMobile: "1.25rem",
  gutterTablet: "2rem",
  gutterDesktop: "3rem",

  // Nav height
  navHeight: "48px",
} as const;

export const radii = {
  xs: "0.375rem",  // 6px  — chips, tiny pills
  sm: "0.625rem",  // 10px — inputs
  md: "0.875rem",  // 14px — small cards
  lg: "1.125rem",  // 18px — primary cards
  xl: "1.5rem",    // 24px — hero panels
  "2xl": "2rem",   // 32px — big marketing surfaces
  pill: "999px",   // button pills
} as const;

export const motion = {
  /** Apple's signature easing. Close to Material "emphasised decelerate". */
  easeApple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",

  duration: {
    instant: "120ms",
    fast: "200ms",
    standard: "300ms",
    slow: "600ms",
    elegant: "900ms",
  },

  scale: {
    hover: 1.02,
    press: 0.98,
  },
} as const;

export const glass = {
  light: {
    bg: "rgba(255,255,255,0.72)",
    border: "rgba(0,0,0,0.08)",
    blur: "saturate(180%) blur(20px)",
  },
  dark: {
    bg: "rgba(29,29,31,0.72)",
    border: "rgba(255,255,255,0.1)",
    blur: "saturate(180%) blur(20px)",
  },
} as const;

export const shadows = {
  hairline: "0 0 0 1px rgba(0,0,0,0.06)",
  xs: "0 1px 2px rgba(0,0,0,0.04)",
  sm: "0 2px 6px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
  md: "0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
  lg: "0 20px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
  hover: "0 12px 32px rgba(0,0,0,0.08)",
  darkMd: "0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
  darkHover: "0 12px 32px rgba(0,0,0,0.5)",
} as const;

export type AppleColorTokens = typeof appleColors;
export type BrandPinkScale = typeof brandPink;
