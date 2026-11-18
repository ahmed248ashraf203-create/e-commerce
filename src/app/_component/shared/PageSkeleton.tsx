import type { RouteSkeletonProps } from "@/app/_types";
import { Skeleton } from "@/components/ui/skeleton";

function ProductGridSkeleton() {
  return <div className="page-skeleton-product-grid">{Array.from({ length: 10 }, (_, index) => <div className="page-skeleton-product" key={index}><Skeleton className="page-skeleton-product-image" /><Skeleton className="page-skeleton-line" /><Skeleton className="page-skeleton-line short" /><Skeleton className="page-skeleton-line price" /></div>)}</div>;
}

export default function PageSkeleton({ variant }: RouteSkeletonProps) {
  if (variant === "home") {
    return <main className="storefront page-skeleton" aria-busy="true" aria-label="Loading homepage">
      <Skeleton className="page-skeleton-hero" />
      <div className="page-skeleton-benefits">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="page-skeleton-benefit" />)}</div>
      <section className="page-skeleton-section"><Skeleton className="page-skeleton-heading" /><div className="page-skeleton-categories">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="page-skeleton-category" />)}</div></section>
      <section className="page-skeleton-section"><Skeleton className="page-skeleton-heading" /><ProductGridSkeleton /></section>
    </main>;
  }

  if (variant === "auth") {
    return <main className="auth-page page-skeleton" aria-busy="true" aria-label="Loading account page">
      <div className="auth-story"><Skeleton className="page-skeleton-auth-art" /><Skeleton className="page-skeleton-heading" /><Skeleton className="page-skeleton-line" /><Skeleton className="page-skeleton-line short" /></div>
      <div className="auth-panel"><Skeleton className="page-skeleton-auth-title" />{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="page-skeleton-auth-field" />)}<Skeleton className="page-skeleton-auth-button" /></div>
    </main>;
  }

  if (variant === "profile") {
    return <main className="account-page page-skeleton" aria-busy="true" aria-label="Loading account profile"><Skeleton className="page-skeleton-heading" /><div className="page-skeleton-profile-grid">{Array.from({ length: 2 }, (_, index) => <div key={index} className="page-skeleton-profile-card"><Skeleton className="page-skeleton-auth-title" />{Array.from({ length: 4 }, (_, field) => <Skeleton key={field} className="page-skeleton-auth-field" />)}</div>)}</div></main>;
  }

  return <main className="support-page page-skeleton" aria-busy="true" aria-label="Loading support page"><Skeleton className="page-skeleton-support-hero" /><div className="page-skeleton-support-grid"><div className="page-skeleton-support-sidebar">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="page-skeleton-contact-info" />)}</div><div className="page-skeleton-support-main"><Skeleton className="page-skeleton-contact-form" /><Skeleton className="page-skeleton-contact-callout" /></div></div></main>;
}
