import { Suspense } from "react";
import type { ShopPageProps } from "@/app/_types";
import ShopHeader from "./ShopHeader";
import ShopContent from "./ShopContent";
import ShopProductsSkeleton from "./ShopProductsSkeleton";

export default async function ShopPageContent({ searchParams }: ShopPageProps) {
  const filters = await searchParams;
  return <><ShopHeader categoryFilter={filters.category} /><Suspense fallback={<ShopProductsSkeleton />}><ShopContent categoryFilter={filters.category} initialQuery={filters.q} /></Suspense></>;
}
