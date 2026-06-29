"use client";

// Storefront shell — header. Consumes the core (useCart) and the SDK
// (WalletButton). Swap this whole folder to build a different storefront.

import Link from "next/link";
import { WalletButton } from "@pollar/react";
import { useCart } from "@/commerce";

export function StoreHeader() {
  const { units } = useCart();
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Pollar<span className="text-violet-600">Shop</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
          >
            Cart
            {units > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-xs font-bold text-white">
                {units}
              </span>
            )}
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
