import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { HeroControlsProps } from "@/app/_types";

export default function HeroControls({ slide, onChange }: HeroControlsProps) {
  return <><Button className="hero-arrow prev" aria-label="Previous slide" variant="outline" size="icon" onClick={() => onChange((slide + 2) % 3)}><FiChevronLeft /></Button><Button className="hero-arrow next" aria-label="Next slide" variant="outline" size="icon" onClick={() => onChange((slide + 1) % 3)}><FiChevronRight /></Button><div className="hero-dots" role="group" aria-label="Choose slide">{[0, 1, 2].map((item) => <button key={item} className={slide === item ? "selected" : ""} aria-label={`Slide ${item + 1}`} aria-pressed={slide === item} onClick={() => onChange(item)} />)}</div></>;
}
