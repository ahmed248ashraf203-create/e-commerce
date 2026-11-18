import { Skeleton } from "@/components/ui/skeleton";

export default function ShopProductsSkeleton() {
  return <section className="shop-catalog shop-products-skeleton" aria-label="Loading products" aria-busy="true"><Skeleton className="shop-skeleton-line" /><div className="product-grid">{Array.from({ length: 10 }, (_, index) => <div className="product-skeleton-card" key={index}><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>)}</div></section>;
}
