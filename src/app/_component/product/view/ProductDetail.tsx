"use client";

import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../../preferences/Preferences";
import type { ProductDetailProps } from "@/app/_types";
import ProductGallery from "./ProductGallery";
import ProductPurchase from "./ProductPurchase";
import ProductTabs from "./ProductTabs";

export default function ProductDetail({ product }: ProductDetailProps) {
  const { locale, addToCart } = usePreferences();
  const t = getDictionary(locale);
  const categoryName =
    t.categoryNames[product.category.name.toLowerCase()] ??
    product.category.name;
  const subcategoryName = product.subcategory?.[0]?.name;
  const images = Array.from(
    new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean)),
  );
  return (
    <main className="product-detail-page">
      <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">
          <FiHome />
          {t.homeBreadcrumb}
        </Link>
        <FiChevronRight />
        <Link href="/#categories">{categoryName}</Link>
        {subcategoryName && (
          <>
            <FiChevronRight />
            <span>{subcategoryName}</span>
          </>
        )}
        <FiChevronRight />
        <span aria-current="page">{product.title}</span>
      </nav>
      <section className="product-detail-overview">
        <ProductGallery
          key={product._id}
          title={product.title}
          images={images}
        />
        <div className="product-detail-summary">
          <div className="detail-tags">
            <span>{categoryName}</span>
            {product.brand && <span>{product.brand.name}</span>}
          </div>
          <h1>{product.title}</h1>
          <ProductPurchase product={product} onAdd={(quantity) => addToCart(product._id, quantity)} />
        </div>
      </section>
      <ProductTabs product={product} />
    </main>
  );
}
