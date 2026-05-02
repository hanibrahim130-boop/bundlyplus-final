import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { getOrCreateUser, setUserWishlist } from '@/lib/users-store';

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
  const { user, isLoaded: userLoaded } = useUser();
  const lastSyncedRef = useRef<string>('');
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mergedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  useEffect(() => {
    if (!userLoaded || !user) return;
    if (mergedForUserRef.current === user.id) return;
    mergedForUserRef.current = user.id;
    (async () => {
      try {
        const doc = await getOrCreateUser(user.id, {
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName || undefined,
        });
        const remote = doc.wishlist || [];
        const local = (() => {
          try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          } catch {
            return [];
          }
        })();
        const merged = Array.from(new Set([...remote, ...local]));
        const mergedJson = JSON.stringify(merged);
        const remoteJson = JSON.stringify(remote);
        setIds(merged);
        lastSyncedRef.current = mergedJson;
        if (mergedJson !== remoteJson) {
          await setUserWishlist(user.id, merged);
        }
      } catch (e) {
        console.warn('Wishlist sync failed', e);
      }
    })();
  }, [userLoaded, user]);

  useEffect(() => {
    if (!userLoaded || !user) return;
    const json = JSON.stringify(ids);
    if (json === lastSyncedRef.current) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      lastSyncedRef.current = json;
      setUserWishlist(user.id, ids).catch((e) => console.warn('Wishlist push failed', e));
    }, 600);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [ids, userLoaded, user]);

  useEffect(() => {
    if (userLoaded && !user) {
      mergedForUserRef.current = null;
      lastSyncedRef.current = '';
    }
  }, [userLoaded, user]);

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
