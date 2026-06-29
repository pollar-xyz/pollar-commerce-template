"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Commerce core — useCart
// Plain React state + context. No external state library by design.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Order, Product } from "./types";

/** Decimal-string money math kept in integer cents to avoid float drift. */
function toCents(usdc: string): number {
  return Math.round(parseFloat(usdc) * 100);
}
function fromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export interface UseCart {
  items: CartItem[];
  /** Number of distinct lines. */
  count: number;
  /** Total units across all lines. */
  units: number;
  /** Order subtotal in USDC (decimal string). Equals total — no fees/tax here. */
  subtotal: string;
  total: string;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  /** Freeze the current cart into an Order with a stable id. */
  toOrder: () => Order;
}

function computeTotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + toCents(i.product.price) * i.quantity, 0);
}

/** Order ids are client-side and only used as a payment reference. */
function newOrderId(): string {
  const rand = Math.floor(performance.now() * 1000) % 1_000_000;
  return `ord_${rand.toString(36)}_${items_seed()}`;
}
let _seed = 0;
function items_seed(): string {
  _seed += 1;
  return _seed.toString(36).padStart(3, "0");
}

export function useCartState(): UseCart {
  const [items, setItems] = useState<CartItem[]>([]);

  return useMemo<UseCart>(() => {
    const totalCents = computeTotalCents(items);
    return {
      items,
      count: items.length,
      units: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: fromCents(totalCents),
      total: fromCents(totalCents),
      add: (product, quantity = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.product.id === product.id);
          if (existing) {
            return prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            );
          }
          return [...prev, { product, quantity }];
        }),
      remove: (productId) =>
        setItems((prev) => prev.filter((i) => i.product.id !== productId)),
      updateQuantity: (productId, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((i) => i.product.id !== productId)
            : prev.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i,
              ),
        ),
      clear: () => setItems([]),
      toOrder: () => ({
        id: newOrderId(),
        items,
        total: fromCents(computeTotalCents(items)),
        createdAt: Date.now(),
      }),
    };
  }, [items]);
}

const CartContext = createContext<UseCart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartState();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): UseCart {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
