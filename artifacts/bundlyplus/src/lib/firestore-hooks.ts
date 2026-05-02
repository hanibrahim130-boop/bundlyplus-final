import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";

const TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; ts: number }>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, ts: Date.now() });
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useProducts(filters?: {
  category?: string;
  featured?: boolean;
  enabled?: boolean;
}): UseQueryResult<any[]> {
  const enabled = filters?.enabled !== false;
  const cacheKey = `products:${filters?.category ?? ''}:${filters?.featured ?? ''}`;
  const cached = enabled ? getCached(cacheKey) : null;
  const [data, setData] = useState<any[] | undefined>(cached ?? undefined);
  const [isLoading, setIsLoading] = useState(enabled && !cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) { setIsLoading(false); return; }
    if (getCached(cacheKey)) return;
    async function fetch() {
      try {
        setIsLoading(true);
        const constraints: any[] = [];
        if (filters?.category && filters.category !== "All") {
          constraints.push(where("category", "==", filters.category));
        }
        if (filters?.featured) {
          constraints.push(where("featured", "==", true));
        }
        const q = constraints.length > 0
          ? query(collection(firestore, "products"), ...constraints)
          : collection(firestore, "products");
        const snapshot = await getDocs(q);
        const products = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
        setCached(cacheKey, products);
        setData(products);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [filters?.category, filters?.featured, enabled]);

  return { data, isLoading, error };
}

export function useBundles(): UseQueryResult<any[]> {
  const cacheKey = 'bundles';
  const cached = getCached(cacheKey);
  const [data, setData] = useState<any[] | undefined>(cached ?? undefined);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (getCached(cacheKey)) return;
    async function fetch() {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(firestore, "bundles"));
        const bundles = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCached(cacheKey, bundles);
        setData(bundles);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  return { data, isLoading, error };
}

export interface Promotion {
  id: string;
  title: string;
  bodyEn: string;
  bodyAr: string;
  startDate: number;
  endDate: number;
  discountLabel: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaPath: string;
  bgGradient: string;
  enabled: boolean;
  created_at?: number;
}

export function useActivePromotion(): UseQueryResult<Promotion | null> {
  const cacheKey = 'promotion:active';
  const cachedEntry = cache.get(cacheKey);
  const isFresh = !!cachedEntry && Date.now() - cachedEntry.ts <= TTL;
  const initial: Promotion | null | undefined = isFresh ? cachedEntry!.data : undefined;

  const [data, setData] = useState<Promotion | null | undefined>(initial);
  const [isLoading, setIsLoading] = useState(!isFresh);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isFresh) return;
    let cancelled = false;
    async function fetchPromo() {
      try {
        setIsLoading(true);
        const q = query(collection(firestore, "promotions"), where("enabled", "==", true));
        const snapshot = await getDocs(q);
        const now = Date.now();
        const active = snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Promotion, "id">) }))
          .filter((p) => Number(p.startDate) <= now && now <= Number(p.endDate))
          .sort((a, b) => Number(b.startDate) - Number(a.startDate));
        const result = (active[0] as Promotion | undefined) ?? null;
        if (!cancelled) {
          setCached(cacheKey, result);
          setData(result);
        }
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchPromo();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data: data ?? undefined, isLoading, error };
}

export function useSettings(): {
  siteSettings: any;
  pricingTiers: any[];
  isLoading: boolean;
  error: Error | null;
} {
  const cacheKey = 'settings';
  const cached = getCached(cacheKey);
  const [siteSettings, setSiteSettings] = useState<any>(cached?.siteSettings ?? {});
  const [pricingTiers, setPricingTiers] = useState<any[]>(cached?.pricingTiers ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (getCached(cacheKey)) return;
    async function fetch() {
      try {
        setIsLoading(true);
        const siteDoc = await getDoc(doc(firestore, "settings", "site"));
        const site = siteDoc.exists() ? siteDoc.data() : {};
        if (siteDoc.exists()) setSiteSettings(site);

        const bundlesDoc = await getDoc(doc(firestore, "settings", "bundles"));
        const tiers = bundlesDoc.exists()
          ? [bundlesDoc.data().starter, bundlesDoc.data().popular, bundlesDoc.data().ultimate].filter(Boolean)
          : [];
        if (bundlesDoc.exists()) setPricingTiers(tiers);

        setCached(cacheKey, { siteSettings: site, pricingTiers: tiers });
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  return { siteSettings, pricingTiers, isLoading, error };
}
