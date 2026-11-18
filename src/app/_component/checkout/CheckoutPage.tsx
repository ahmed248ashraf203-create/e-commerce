"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiCreditCard, FiHome, FiInfo, FiLock, FiMapPin, FiPhone, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { AuthFormEvent, CartSnapshot, SavedAddress, ShippingAddress } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getCommerceDictionary } from "@/lib/commerce-dictionary";
import { fetchAddresses, fetchCart, submitOrder } from "@/lib/store-client";
import { toast } from "@/lib/toast";

const emptyCart: CartSnapshot = { items: [], itemCount: 0, totalPrice: 0 };
const shippingFee = 50;

export default function CheckoutPage() {
  const { locale, refreshCart } = usePreferences();
  const t = getDictionary(locale);
  const copy = getCommerceDictionary(locale);
  const router = useRouter();
  const [cart, setCart] = useState<CartSnapshot>(emptyCart);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchCart(), fetchAddresses()]).then(([cartResult, addressResult]) => {
      if (!active) return;
      if (cartResult.ok) setCart(cartResult.data ?? emptyCart);
      else setError(cartResult.message ?? copy.checkoutError);
      if (addressResult.ok) {
        const savedAddresses = addressResult.data ?? [];
        setAddresses(savedAddresses);
        if (savedAddresses[0]) setSelectedAddress(savedAddresses[0]._id);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [copy.checkoutError]);

  function onAddressSelect(addressId: string) {
    setSelectedAddress(addressId);
    const form = document.querySelector<HTMLFormElement>("#checkout-form");
    if (!form) return;
    const address = addresses.find((item) => item._id === addressId);
    (form.elements.namedItem("city") as HTMLInputElement).value = address?.city ?? "";
    (form.elements.namedItem("details") as HTMLTextAreaElement).value = address?.details ?? "";
    (form.elements.namedItem("phone") as HTMLInputElement).value = address?.phone ?? "";
    if (!address) (form.elements.namedItem("postalCode") as HTMLInputElement).value = "";
  }

  async function placeOrder(event: AuthFormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const shippingAddress: ShippingAddress = {
      city: String(values.get("city") ?? "").trim(),
      details: String(values.get("details") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      postalCode: String(values.get("postalCode") ?? "").trim(),
    };
    const result = await submitOrder({ shippingAddress, paymentMethod });
    if (!result.ok) {
      const message = result.message ?? t.networkError;
      setError(message);
      toast.error(copy.checkoutError, message);
      setSubmitting(false);
      return;
    }

    const payload = result.data;
    const responseData = payload?.data;
    const onlineUrl = payload?.url ?? payload?.session?.url ?? (
      responseData && "session" in responseData ? responseData.session?.url ?? responseData.url : undefined
    );
    if (paymentMethod === "online") {
      if (!onlineUrl || !onlineUrl.startsWith("https://")) {
        setError(copy.checkoutError);
        toast.error(copy.checkoutError);
        setSubmitting(false);
        return;
      }
      window.location.assign(onlineUrl);
      return;
    }

    await refreshCart();
    toast.success(locale === "ar" ? "تم تأكيد طلبك بنجاح." : "Your order has been placed.");
    router.replace("/account/orders?placed=1");
    router.refresh();
  }

  const numberFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");
  const total = cart.totalPrice + shippingFee;

  return (
    <main className="checkout-page">
      <nav className="store-breadcrumb"><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><Link href="/cart">{getCommerceDictionary(locale).backToCart}</Link><span>/</span><span>{copy.checkoutTitle}</span></nav>
      <header className="checkout-heading"><div><span className="store-heading-icon"><FiShoppingBag /></span><div><h1>{copy.checkoutTitle}</h1><p>{copy.checkoutSubtitle}</p></div></div><Link href="/cart"><FiArrowLeft />{copy.backToCart}</Link></header>
      {loading ? <div className="store-loading" role="status">{copy.loading}</div> : error && !cart.itemCount ? <div className="store-state error" role="alert"><p>{error}</p><Button render={<Link href="/cart" />}>{copy.backToCart}</Button></div> : cart.items.length === 0 ? <section className="store-empty-state"><span className="empty-state-icon"><FiShoppingBag /></span><h2>{t.empty}</h2><Button render={<Link href="/shop" />}>{copy.startShopping}</Button></section> : (
        <form id="checkout-form" className="checkout-layout" onSubmit={placeOrder}>
          <div className="checkout-main-column">
            <section className="checkout-panel">
              <header><FiHome /><div><h2>{copy.shippingAddress}</h2><p>{copy.shippingHint}</p></div></header>
              <div className="checkout-panel-body">
                <div className="checkout-delivery-note"><FiInfo /><span><strong>{locale === "ar" ? "معلومات التوصيل" : "Delivery Information"}</strong><small>{locale === "ar" ? "تأكد من صحة العنوان ورقم الهاتف." : "Please make sure your address and phone are correct."}</small></span></div>
                {addresses.length > 0 && <label className="checkout-field checkout-field-wide"><span>{copy.myAddresses}</span><select value={selectedAddress} onChange={(event) => onAddressSelect(event.currentTarget.value)}><option value="">{locale === "ar" ? "أدخل عنوانًا جديدًا" : "Enter a new address"}</option>{addresses.map((address) => <option key={address._id} value={address._id}>{address.name ?? address.city} — {address.city}</option>)}</select></label>}
                <label className="checkout-field checkout-field-wide"><span>{copy.city} *</span><span className="checkout-input"><FiHome /><input name="city" placeholder={copy.cityPlaceholder} required /></span></label>
                <label className="checkout-field checkout-field-wide"><span>{copy.streetAddress} *</span><span className="checkout-input checkout-textarea"><FiMapPin /><textarea name="details" placeholder={copy.addressPlaceholder} rows={3} required /></span></label>
                <label className="checkout-field checkout-field-wide"><span>{copy.phone} *</span><span className="checkout-input"><FiPhone /><input name="phone" type="tel" placeholder={copy.phonePlaceholder} pattern="[+]?[0-9 ]{8,16}" autoComplete="tel" required /></span></label>
                <label className="checkout-field checkout-field-wide"><span>{copy.postalCode}</span><span className="checkout-input"><input name="postalCode" inputMode="numeric" autoComplete="postal-code" /></span></label>
                {error && <p className="auth-message error" role="alert">{error}</p>}
              </div>
            </section>

            <section className="checkout-panel">
              <header><FiCreditCard /><div><h2>{copy.paymentMethod}</h2><p>{locale === "ar" ? "اختر طريقة الدفع المناسبة" : "Choose how you'd like to pay"}</p></div></header>
              <div className="checkout-panel-body checkout-payment-options">
                <label className={`checkout-payment-option ${paymentMethod === "cash" ? "selected" : ""}`}><input type="radio" name="payment" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} /><span className="checkout-payment-icon">▣</span><span><strong>{copy.cashOnDelivery}</strong><small>{copy.cashDescription}</small></span>{paymentMethod === "cash" && <FiCheck />}</label>
                <label className={`checkout-payment-option ${paymentMethod === "online" ? "selected" : ""}`}><input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} /><span className="checkout-payment-icon"><FiCreditCard /></span><span><strong>{copy.payOnline}</strong><small>{copy.onlineDescription}</small></span>{paymentMethod === "online" && <FiCheck />}</label>
                <div className="checkout-secure-note"><FiLock /><span><strong>{locale === "ar" ? "دفع آمن ومشفر" : "Secure & Encrypted"}</strong><small>{locale === "ar" ? "بيانات الدفع محمية." : "Your payment information is protected."}</small></span></div>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <header><FiLock /><div><h2>{copy.orderSummary}</h2><p>{cart.itemCount} {locale === "ar" ? "منتج" : cart.itemCount === 1 ? "item" : "items"}</p></div></header>
            <div className="checkout-summary-products">{cart.items.map(({ product, count, unitPrice }) => <div className="checkout-summary-product" key={product._id}><Image src={product.imageCover} alt={product.title} width={58} height={58} /><span><strong>{product.title}</strong><small>{count} × {numberFormat.format(unitPrice)} EGP</small></span><b>{numberFormat.format(unitPrice * count)}</b></div>)}</div>
            <div className="checkout-summary-line"><span>{copy.subtotal}</span><strong>{numberFormat.format(cart.totalPrice)} EGP</strong></div>
            <div className="checkout-summary-line"><span>{copy.shipping}</span><strong>{numberFormat.format(shippingFee)} EGP</strong></div>
            <div className="checkout-summary-total"><span>{copy.total}</span><strong>{numberFormat.format(total)} <small>EGP</small></strong></div>
            <Button type="submit" className="checkout-submit" disabled={submitting}>{submitting ? copy.placingOrder : <><FiShoppingBag />{copy.placeOrder}</>}</Button>
            <div className="checkout-trust"><span><FiLock />{locale === "ar" ? "آمن" : "Secure"}</span><i /><span>🚚 {locale === "ar" ? "توصيل سريع" : "Fast Delivery"}</span><i /><span>↶ {locale === "ar" ? "إرجاع سهل" : "Easy Returns"}</span></div>
          </aside>
        </form>
      )}
    </main>
  );
}
