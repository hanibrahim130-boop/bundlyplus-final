import { useProducts } from "./firestore-hooks";
import type { Product } from "@/types";

/**
 * Live catalog count — single source of truth for every piece of copy
 * that references the size of the product catalog.
 *
 * - Reads from Firestore via `useProducts()` so the homepage reflects
 *   whatever's live right now, not what was bundled into the JS file.
 * - While Firestore is still loading (first paint), returns a small
 *   compile-time constant as the fallback so the initial SSR/CSR
 *   render has a plausible number. The live count takes over once
 *   Firestore resolves (usually within a few hundred ms).
 * - Buckets to the nearest ten and adds a "+" so micro-changes in the
 *   catalog never trigger copy churn. 187 products => "180+".
 *
 * NOTE: the fallback is intentionally NOT the bundled products.json.
 * Importing that file at the module level pulls the full catalog
 * (~36 KB) into the main bundle even though the client storefront
 * never needs the raw JSON — it reads from Firestore. Keeping the
 * fallback as a constant keeps the homepage bundle lean.
 */

/**
 * Compile-time fallback — approximate catalog size as of the last
 * release. Bump this when you add a large batch of products so the
 * first-paint number is close to reality. The live Firestore count
 * overrides it on first render anyway.
 */
const FALLBACK_CATALOG_SIZE = 150;

export interface CatalogCount {
  /** The exact number of products currently in the catalog */
  exact: number;
  /** Bucketed to the nearest ten (minimum 10) */
  bucket: number;
  /** Ready-to-render string like "180+" */
  display: string;
  /** "180+" localized for the current language (Arabic-Indic digits in AR) */
  localized: (lang: "en" | "ar") => string;
}

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

function toArabic(n: number): string {
  return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

function bucketDown(n: number): number {
  if (n <= 0) return 0;
  // Round *down* to the nearest ten so the "+" is never a lie.
  return Math.max(10, Math.floor(n / 10) * 10);
}

export function formatCatalogCount(exact: number): CatalogCount {
  const bucket = bucketDown(exact);
  const display = bucket > 0 ? `${bucket}+` : "";
  return {
    exact,
    bucket,
    display,
    localized: (lang) =>
      lang === "ar" && display ? `+${toArabic(bucket)}` : display,
  };
}

/**
 * Hook version — subscribes to Firestore product count and falls back
 * to the FALLBACK_CATALOG_SIZE constant until the live count resolves.
 */
export function useCatalogCount(): CatalogCount {
  const { data } = useProducts();
  const liveCount = (data as Product[] | undefined)?.length;
  return formatCatalogCount(liveCount ?? FALLBACK_CATALOG_SIZE);
}
