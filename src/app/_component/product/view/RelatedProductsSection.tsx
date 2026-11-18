import { connection } from "next/server";
import type { RelatedProductsSectionProps } from "@/app/_types";
import { getProducts } from "@/lib/api";
import RelatedProducts from "./RelatedProducts";

export default async function RelatedProductsSection({ categoryId, productId }: RelatedProductsSectionProps) {
  await connection();
  const result = await getProducts();
  const products = result.ok ? result.data.filter((product) => product._id !== productId && product.category._id === categoryId).slice(0, 5) : [];
  return <RelatedProducts products={products} />;
}
