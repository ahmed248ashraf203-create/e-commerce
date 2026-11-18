"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import type { ProductPreviewProps } from "@/app/_types";

export default function ProductPreview({
  product,
  categoryName,
  currentPrice,
  onClose,
}: ProductPreviewProps) {
  const { locale, addToCart } = usePreferences();
  const t = getDictionary(locale);
  return (
    <div className="preview-backdrop" role="presentation" onClick={onClose}>
      <div
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="preview-close"
          onClick={onClose}
          aria-label={locale === "ar" ? "إغلاق" : "Close"}
        >
          ×
        </button>
        <Image
          src={product.imageCover}
          alt={product.title}
          width={360}
          height={360}
        />
        <div>
          <span className="product-category">{categoryName}</span>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <strong>{currentPrice.toLocaleString()} EGP</strong>
          <Button onClick={() => addToCart(product._id)}>
            <FiPlus /> {t.add}
          </Button>
        </div>
      </div>
    </div>
  );
}
