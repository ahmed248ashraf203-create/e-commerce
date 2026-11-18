"use client";

import type { ProductCardProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import ProductImage from "./ProductImage";
import ProductTools from "./ProductTools";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";
import Link from "next/link";

export default function Product({ product }: ProductCardProps) {
  const { locale, addToCart } = usePreferences();
  const t = getDictionary(locale);
  const categoryName =
    t.categoryNames[product.category.name.toLowerCase()] ??
    product.category.name;
  const discounted =
    typeof product.priceAfterDiscount === "number" &&
    product.priceAfterDiscount < product.price;
  const discount = discounted
    ? Math.round((1 - product.priceAfterDiscount! / product.price) * 100)
    : 0;
  const currentPrice = discounted ? product.priceAfterDiscount! : product.price;
  const rating = Math.max(
    0,
    Math.min(5, Math.round(product.ratingsAverage || 0)),
  );
  return (
    <article className="product-card">
      <ProductImage
        product={product}
        discount={discount}
        discounted={discounted}
      >
        <ProductTools product={product} />
      </ProductImage>
      <div className="product-info">
        <span className="product-category">{categoryName}</span>
        <h3 title={product.title}><Link href={`/viewproduct/${product._id}`}>{product.title}</Link></h3>
        <ProductRating
          rating={rating}
          average={product.ratingsAverage}
          quantity={product.ratingsQuantity}
        />
        <ProductPrice
          currentPrice={currentPrice}
          originalPrice={product.price}
          discounted={discounted}
          onAdd={() => addToCart(product._id)}
          addLabel={t.add}
        />
      </div>
    </article>
  );
}
