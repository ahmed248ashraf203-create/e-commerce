"use client";

import { useDeferredValue, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import type { AllProductsProps } from "@/app/_types";
import { usePreferences } from "../../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { SectionState } from "../../shared/SectionState";
import Product from "../Product";

export default function AllProducts({ products, failed = false, categoryFilter, initialQuery }: AllProductsProps) {
  const { locale, searchQuery, setSearchQuery } = usePreferences();
  const t = getDictionary(locale);
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    if (initialQuery !== undefined) setSearchQuery(initialQuery);
  }, [initialQuery, setSearchQuery]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    return products.filter((product) => {
    const matchesCategory = !categoryFilter || product.category.name.toLowerCase() === categoryFilter.toLowerCase();
    const searchableText = [product.title, product.description, product.category.name, product.brand?.name, ...(product.subcategory ?? []).map(({ name }) => name)]
      .filter(Boolean)
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
    const matchesSearch = searchableText.includes(normalizedQuery);
    return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, deferredQuery]);

  const formattedCount = visibleProducts.length.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");

  return <section className="shop-catalog"><div className="shop-catalog-toolbar"><span>{t.showingProducts} {formattedCount} {t.productsCount}</span><label className="shop-search"><FiSearch /><Input aria-label={t.search} placeholder={t.search} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label></div>
      {failed ? <SectionState state="error" /> : visibleProducts.length === 0 ? <SectionState state={products.length ? "noMatches" : "empty"} /> : <div className="product-grid">{visibleProducts.map((product) => <Product product={product} key={product._id} />)}</div>}
    </section>;
}
