"use client";

import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function ClosingBenefits() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const benefits = [{ icon: "🚚", title: t.freeShipping, detail: t.shippingDetail }, { icon: "↶", title: t.returns, detail: t.returnsDetail }, { icon: "◈", title: t.secure, detail: t.secureDetail }, { icon: "☏", title: t.support, detail: t.supportDetail }];
  return <section className="closing-benefits">{benefits.map(({ icon, title, detail }) => <div key={title}><span>{icon}</span><b>{title}<small>{detail}</small></b></div>)}</section>;
}
