/**
 * Pricing-tier helper.
 *
 * Products in the catalog ship with a single monthly price. On the
 * new Apple-style product detail page we surface four durations:
 *
 *    - 1 Month   → base × 1        (no discount)
 *    - 3 Months  → base × 2.8      (~7% saving vs. 3× monthly)
 *    - 6 Months  → base × 5.4      (~10% saving vs. 6× monthly)
 *    - 1 Year    → base × 10       (~17% saving vs. 12× monthly)
 *
 * Multipliers are intentional — they give the customer a visible
 * reason to upgrade without the catalog needing per-duration data.
 * The 1 Year tier carries a "Save 17%" badge as the anchor offer.
 *
 * The final per-tier price is rounded to two decimals so the UI
 * never shows odd fractions like 11.1996.
 */

export type DurationKey = "1m" | "3m" | "6m" | "12m";

export type DurationLabelKey =
  | "oneMonth"
  | "threeMonths"
  | "sixMonths"
  | "oneYear";

export interface PricingTier {
  /** Stable key used for React lists, A/B tests and analytics */
  key: DurationKey;
  /** i18n key used to look up the human label */
  labelKey: DurationLabelKey;
  /** Fallback English label if no i18n is wired yet */
  label: string;
  /** Total price the customer pays for the full duration (USD) */
  price: number;
  /** Savings badge text if any (e.g. "Save 17%") */
  savingsBadge?: string;
  /** True for the recommended tier — the card gets the brand ring */
  recommended?: boolean;
  /** Effective per-month price for comparison rows */
  perMonth: number;
  /** Multiplier used so UI copy can reference it if needed */
  multiplier: number;
}

const MULTIPLIERS: { key: DurationKey; label: DurationLabelKey; text: string; months: number; multiplier: number; savePct?: number; recommended?: boolean }[] = [
  { key: "1m",  label: "oneMonth",    text: "1 Month",   months: 1,  multiplier: 1,   savePct: undefined, recommended: false },
  { key: "3m",  label: "threeMonths", text: "3 Months",  months: 3,  multiplier: 2.8, savePct: 7,         recommended: false },
  { key: "6m",  label: "sixMonths",   text: "6 Months",  months: 6,  multiplier: 5.4, savePct: 10,        recommended: false },
  { key: "12m", label: "oneYear",     text: "1 Year",    months: 12, multiplier: 10,  savePct: 17,        recommended: true  },
];

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Returns the full 4-tier table for a given monthly base price.
 * If `basePrice` is 0 or negative, returns an empty array.
 */
export function getTiers(basePrice: number): PricingTier[] {
  if (!basePrice || basePrice <= 0) return [];

  return MULTIPLIERS.map((m) => {
    const price = round(basePrice * m.multiplier);
    const perMonth = round(price / m.months);
    return {
      key: m.key,
      labelKey: m.label,
      label: m.text,
      price,
      perMonth,
      multiplier: m.multiplier,
      recommended: m.recommended,
      savingsBadge: m.savePct ? `Save ${m.savePct}%` : undefined,
    };
  });
}

/**
 * Same as getTiers but returns a single tier by key. Useful from
 * ProductCard where we only display the 1 Month price.
 */
export function getTier(basePrice: number, key: DurationKey): PricingTier | null {
  const tiers = getTiers(basePrice);
  return tiers.find((t) => t.key === key) ?? null;
}

/**
 * Returns the recommended tier (used for the "Save 17%" badge on
 * product cards and hero pricing highlights).
 */
export function getRecommendedTier(basePrice: number): PricingTier | null {
  const tiers = getTiers(basePrice);
  return tiers.find((t) => t.recommended) ?? null;
}

export const DURATION_LABEL_FALLBACKS: Record<DurationLabelKey, string> = {
  oneMonth: "1 Month",
  threeMonths: "3 Months",
  sixMonths: "6 Months",
  oneYear: "1 Year",
};
