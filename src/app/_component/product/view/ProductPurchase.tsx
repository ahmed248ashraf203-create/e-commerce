"use client";

import { useState } from "react";
import { FiMinus, FiPlus, FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../../preferences/Preferences";
import type { ProductPurchaseProps } from "@/app/_types";
import ProductPurchaseActions from "./ProductPurchaseActions";

export default function ProductPurchase({ product, onAdd }: ProductPurchaseProps) {
  const { locale, toggleWishlist, isWishlisted } = usePreferences();
  const t = getDictionary(locale);
  const stock = Math.max(0, product.quantity ?? 0);
  const [quantity, setQuantity] = useState(stock > 0 ? 1 : 0);
  const price = product.priceAfterDiscount && product.priceAfterDiscount < product.price ? product.priceAfterDiscount : product.price;
  const wishlisted = isWishlisted(product._id);
  const handleAdd = () => onAdd(quantity);
  const handleBuy = () => onAdd(quantity);
  return <div className="detail-purchase"><div className="detail-rating"><span aria-label={`${product.ratingsAverage} out of 5`}>{[1, 2, 3, 4, 5].map((star) => <FiStar key={star} fill={star <= Math.round(product.ratingsAverage) ? "currentColor" : "none"} />)}</span><small>{product.ratingsAverage.toFixed(1)} ({product.ratingsQuantity} {t.reviewsTab.toLowerCase()})</small></div>
    <strong className="detail-price">{price.toLocaleString()} EGP</strong><span className={`stock-pill ${stock > 0 ? "in-stock" : "out-of-stock"}`}><i />{stock > 0 ? t.stock : t.outOfStock}</span>
    <div className="detail-description">{product.description?.replace(/[\t\n]+/g, " · ")}</div>
    <div className="quantity-label">{t.quantity}</div><div className="quantity-control"><Button variant="outline" size="icon" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><FiMinus /></Button><output aria-live="polite">{quantity}</output><Button variant="outline" size="icon" aria-label="Increase quantity" disabled={quantity >= stock} onClick={() => setQuantity((value) => Math.min(stock, value + 1))}><FiPlus /></Button><small>{stock} {t.available}</small></div>
    <div className="total-price"><span>{t.totalPrice}:</span><strong>{(price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP</strong></div>
    <ProductPurchaseActions addLabel={t.add} buyLabel={t.buyNow} wishlistLabel={wishlisted ? t.removeWishlist : t.addWishlist} wishlisted={wishlisted} disabled={stock === 0} onAdd={handleAdd} onBuy={handleBuy} onWishlist={() => toggleWishlist(product._id)} />
    <div className="detail-promises"><div><span>🚚</span><b>{t.freeDelivery}<small>{t.deliveryOrders}</small></b></div><div><span>↶</span><b>{t.thirtyDayReturn}<small>{t.moneyBack}</small></b></div><div><span>◈</span><b>{t.secure}<small>{t.protectedPayment}</small></b></div></div>
  </div>;
}
