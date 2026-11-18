"use client";

import { FiHeart, FiShare2, FiShoppingCart, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { ProductPurchaseActionsProps } from "@/app/_types";

export default function ProductPurchaseActions({ addLabel, buyLabel, wishlistLabel, wishlisted, disabled, onAdd, onBuy, onWishlist }: ProductPurchaseActionsProps) {
  return <div className="detail-actions"><div className="detail-main-actions"><Button disabled={disabled} onClick={onAdd}><FiShoppingCart />{addLabel}</Button><Button disabled={disabled} variant="outline" className="buy-now-button" onClick={onBuy}><FiZap />{buyLabel}</Button></div><div className="detail-secondary-actions"><Button variant="outline" aria-pressed={wishlisted} onClick={onWishlist}><FiHeart fill={wishlisted ? "currentColor" : "none"} />{wishlistLabel}</Button><Button variant="outline" size="icon" aria-label="Share product" onClick={() => navigator.share?.({ title: document.title, url: location.href })}><FiShare2 /></Button></div></div>;
}
