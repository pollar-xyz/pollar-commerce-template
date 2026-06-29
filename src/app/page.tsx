import { getProducts } from "@/storefront/catalog";
import { ProductCard } from "@/storefront/ProductCard";

export default function CatalogPage() {
  const products = getProducts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shop</h1>
        <p className="text-neutral-500">
          Pay in USDC with your Pollar wallet on Stellar testnet.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
