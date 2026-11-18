"use client";

import { FiHeadphones, FiRotateCcw, FiShield, FiTruck } from "react-icons/fi";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";
import FeatureCard from "./FeatureCard";

export default function Features() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const features = [{ icon: <FiTruck />, title: t.freeShipping, detail: t.shippingDetail, tone: "blue" }, { icon: <FiShield />, title: t.secure, detail: t.secureDetail, tone: "mint" }, { icon: <FiRotateCcw />, title: t.returns, detail: t.returnsDetail, tone: "orange" }, { icon: <FiHeadphones />, title: t.supportTitle, detail: t.supportDetail, tone: "purple" }];
  return <section className="features-strip" aria-label="Store benefits"><div className="features-grid">{features.map(({ icon, ...feature }) => <FeatureCard key={feature.title} {...feature}>{icon}</FeatureCard>)}</div></section>;
}
