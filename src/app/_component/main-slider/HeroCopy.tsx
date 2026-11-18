import { Button } from "@/components/ui/button";
import type { HeroCopyProps } from "@/app/_types";

export default function HeroCopy({ copy, slide }: HeroCopyProps) {
  return <div className="hero-copy"><span className="hero-eyebrow">{slide === 0 ? copy.arrivals : copy.dealDay}</span><h1>{copy.heroTitle}</h1><p>{copy.heroText}</p><div className="hero-buttons"><Button onClick={() => document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" })}>{copy.shopNow}</Button><Button variant="outline" onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}>{copy.viewDeals}</Button></div></div>;
}
