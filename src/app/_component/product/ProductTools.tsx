"use client";

import { FiEye, FiHeart } from "react-icons/fi";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import type { ProductToolsProps } from "@/app/_types";
import Link from "next/link";

export default function ProductTools({ product }: ProductToolsProps) {
  const { locale, toggleWishlist, isWishlisted } = usePreferences();
  const t = getDictionary(locale);
  const wishlisted = isWishlisted(product._id);
  return (
      <div className="product-tools">
        <button
          type="button"
          aria-label={wishlisted ? t.removeWishlist : t.addWishlist}
          title={wishlisted ? t.removeWishlist : t.addWishlist}
          aria-pressed={wishlisted}
          className={wishlisted ? "selected" : ""}
          onClick={() => toggleWishlist(product._id)}
        >
          <FiHeart fill={wishlisted ? "currentColor" : "none"} />
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
