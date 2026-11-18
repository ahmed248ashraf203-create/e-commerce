"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { CartSnapshot } from "@/app/_types";
import { useAuth } from "../auth/AuthProvider";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getStoreDictionary } from "@/lib/store-dictionary";
import { fetchCart, mutateCart } from "@/lib/store-client";
import { toast } from "@/lib/toast";

const emptyCart: CartSnapshot = { items: [], itemCount: 0, totalPrice: 0 };

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { locale, refreshCart } = usePreferences();
  const t = getDictionary(locale);
  const copy = getStoreDictionary(locale);
  const [cart, setCart] = useState<CartSnapshot>(emptyCart);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [pendingItem, setPendingItem] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart(emptyCart);
      setFailed(false);
      setLoading(false);
      return;
    }
    const result = await fetchCart();
    await refreshCart();
    if (result.ok) {
      setCart(result.data ?? emptyCart);
      setFailed(false);
    } else {
      setFailed(true);
    }
    setLoading(false);
  }, [refreshCart, user]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    fetchCart().then((result) => {
      if (!active) return;
      void refreshCart();
      if (!user) {
        setCart(emptyCart);
        setFailed(false);
      } else if (result.ok) {
        setCart(result.data ?? emptyCart);
        setFailed(false);
      } else {
        setFailed(true);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, refreshCart, user]);

  async function updateItem(productId: string, count: number) {
    setPendingItem(productId);
    const result = count < 1
      ? await mutateCart(`/api/cart/${encodeURIComponent(productId)}`, "DELETE")
      : await mutateCart(`/api/cart/${encodeURIComponent(productId)}`, "PUT", { count });
    if (!result.ok) {
      toast.error(t.authRequestFailed, result.message);
      setPendingItem(null);
      return;
    }
    await loadCart();
    setPendingItem(null);
  }

  async function clearCart() {
    setPendingItem("all");
    const result = await mutateCart("/api/cart", "DELETE");
    if (!result.ok) {
      toast.error(t.authRequestFailed, result.message);
      setPendingItem(null);
      return;
    }
    await loadCart();
    setPendingItem(null);
  }

  const numberFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");

  return (
    <main className="cart-page">
      <nav className="store-breadcrumb"><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><span>{copy.cartTitle}</span></nav>
      <header className="store-page-heading"><span className="store-heading-icon cart-heading-icon"><FiShoppingCart /></span><div><h1>{copy.cartTitle}</h1><p>{numberFormat.format(cart.itemCount)} {copy.itemsInCart}</p></div></header>

      {loading ? <div className="store-loading" role="status">{copy.loading}</div> : failed ? <div className="store-state error" role="alert"><p>{copy.error}</p><Button onClick={() => { setLoading(true); void loadCart(); }}>{copy.retry}</Button></div> : cart.items.length === 0 ? (
        <section className="store-empty-state" role="status"><span className="empty-state-icon"><FiShoppingCart /></span><h2>{copy.emptyCartTitle}</h2><p>{copy.emptyCartText}</p><Button render={<Link href="/shop" />}>{copy.startShopping}<FiArrowLeft /></Button></section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items-panel">
            {cart.items.map(({ product, count, unitPrice }) => {
              const price = unitPrice;
              return <article className="cart-item" key={product._id}>
                <Link className="cart-item-image" href={`/viewproduct/${product._id}`}><Image src={product.imageCover} alt={product.title} width={120} height={120} /></Link>
                <div className="cart-item-info"><Link href={`/viewproduct/${product._id}`} className="cart-item-title">{product.title}</Link><span>{product.category.name}</span><strong>{numberFormat.format(price)} EGP</strong>
                  <div className="cart-quantity"><Button size="icon" variant="outline" aria-label={`${copy.quantity}: -1`} disabled={pendingItem === product._id || count <= 1} onClick={() => void updateItem(product._id, count - 1)}><FiMinus /></Button><output>{count}</output><Button size="icon" variant="outline" aria-label={`${copy.quantity}: +1`} disabled={pendingItem === product._id} onClick={() => void updateItem(product._id, count + 1)}><FiPlus /></Button></div>
                </div>
                <div className="cart-item-total"><span>{copy.total}</span><strong>{numberFormat.format(price * count)} EGP</strong><Button size="icon" variant="outline" aria-label={copy.remove} disabled={pendingItem === product._id} onClick={() => void updateItem(product._id, 0)}><FiTrash2 /></Button></div>
              </article>;
            })}
            <div className="cart-panel-actions"><Link href="/shop"><FiArrowLeft />{copy.continueShopping}</Link><Button variant="outline" disabled={pendingItem !== null} onClick={() => void clearCart()}><FiTrash2 />{copy.clearCart}</Button></div>
          </div>
          <aside className="cart-summary"><h2>{copy.orderSummary}</h2><div><span>{copy.subtotal} ({cart.itemCount} {cart.itemCount === 1 ? copy.item : copy.items})</span><strong>{numberFormat.format(cart.totalPrice)} EGP</strong></div><div><span>{copy.shipping}</span><strong className="cart-shipping-note">{copy.calculatedAtCheckout}</strong></div><div className="cart-estimated-total"><span>{copy.estimatedTotal}</span><strong>{numberFormat.format(cart.totalPrice)} EGP</strong></div><Button render={<Link href="/checkout" />}>{locale === "ar" ? "إتمام الشراء" : "Proceed to Checkout"}</Button><p>{copy.savedCartNote}</p></aside>
        </section>
      )}
    </main>
  );
}
