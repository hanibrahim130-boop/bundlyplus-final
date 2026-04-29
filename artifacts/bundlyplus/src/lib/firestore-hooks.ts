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
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    async function fetch() {
      try {
        setIsLoading(true);
        let q;
        const constraints: any[] = [];

        if (filters?.category && filters.category !== "All") {
          constraints.push(where("category", "==", filters.category));
        }
        if (filters?.featured) {
          constraints.push(where("featured", "==", true));
        }

        if (constraints.length > 0) {
          q = query(collection(firestore, "products"), ...constraints);
        } else {
          q = collection(firestore, "products");
        }

        const snapshot = await getDocs(q);
        const products = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
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
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(firestore, "bundles"));
        const bundles = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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

export function useSettings(): {
  siteSettings: any;
  pricingTiers: any[];
  isLoading: boolean;
  error: Error | null;
} {
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [pricingTiers, setPricingTiers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const siteDoc = await getDoc(doc(firestore, "settings", "site"));
        if (siteDoc.exists()) {
          setSiteSettings(siteDoc.data());
        }

        const bundlesDoc = await getDoc(doc(firestore, "settings", "bundles"));
        if (bundlesDoc.exists()) {
          const bd = bundlesDoc.data();
          const tiers = [bd.starter, bd.popular, bd.ultimate].filter(Boolean);
          setPricingTiers(tiers);
        }
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
