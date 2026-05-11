/**
 * Category theme — maps product categories to accent colours, icons
 * and short labels. 10 hues spaced ~30° apart on the colour wheel so
 * every category has a distinct, recognisable tint on listing cards,
 * badges and hero pills. All values meet WCAG AA contrast against the
 * paired light/dark background tokens.
 *
 * Usage:
 *   const theme = getCategoryTheme(product.category);
 *   <Icon className={theme.lightText} />
 *   <div className={`${theme.lightBg} ${theme.lightText}`}>…</div>
 *
 * Category names MUST match the exact strings used in products.json:
 *   AI Tools, Business Tools, Cloud Storage, Design & Creative,
 *   Education, Gaming, Music, Productivity, Streaming, VPN & Privacy.
 */

import {
  Sparkles,
  Briefcase,
  CloudUpload,
  Palette,
  GraduationCap,
  Gamepad2,
  Music,
  ListChecks,
  PlayCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface CategoryTheme {
  /** Canonical label shown in UI (English) */
  label: string;
  /** Single-word summary used in hero pills, marquees, etc. */
  tagline: string;
  /** Base brand hex — for custom gradients, charts, icon strokes */
  hex: string;
  /** Tailwind class for light-mode background fill */
  lightBg: string;
  /** Tailwind class for light-mode text colour */
  lightText: string;
  /** Tailwind class for light-mode ring/border accent */
  lightRing: string;
  /** Tailwind class for dark-mode background fill */
  darkBg: string;
  /** Tailwind class for dark-mode text colour */
  darkText: string;
  /** Tailwind class for dark-mode ring/border accent */
  darkRing: string;
  /** Lucide icon matching the category feel */
  icon: LucideIcon;
}

const themes: Record<string, CategoryTheme> = {
  "AI Tools": {
    label: "AI Tools",
    tagline: "Intelligence",
    hex: "#7C3AED",
    lightBg: "bg-violet-50",
    lightText: "text-violet-700",
    lightRing: "ring-violet-200",
    darkBg: "bg-violet-500/10",
    darkText: "text-violet-300",
    darkRing: "ring-violet-500/25",
    icon: Sparkles,
  },
  "Streaming": {
    label: "Streaming",
    tagline: "Watch",
    hex: "#EA580C",
    lightBg: "bg-orange-50",
    lightText: "text-orange-700",
    lightRing: "ring-orange-200",
    darkBg: "bg-orange-500/10",
    darkText: "text-orange-300",
    darkRing: "ring-orange-500/25",
    icon: PlayCircle,
  },
  "Gaming": {
    label: "Gaming",
    tagline: "Play",
    hex: "#65A30D",
    lightBg: "bg-lime-50",
    lightText: "text-lime-700",
    lightRing: "ring-lime-200",
    darkBg: "bg-lime-500/10",
    darkText: "text-lime-300",
    darkRing: "ring-lime-500/25",
    icon: Gamepad2,
  },
  "Education": {
    label: "Education",
    tagline: "Learn",
    hex: "#4F46E5",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    lightRing: "ring-indigo-200",
    darkBg: "bg-indigo-500/10",
    darkText: "text-indigo-300",
    darkRing: "ring-indigo-500/25",
    icon: GraduationCap,
  },
  "Business Tools": {
    label: "Business Tools",
    tagline: "Work",
    hex: "#2563EB",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    lightRing: "ring-blue-200",
    darkBg: "bg-blue-500/10",
    darkText: "text-blue-300",
    darkRing: "ring-blue-500/25",
    icon: Briefcase,
  },
  "Productivity": {
    label: "Productivity",
    tagline: "Flow",
    hex: "#0D9488",
    lightBg: "bg-teal-50",
    lightText: "text-teal-700",
    lightRing: "ring-teal-200",
    darkBg: "bg-teal-500/10",
    darkText: "text-teal-300",
    darkRing: "ring-teal-500/25",
    icon: ListChecks,
  },
  "Music": {
    label: "Music",
    tagline: "Listen",
    hex: "#D97706",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    lightRing: "ring-amber-200",
    darkBg: "bg-amber-500/10",
    darkText: "text-amber-300",
    darkRing: "ring-amber-500/25",
    icon: Music,
  },
  "Design & Creative": {
    label: "Design & Creative",
    tagline: "Create",
    hex: "#C026D3",
    lightBg: "bg-fuchsia-50",
    lightText: "text-fuchsia-700",
    lightRing: "ring-fuchsia-200",
    darkBg: "bg-fuchsia-500/10",
    darkText: "text-fuchsia-300",
    darkRing: "ring-fuchsia-500/25",
    icon: Palette,
  },
  "VPN & Privacy": {
    label: "VPN & Privacy",
    tagline: "Protect",
    hex: "#059669",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    lightRing: "ring-emerald-200",
    darkBg: "bg-emerald-500/10",
    darkText: "text-emerald-300",
    darkRing: "ring-emerald-500/25",
    icon: ShieldCheck,
  },
  "Cloud Storage": {
    label: "Cloud Storage",
    tagline: "Store",
    hex: "#0284C7",
    lightBg: "bg-sky-50",
    lightText: "text-sky-700",
    lightRing: "ring-sky-200",
    darkBg: "bg-sky-500/10",
    darkText: "text-sky-300",
    darkRing: "ring-sky-500/25",
    icon: CloudUpload,
  },
};

const fallbackTheme: CategoryTheme = {
  label: "Featured",
  tagline: "Explore",
  hex: "#EC4899",
  lightBg: "bg-pink-50",
  lightText: "text-pink-700",
  lightRing: "ring-pink-200",
  darkBg: "bg-pink-500/10",
  darkText: "text-pink-300",
  darkRing: "ring-pink-500/25",
  icon: Sparkles,
};

/** Exact-match lookup plus case-insensitive fallback for minor typos. */
export function getCategoryTheme(category?: string | null): CategoryTheme {
  if (!category) return fallbackTheme;
  const exact = themes[category];
  if (exact) return exact;
  const lower = category.toLowerCase();
  const hit = Object.entries(themes).find(
    ([key]) => key.toLowerCase() === lower,
  );
  return hit ? hit[1] : fallbackTheme;
}

/** All 10 categories in display order (streaming + AI first). */
export const CATEGORY_ORDER: string[] = [
  "Streaming",
  "AI Tools",
  "Music",
  "Design & Creative",
  "Gaming",
  "Productivity",
  "Business Tools",
  "Education",
  "VPN & Privacy",
  "Cloud Storage",
];

export { themes as categoryThemes };
