"use client";

import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";
import DealCard from "./DealCard";

export default function Deals() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  return <section className="deals-grid" id="deals" aria-label={t.viewDeals}>
    <DealCard variant="organic" badge={`🔥 ${t.dealDay}`} title={t.freshFruit} description={t.organicDesc} discount="40% OFF" code="ORGANIC40" codeLabel={t.useCode} buttonLabel={t.shopNow} />
    <DealCard variant="vegetable" badge={`✨ ${t.newArrivals}`} title={t.vegetables} description={t.vegetableDesc} discount="25% OFF" code="FRESH25" codeLabel={t.useCode} buttonLabel={t.explore} />
  </section>;
}
