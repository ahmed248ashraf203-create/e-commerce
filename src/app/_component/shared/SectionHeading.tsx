import type { SectionHeadingProps } from "@/app/_types";

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return <div className="section-heading"><h2>{title}</h2>{action}</div>;
}
