"use client";

import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiHome, FiTag } from "react-icons/fi";
import type { BrandProductsPageProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getStoreDictionary } from "@/lib/store-dictionary";
import Product from "../product/Product";

export default function BrandProductsPage({ brand, products, failed = false }: BrandProductsPageProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const store = getStoreDictionary(locale);
  return (
    <main className="brand-detail-page">
      <header className="brand-detail-hero">
        <nav aria-label="Breadcrumb"><Link href="/"><FiHome />{t.homeBreadcrumb}</Link><FiChevronRight /><Link href="/brands">{t.brands}</Link><FiChevronRight /><span>{brand.name}</span></nav>
        <div className="brand-detail-heading"><span className="brand-detail-logo">{brand.image ? <Image src={brand.image} alt={brand.name} width={72} height={72} /> : <FiTag />}</span><div><h1>{brand.name}</h1><p>{store.shopBrand} {brand.name}</p></div></div>
      </header>
      <section className="brand-products-section">
        <h2>{store.shopBrand} {brand.name}</h2>
        {failed ? <div className="store-state error" role="alert">{store.error}</div> : products.length === 0 ? <div className="store-state" role="status">{store.noBrandProducts}</div> : <div className="product-grid">{products.map((product) => <Product key={product._id} product={product} />)}</div>}
      </section>
    </main>
  );
}
