// Storefront shell — static catalog loader. The core never knows where products
// come from; the shell owns this. Swap for an API in another storefront.

import type { Product } from "@/commerce";
import catalog from "../../public/catalog/products.json";

export function getProducts(): Product[] {
  return catalog as Product[];
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}
