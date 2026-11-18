import { Suspense } from "react";
import type { ShopPageProps } from "@/app/_types";
import ShopPageContent from "@/app/_component/product/shop/ShopPageContent";
import ShopPageSkeleton from "@/app/_component/product/shop/ShopPageSkeleton";

export default function ShopPage(props: ShopPageProps) {
  return (
    <main className="shop-page">
      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopPageContent searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}
