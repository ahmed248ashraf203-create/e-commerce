"use client";

import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../../preferences/Preferences";
import type { RelatedProductsProps } from "@/app/_types";
import Product from "../Product";

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  if (!products.length) return null;
  return <section className="related-products"><div className="section-heading"><h2>{t.youMayLike}</h2></div><div className="product-grid">{products.map((product) => <Product key={product._id} product={product} />)}</div></section>;
}
