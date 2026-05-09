import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useUser } from '@clerk/react';
import { CartItem, Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUser, setUserCart } from '@/lib/users-store';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Product, type: 'product') => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'bundlyplus_cart';

function mergeCarts(a: CartItem[], b: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of a) map.set(item.id, { ...item });
  for (const item of b) {
    const existing = map.get(item.id);
    if (existing) {
      map.set(item.id, { ...existing, quantity: Math.max(existing.quantity, item.quantity) });
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded: userLoaded } = useUser();
  const lastSyncedRef = useRef<string>('');
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mergedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Merge localStorage cart with Firestore cart on first sign-in for this user.
  useEffect(() => {
    if (!userLoaded || !user || !isLoaded) return;
    if (mergedForUserRef.current === user.id) return;
    mergedForUserRef.current = user.id;
    (async () => {
      try {
        const doc = await getOrCreateUser(user.id, {
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName || undefined,
        });
        const remote = doc.cart || [];
        const local = (() => {
          try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          } catch {
            return [];
          }
        })();
        const merged = mergeCarts(remote, local);
        const mergedJson = JSON.stringify(merged);
        const remoteJson = JSON.stringify(remote);
        setItems(merged);
        lastSyncedRef.current = mergedJson;
        if (mergedJson !== remoteJson) {
          await setUserCart(user.id, merged);
        }
      } catch (e) {
        console.warn('Cart sync failed', e);
      }
    })();
  }, [userLoaded, user, isLoaded]);

  // Debounced push of local changes to Firestore while signed in.
  useEffect(() => {
    if (!isLoaded || !userLoaded || !user) return;
    const json = JSON.stringify(items);
    if (json === lastSyncedRef.current) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      lastSyncedRef.current = json;
      setUserCart(user.id, items).catch((e) => console.warn('Cart push failed', e));
    }, 600);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [items, isLoaded, userLoaded, user]);

  // Reset merge flag on sign-out so next sign-in re-merges.
  useEffect(() => {
    if (userLoaded && !user) {
      mergedForUserRef.current = null;
      lastSyncedRef.current = '';
    }
  }, [userLoaded, user]);

  const addToCart = (item: Product, type: 'product') => {
    setItems((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        type,
        duration: item.duration
      }];
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const isInCart = (id: string) => items.some(i => i.id === id);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, isInCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
