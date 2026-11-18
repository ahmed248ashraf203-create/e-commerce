"use client";

import { useState } from "react";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import type { MainSliderProps } from "@/app/_types";
import HeroCopy from "./HeroCopy";
import HeroControls from "./HeroControls";

export default function MainSlider({ hasHeroImage }: MainSliderProps) {
  const [slide, setSlide] = useState(0);
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  return <section id="home" className={`hero ${hasHeroImage ? "has-image" : ""}`} style={hasHeroImage ? { backgroundImage: "linear-gradient(90deg,rgba(0,184,100,.94),rgba(0,145,82,.52)),url('/images/hero-supermarket.jpg')" } : undefined} aria-roledescription="carousel">
    <HeroCopy copy={t} slide={slide} />
    <HeroControls slide={slide} onChange={setSlide} />
  </section>;
}
