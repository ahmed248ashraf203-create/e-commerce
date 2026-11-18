export default function BrandsSkeleton() {
  return <main className="brands-page" aria-label="Loading brands"><div className="brands-hero-skeleton" /><div className="brand-grid brand-grid-skeleton">{Array.from({ length: 18 }, (_, index) => <div className="brand-card-skeleton" key={index}><span /><i /></div>)}</div></main>;
}
