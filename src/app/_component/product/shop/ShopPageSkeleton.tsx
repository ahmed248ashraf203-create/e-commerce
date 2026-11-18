import ShopProductsSkeleton from "./ShopProductsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPageSkeleton() {
  return <><div className="shop-banner shop-banner-skeleton" aria-hidden="true"><Skeleton /><Skeleton /><Skeleton /></div><ShopProductsSkeleton /></>;
}
