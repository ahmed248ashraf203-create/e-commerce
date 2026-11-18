"use client";

import Link from "next/link";
import { FiChevronRight, FiHome, FiPackage } from "react-icons/fi";
import type { ShopHeaderProps } from "@/app/_types";
import { usePreferences } from "../../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";

export default function ShopHeader({ categoryFilter }: ShopHeaderProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const title = categoryFilter ? t.categoryNames[categoryFilter.toLowerCase()] ?? categoryFilter : t.allProducts;
  return <section className="shop-banner"><nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link href="/"><FiHome />{t.homeBreadcrumb}</Link><FiChevronRight /><span>{title}</span></nav><div className="shop-banner-title"><span><FiPackage /></span><div><h1>{title}</h1><p>{t.allProductsDescription}</p></div></div></section>;
}
