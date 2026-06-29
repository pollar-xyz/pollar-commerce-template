"use client";

import { useRouter } from "next/navigation";
import { useCart, type Product } from "@/commerce";
import { ASSET_LABEL } from "@/config";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        className="aspect-square w-full rounded-2xl border border-neutral-200 object-cover"
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
        <p className="font-mono text-xl font-bold">
          {product.price} <span className="text-sm text-neutral-500">{ASSET_LABEL}</span>
        </p>
        <p className="text-neutral-600">{product.description}</p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={() => add(product)}
            className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white transition hover:bg-violet-700"
          >
            Add to cart
          </button>
          <button
            onClick={() => {
              add(product);
              router.push("/cart");
            }}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 font-medium hover:bg-neutral-50"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
