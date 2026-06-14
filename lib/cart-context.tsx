"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildCartLineId, type SelectedCustomization } from "@/lib/pricing";
import type { PackSize } from "@/lib/products";

const CART_STORAGE_KEY = "shf-cart";

export type CartItem = {
  lineId: string;
  productId: string;
  productName: string;
  packSize: PackSize;
  customizations: SelectedCustomization[];
  quantity: number;
  unitPrice: number;
  summary: string;
};

export type AddToCartInput = Omit<CartItem, "lineId">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  hydrated: boolean;
  addItem: (item: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromSession(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToSession(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota or private mode — cart still works in memory
  }
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipPersistRef = useRef(true);

  useEffect(() => {
    setItems(loadCartFromSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    saveCartToSession(items);
  }, [items, hydrated]);

  const addItem = useCallback((item: AddToCartInput) => {
    const lineId = buildCartLineId(
      item.productId,
      item.packSize,
      item.customizations,
    );

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, { ...item, lineId }];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCartToSession([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, hydrated, addItem, removeItem, updateQuantity, clearCart],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
