"use client";

import Link from "next/link";
import { useCart } from "@/commerce";
import { ASSET_LABEL } from "@/config";

export function CartView() {
  const { items, total, updateQuantity, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link href="/" className="rounded-lg bg-violet-600 px-4 py-2 text-white">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
      <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="font-mono text-sm text-neutral-500">
                {product.price} {ASSET_LABEL}
              </p>
            </div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value, 10) || 1)}
              className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-center"
            />
            <button onClick={() => remove(product.id)} className="text-sm text-neutral-500 hover:text-red-600">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <button onClick={clear} className="text-sm text-neutral-500 hover:underline">
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Total</p>
          <p className="font-mono text-2xl font-bold">
            {total} <span className="text-base text-neutral-500">{ASSET_LABEL}</span>
          </p>
        </div>
      </div>
      <Link
        href="/checkout"
        className="block rounded-xl bg-violet-600 py-3 text-center font-semibold text-white transition hover:bg-violet-700"
      >
        Checkout
      </Link>
    </div>
  );
}
