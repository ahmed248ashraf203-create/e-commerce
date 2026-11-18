import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return <main className="product-detail-page product-detail-skeleton" aria-label="Loading product">
    <div className="detail-breadcrumbs"><Skeleton /><Skeleton /><Skeleton /></div>
    <section className="product-detail-overview">
      <div className="product-gallery-skeleton"><Skeleton /></div>
      <div className="product-detail-summary"><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>
    </section>
  </main>;
}
