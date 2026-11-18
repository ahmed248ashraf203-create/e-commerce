import { connection } from "next/server";
import { getProducts } from "@/lib/api";
import FeaturedProducts from "./FeaturedProducts";

export default async function ProductsSection() {
  await connection();
  const result = await getProducts();
  if (!result.ok) return <FeaturedProducts products={[]} failed />;
  return <FeaturedProducts products={result.data} />;
}
