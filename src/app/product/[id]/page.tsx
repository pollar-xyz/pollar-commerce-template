import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/storefront/catalog";
import { ProductDetail } from "@/storefront/ProductDetail";

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
