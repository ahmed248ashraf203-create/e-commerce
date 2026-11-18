"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiBox, FiCheckCircle, FiClock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { Order } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getCommerceDictionary } from "@/lib/commerce-dictionary";
import { fetchOrders } from "@/lib/store-client";

export default function OrdersPage() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const copy = getCommerceDictionary(locale);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await fetchOrders();
    setOrders(result.data ?? []);
    setFailed(!result.ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadOrders(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  const numberFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");
  const dateFormat = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "medium" });

  return (
    <main className="account-page orders-page">
      <nav className="store-breadcrumb"><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><Link href="/account/profile">{copy.account}</Link><span>/</span><span>{copy.ordersTitle}</span></nav>
      <header className="account-content-heading"><div><h1>{copy.ordersTitle}</h1><p>{locale === "ar" ? "تابع مشترياتك وحالة كل طلب." : "Track your purchases and the status of every order."}</p></div><Link href="/shop"><FiArrowRight />{copy.startShopping}</Link></header>
      {loading ? <div className="store-loading" role="status">{copy.loading}</div> : failed ? <div className="store-state error" role="alert"><p>{t.error}</p><Button onClick={() => void loadOrders()}>{copy.retry}</Button></div> : orders.length === 0 ? (
        <section className="store-empty-state orders-empty" role="status"><span className="empty-state-icon"><FiBox /></span><h2>{copy.noOrders}</h2><p>{copy.noOrdersDescription}</p><Button render={<Link href="/shop" />}>{copy.startShopping}<FiArrowRight /></Button></section>
      ) : (
        <section className="orders-list" aria-label={copy.ordersTitle}>
          {orders.map((order) => {
            const id = order._id ?? order.id ?? "";
            const date = order.createdAt ? new Date(order.createdAt) : null;
            const orderItems = order.cartItems ?? [];
            return <article className="order-card" key={id}>
              <header><div><strong>{copy.order} #{id.slice(-8).toUpperCase()}</strong><small>{date && !Number.isNaN(date.getTime()) ? dateFormat.format(date) : "—"}</small></div><span className={`order-status ${order.isDelivered ? "delivered" : "processing"}`}>{order.isDelivered ? <FiCheckCircle /> : <FiClock />}{order.isDelivered ? copy.delivered : copy.processing}</span></header>
              <div className="order-items">{orderItems.slice(0, 3).map((line, index) => {
                const product = typeof line.product === "string" ? undefined : line.product;
                if (!product) return null;
                return <div className="order-item" key={product._id ?? index}><Image src={product.imageCover} alt={product.title} width={58} height={58} /><span><strong>{product.title}</strong><small>{line.count ?? 1} × {numberFormat.format(product.price)} EGP</small></span></div>;
              })}</div>
              <footer><span>{copy.orderStatus}: <strong>{order.isPaid ? copy.paid : copy.unpaid}</strong></span><strong>{numberFormat.format(order.totalOrderPrice ?? 0)} EGP</strong></footer>
            </article>;
          })}
        </section>
      )}
    </main>
  );
}
