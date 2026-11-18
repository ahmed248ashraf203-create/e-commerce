"use client";

import { useState } from "react";
import { FiCheck, FiPackage, FiStar } from "react-icons/fi";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../../preferences/Preferences";
import type { ProductDetailTab, ProductDetailTabItem, ProductTabsProps } from "@/app/_types";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTab>("details");
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const tabLabels: ProductDetailTabItem[] = [{ key: "details", label: t.productDetails, icon: <FiPackage /> }, { key: "reviews", label: `${t.reviewsTab} (${product.ratingsQuantity})`, icon: <FiStar /> }, { key: "shipping", label: t.shippingReturns, icon: <FiPackage /> }];
  return <section className="product-detail-tabs"><div className="detail-tab-list" role="tablist">{tabLabels.map(({ key, label, icon }) => <button type="button" role="tab" aria-selected={activeTab === key} className={activeTab === key ? "active" : ""} key={key} onClick={() => setActiveTab(key)}>{icon}{label}</button>)}</div>
    <div className="detail-tab-content" role="tabpanel">
      {activeTab === "details" && <><h2>{t.aboutProduct}</h2><p>{product.description?.replace(/[\t\n]+/g, " · ")}</p><div className="product-facts"><div><h3>{t.productInfo}</h3><dl><div><dt>{t.category}</dt><dd>{product.category.name}</dd></div><div><dt>{t.subcategory}</dt><dd>{product.subcategory?.map(({ name }) => name).join(", ") || "—"}</dd></div><div><dt>{t.brand}</dt><dd>{product.brand?.name || "—"}</dd></div><div><dt>{t.itemsSold}</dt><dd>{(product.sold ?? 0).toLocaleString()}+</dd></div></dl></div><div><h3>{t.keyFeatures}</h3><ul className="key-features"><li><FiCheck />{t.premiumQuality}</li><li><FiCheck />{t.authenticGuarantee}</li><li><FiCheck />{t.securePackaging}</li><li><FiCheck />{t.qualityTested}</li></ul></div></div></>}
      {activeTab === "reviews" && <div className="product-reviews">{product.reviews?.length ? product.reviews.map((review, index) => <article key={review._id ?? index}><strong>{review.user?.name ?? "Customer"}</strong><span>{"★".repeat(Math.max(0, Math.min(5, review.rating ?? 0)))}</span><p>{review.review}</p>{review.createdAt && <small>{new Date(review.createdAt).toLocaleDateString(locale)}</small>}</article>) : <p>{t.noReviews}</p>}</div>}
      {activeTab === "shipping" && <div className="shipping-copy"><p>{t.deliveryEstimate}</p><p>{t.returnPolicyText}</p></div>}
    </div>
  </section>;
}
