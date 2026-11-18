export default function WishlistSkeleton() {
  return <main className="wishlist-page" aria-label="Loading wishlist"><div className="store-skeleton-heading" /><div className="wishlist-skeleton-list">{Array.from({ length: 4 }, (_, index) => <div key={index} />)}</div></main>;
}
