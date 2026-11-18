"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { Product } from "@/app/_types";
import { useAuth } from "../auth/AuthProvider";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getStoreDictionary } from "@/lib/store-dictionary";
import { fetchWishlist, mutateWishlist } from "@/lib/store-client";
import { toast } from "@/lib/toast";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { locale, addToCart, refreshWishlist } = usePreferences();
  const t = getDictionary(locale);
  const copy = getStoreDictionary(locale);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    fetchWishlist().then((result) => {
      if (!active) return;
      if (!user) {
        setItems([]);
        setFailed(false);
      } else if (result.ok) {
        setItems(result.data ?? []);
        setFailed(false);
      } else {
        setFailed(true);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, user]);

  async function removeItem(productId: string) {
    setRemovingId(productId);
    const result = await mutateWishlist(productId, true);
    if (!result.ok) {
      toast.error(t.authRequestFailed, result.message);
      setRemovingId(null);
      return;
    }
    setItems((current) => current.filter((product) => product._id !== productId));
    await refreshWishlist();
    toast.success(t.removedFromWishlist);
    setRemovingId(null);
  }

  const numberFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");

  return (
    <main className="wishlist-page">
      <nav className="store-breadcrumb"><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><span>{copy.wishlistTitle}</span></nav>
      <header className="store-page-heading"><span className="store-heading-icon wishlist-heading-icon"><FiHeart fill="currentColor" /></span><div><h1>{copy.wishlistTitle}</h1><p>{numberFormat.format(items.length)} {copy.savedItems}</p></div></header>

      {loading ? <div className="store-loading" role="status">{copy.loading}</div> : failed ? <div className="store-state error" role="alert"><p>{copy.error}</p><Button onClick={() => window.location.reload()}>{copy.retry}</Button></div> : items.length === 0 ? (
        <section className="store-empty-state wishlist-empty-state" role="status"><span className="empty-state-icon wishlist-empty-icon"><FiHeart /></span><h2>{copy.emptyWishlistTitle}</h2><p>{copy.emptyWishlistText}</p>{!user && <p className="wishlist-sync-note">{copy.signInToSync}</p>}<Button render={<Link href="/shop" />}>{copy.browseProducts}<FiArrowLeft /></Button>{!user && <Button variant="outline" render={<Link href="/signin?callbackUrl=%2Fwishlist" />}>{copy.signIn}</Button>}</section>
      ) : (
        <section className="wishlist-list" aria-label={copy.wishlistTitle}>
          <div className="wishlist-table-heading"><span>{t.allProducts}</span><span>{copy.price}</span><span>{copy.inStock}</span><span>{t.add}</span></div>
          {items.map((product) => {
            const price = product.priceAfterDiscount && product.priceAfterDiscount < product.price ? product.priceAfterDiscount : product.price;
            const inStock = (product.quantity ?? 0) > 0;
            return <article className="wishlist-row" key={product._id}>
              <Link className="wishlist-product" href={`/viewproduct/${product._id}`}><Image src={product.imageCover} alt={product.title} width={88} height={88} /><span><strong>{product.title}</strong><small>{product.category.name}</small></span></Link>
              <strong className="wishlist-price">{numberFormat.format(price)} EGP</strong>
              <span className={`wishlist-stock ${inStock ? "available" : "unavailable"}`}><i />{inStock ? copy.inStock : t.outOfStock}</span>
              <div className="wishlist-actions">{inStock ? <Button onClick={() => void addToCart(product._id)}><FiShoppingCart />{copy.addToCart}</Button> : <Button disabled>{t.outOfStock}</Button>}<Button size="icon" variant="outline" aria-label={copy.remove} disabled={removingId === product._id} onClick={() => void removeItem(product._id)}><FiTrash2 /></Button></div>
            </article>;
          })}
          <Link className="wishlist-continue" href="/shop"><FiArrowLeft />{copy.continueShopping}</Link>
        </section>
      )}
    </main>
  );
}
