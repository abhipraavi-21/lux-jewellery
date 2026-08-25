import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

type CartItem = { id: string; qty: number };

type Store = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  cartProducts: Array<Product & { qty: number }>;
  wishlistProducts: Product[];
  clearCart: () => void;
};

const Ctx = createContext<Store | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { const v = window.localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => read("aurelia.cart", [] as CartItem[]));
  const [wishlist, setWishlist] = useState<string[]>(() => read("aurelia.wishlist", [] as string[]));

  useEffect(() => { try { localStorage.setItem("aurelia.cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem("aurelia.wishlist", JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const value = useMemo<Store>(() => {
    const findP = (id: string) => PRODUCTS.find((p) => p.id === id);
    const cartProducts = cart
      .map((c) => { const p = findP(c.id); return p ? { ...p, qty: c.qty } : null; })
      .filter(Boolean) as Array<Product & { qty: number }>;
    const wishlistProducts = wishlist.map(findP).filter(Boolean) as Product[];
    return {
      cart, wishlist,
      addToCart: (id, qty = 1) =>
        setCart((c) => {
          const i = c.findIndex((x) => x.id === id);
          if (i >= 0) { const next = [...c]; next[i] = { id, qty: next[i].qty + qty }; return next; }
          return [...c, { id, qty }];
        }),
      removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      updateQty: (id, qty) => setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
      toggleWishlist: (id) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]),
      cartCount: cart.reduce((s, x) => s + x.qty, 0),
      wishlistCount: wishlist.length,
      cartTotal: cartProducts.reduce((s, x) => s + x.price * x.qty, 0),
      cartProducts,
      wishlistProducts,
      clearCart: () => setCart([]),
    };
  }, [cart, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
