"use client";

import Link from "next/link";
import { useCart, type Product } from "@/commerce";
import { ASSET_LABEL } from "@/config";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.id}`} className="font-semibold leading-tight hover:underline">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-neutral-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono font-bold">
            {product.price} <span className="text-xs text-neutral-500">{ASSET_LABEL}</span>
          </span>
          <button
            onClick={() => add(product)}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
