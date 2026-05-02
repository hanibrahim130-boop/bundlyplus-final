import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WishlistContextValue {
  ids: string[];
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue>({
  ids: [],
  isWishlisted: () => false,
  toggle: () => {},
  clear: () => {},
  count: 0,
});

const STORAGE_KEY = 'bundlyplus-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const isWishlisted = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  return (
    <WishlistContext.Provider value={{ ids, isWishlisted, toggle, clear, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
