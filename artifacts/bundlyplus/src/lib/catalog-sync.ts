/**
 * Catalog sync — one-click "Sync from products.json to Firestore".
 *
 * The admin dashboard lets you bulk-upload every product defined in
 * `src/data/products.json` to the Firestore `products` collection.
 * This is how we keep the local JSON (the source of truth for the
 * repo, used by prerender + type generation + the logo checker) in
 * step with the live Firestore collection that the storefront reads.
 *
 * Contract:
 *   - Diff by document `id`. Existing docs are updated (set with merge),
 *     missing docs are created with the same `id`, extra Firestore docs
 *     are left alone (so you can soft-delete manually from the admin
 *     dashboard's Trash icon).
 *   - Writes happen in 400-doc batches (Firestore's max is 500,
 *     400 gives headroom).
 *   - Requires the caller to be authenticated to Firebase as an admin
 *     (enforced by Firestore rules — calling this from a non-admin
 *     account will throw a permission-denied error for every write).
 *
 * Usage:
 *   const result = await syncCatalogToFirestore();
 *   // -> { total, created, updated, unchanged, elapsedMs }
 */

import {
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "./firebase";
import productsData from "@/data/products.json";
import type { Product } from "@/types";

export interface SyncSummary {
  /** Total products in the local JSON */
  total: number;
  /** Products that did not exist in Firestore and were created */
  created: number;
  /** Products whose field values were updated (set + merge) */
  updated: number;
  /** Products whose Firestore values already matched (skipped) */
  unchanged: number;
  /** Extra Firestore docs not present in the local JSON */
  orphaned: number;
  /** Wall-clock time the sync took */
  elapsedMs: number;
}

const FIELDS_TO_SYNC: (keyof Product)[] = [
  "name",
  "description",
  "category",
  "duration",
  "account_type",
  "price",
  "features",
  "image_url",
  "hot",
  "featured",
  "out_of_stock",
];

function normalize(p: Partial<Product>): Record<string, unknown> {
  return {
    name: p.name ?? "",
    description: p.description ?? "",
    category: p.category ?? "",
    duration: p.duration ?? "1 Month",
    account_type: p.account_type ?? "Shared",
    price: Number(p.price ?? 0),
    features: Array.isArray(p.features) ? p.features : [],
    image_url: p.image_url ?? "",
    hot: !!p.hot,
    featured: !!p.featured,
    out_of_stock: !!p.out_of_stock,
  };
}

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  for (const k of FIELDS_TO_SYNC) {
    const av = a[k];
    const bv = b[k];
    if (Array.isArray(av) && Array.isArray(bv)) {
      if (av.length !== bv.length) return false;
      for (let i = 0; i < av.length; i++) if (av[i] !== bv[i]) return false;
      continue;
    }
    if (av !== bv) return false;
  }
  return true;
}

/**
 * Sync every product in the bundled JSON to Firestore.
 * Calls `onProgress` with the number of docs processed so the UI can
 * render a progress bar while larger batches commit.
 */
export async function syncCatalogToFirestore(
  onProgress?: (done: number, total: number) => void,
): Promise<SyncSummary> {
  const start = performance.now();
  const local = productsData as Product[];
  const total = local.length;

  // 1) Read existing Firestore docs so we can diff field values
  const existingSnap = await getDocs(collection(firestore, "products"));
  const existing = new Map<string, Record<string, unknown>>();
  existingSnap.forEach((d) => existing.set(d.id, d.data() as Record<string, unknown>));

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  // 2) Batch writes in chunks of 400
  const BATCH_SIZE = 400;
  let batch = writeBatch(firestore);
  let pending = 0;

  for (let i = 0; i < local.length; i++) {
    const p = local[i];
    if (!p.id) continue;

    const payload = normalize(p);
    const existingData = existing.get(p.id);

    if (!existingData) {
      // Create with same id
      batch.set(doc(firestore, "products", p.id), {
        ...payload,
        created_at: Date.now(),
      });
      created++;
      pending++;
    } else if (!shallowEqual(existingData, payload)) {
      batch.set(doc(firestore, "products", p.id), payload, { merge: true });
      updated++;
      pending++;
    } else {
      unchanged++;
    }

    if (pending >= BATCH_SIZE) {
      await batch.commit();
      batch = writeBatch(firestore);
      pending = 0;
    }
    onProgress?.(i + 1, total);
  }

  if (pending > 0) {
    await batch.commit();
  }

  // 3) Orphaned: Firestore docs with no matching local id
  const localIds = new Set(local.map((p) => p.id));
  let orphaned = 0;
  existing.forEach((_, id) => {
    if (!localIds.has(id)) orphaned++;
  });

  return {
    total,
    created,
    updated,
    unchanged,
    orphaned,
    elapsedMs: Math.round(performance.now() - start),
  };
}
