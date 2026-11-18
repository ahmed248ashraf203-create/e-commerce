"use client";

import { useState } from "react";
import { FiEye, FiHeart, FiRefreshCw } from "react-icons/fi";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import type { ProductToolsProps } from "@/app/_types";
import Link from "next/link";

export default function ProductTools({ product }: ProductToolsProps) {
  const { locale, toggleWishlist, isWishlisted } = usePreferences();
  const t = getDictionary(locale);
  const [compared, setCompared] = useState(false);
  const wishlisted = isWishlisted(product._id);
  return (
      <div className="product-tools">
        <button
          type="button"
          aria-label={t.wishlist}
          aria-pressed={wishlisted}
          className={wishlisted ? "selected" : ""}
          onClick={() => toggleWishlist(product._id)}
        >
          <FiHeart />
        </button>
        <button
          type="button"
          aria-label={locale === "ar" ? "قارن المنتج" : "Compare product"}
          aria-pressed={compared}
          className={compared ? "selected" : ""}
          onClick={() => setCompared(!compared)}
        >
          <FiRefreshCw />
        </button>
        <Link
          href={`/viewproduct/${product._id}`}
          aria-label={locale === "ar" ? "معاينة المنتج" : "Preview product"}
        >
          <FiEye />
        </Link>
      </div>
  );
}
