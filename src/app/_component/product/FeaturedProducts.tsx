"use client";

import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import type { FeaturedProductsProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { SectionHeading } from "../shared/SectionHeading";
import { SectionState } from "../shared/SectionState";
import Product from "./Product";

export default function FeaturedProducts({
  products,
  failed = false,
}: FeaturedProductsProps) {
  const { locale, searchQuery, setSearchQuery } = usePreferences();
  const t = getDictionary(locale);
  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.title} ${product.category.name}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      ),
    [products, searchQuery],
  );
  return (
    <section
      className="content-section products-section"
      id="featured-products"
    >
      <div className="products-title">
        <SectionHeading title={t.featured} />
        <label className="catalog-search">
          <FiSearch />
          <Input
            aria-label={t.search}
            placeholder={t.search}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </div>
      {failed ? (
        <SectionState state="error" />
      ) : visibleProducts.length === 0 ? (
        <SectionState state={products.length === 0 ? "empty" : "noMatches"} />
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      )}
    </section>
  );
}
