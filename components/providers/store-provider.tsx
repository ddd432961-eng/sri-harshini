'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';

export type CartLine = {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type StoreContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (line: Omit<CartLine, 'id'>) => void;
  updateQty: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, name?: string) => void;
  inWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_KEY = 'shb_cart';
const WISH_KEY = 'shb_wishlist';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      const w = localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore */
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback(
    (line: Omit<CartLine, 'id'>) => {
      const id = `${line.product_id}-${line.size}-${line.color}`;
      setCart((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (existing) {
          return prev.map((l) =>
            l.id === id ? { ...l, quantity: l.quantity + line.quantity } : l,
          );
        }
        return [...prev, { ...line, id }];
      });
      toast.success(`${line.name} added to cart`);
    },
    [],
  );

  const updateQty = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string, name?: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          toast(`${name ?? 'Item'} removed from wishlist`);
          return prev.filter((p) => p !== productId);
        }
        toast.success(`${name ?? 'Item'} added to wishlist`);
        return [...prev, productId];
      });
    },
    [],
  );

  const inWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  // sync wishlist to db when authenticated
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id);
      if (data && data.length > 0) {
        const dbIds = data.map((d) => d.product_id);
        setWishlist((prev) => Array.from(new Set([...prev, ...dbIds])));
      }
    })();
  }, [user]);

  const cartCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart],
  );

  const value: StoreContextValue = {
    cart,
    wishlist,
    cartCount,
    cartSubtotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    inWishlist,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
