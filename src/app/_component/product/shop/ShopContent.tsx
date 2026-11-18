import { connection } from "next/server";
import type { ShopContentProps } from "@/app/_types";
import { getProducts } from "@/lib/api";
import AllProducts from "./AllProducts";

export default async function ShopContent({ categoryFilter, initialQuery }: ShopContentProps) {
  await connection();
  const result = await getProducts();
  return <AllProducts products={result.ok ? result.data : []} failed={!result.ok} categoryFilter={categoryFilter} initialQuery={initialQuery} />;
}
