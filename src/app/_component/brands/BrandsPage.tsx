"use client";

import Link from "next/link";
import { FiChevronRight, FiHome, FiTag } from "react-icons/fi";
import type { BrandsPageProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getStoreDictionary } from "@/lib/store-dictionary";
import BrandCard from "./BrandCard";

export default function BrandsPage({ brands, failed = false }: BrandsPageProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const store = getStoreDictionary(locale);
  return (
    <main className="brands-page">
      <header className="brands-hero">
        <nav aria-label="Breadcrumb"><Link href="/"><FiHome />{t.homeBreadcrumb}</Link><FiChevronRight /><span>{t.brands}</span></nav>
        <div className="brands-hero-title"><span><FiTag /></span><div><h1>{store.brandsTitle}</h1><p>{store.brandsSubtitle}</p></div></div>
      </header>
      <section className="brand-grid-wrap" aria-label={store.brandsTitle}>
        {failed ? <div className="store-state error" role="alert"><p>{store.error}</p><Link href="/brands">{store.retry}</Link></div> : brands.length === 0 ? <div className="store-state" role="status">{store.noBrands}</div> : <div className="brand-grid">{brands.map((brand) => <BrandCard key={brand._id} brand={brand} />)}</div>}
      </section>
    </main>
  );
}
