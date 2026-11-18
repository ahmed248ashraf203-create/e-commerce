import type { FeatureCardProps } from "@/app/_types";

export default function FeatureCard({ title, detail, tone, children }: FeatureCardProps) {
  return <div className="feature-card"><span className={`feature-icon ${tone}`}>{children}</span><span><strong>{title}</strong><small>{detail}</small></span></div>;
}
