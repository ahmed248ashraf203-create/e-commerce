import { Skeleton } from "@/components/ui/skeleton";

export default function RelatedProductsSkeleton() {
  return <section className="related-products" aria-label="Loading recommendations" aria-busy="true"><Skeleton className="shop-skeleton-line" /><div className="product-grid">{Array.from({ length: 5 }, (_, index) => <div className="product-skeleton-card" key={index}><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>)}</div></section>;
}
