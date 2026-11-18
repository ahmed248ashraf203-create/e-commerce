import type { SectionSkeletonProps } from "@/app/_types";
import { Skeleton } from "@/components/ui/skeleton";

export default function SectionSkeleton({ kind }: SectionSkeletonProps) {
  const count = kind === "categories" ? 6 : 10;
  return <div className={`section-skeleton ${kind}`} aria-label="Loading section" aria-busy="true">{Array.from({ length: count }, (_, index) => <Skeleton className="skeleton-block" key={index} />)}</div>;
}
