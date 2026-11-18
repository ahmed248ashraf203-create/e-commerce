import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
  return <main className="checkout-page page-skeleton" aria-busy="true" aria-label="Loading checkout">
    <div className="checkout-heading"><div><Skeleton className="page-skeleton-heading" /><Skeleton className="page-skeleton-line" /></div></div>
    <div className="checkout-layout"><div className="checkout-main-column">{Array.from({ length: 2 }, (_, index) => <section className="checkout-panel" key={index}><Skeleton className="page-skeleton-auth-button" /><div className="checkout-panel-body">{Array.from({ length: index ? 2 : 4 }, (_, field) => <Skeleton className="page-skeleton-auth-field checkout-field-wide" key={field} />)}</div></section>)}</div><Skeleton className="checkout-summary" /></div>
  </main>;
}
