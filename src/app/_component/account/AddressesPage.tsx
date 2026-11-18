"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { AuthFormEvent, SavedAddress } from "@/app/_types";
import AccountNavigation from "./AccountNavigation";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { getCommerceDictionary } from "@/lib/commerce-dictionary";
import { fetchAddresses, removeAddress, saveAddress } from "@/lib/store-client";
import { toast } from "@/lib/toast";

export default function AddressesPage() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const copy = getCommerceDictionary(locale);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    const result = await fetchAddresses();
    setAddresses(result.data ?? []);
    setError(result.ok ? "" : result.message ?? t.networkError);
    setLoading(false);
  }, [t.networkError]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadAddresses(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAddresses]);

  async function addNewAddress(event: AuthFormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const result = await saveAddress({
      name: String(values.get("name") ?? "").trim(),
      city: String(values.get("city") ?? "").trim(),
      details: String(values.get("details") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      postalCode: String(values.get("postalCode") ?? "").trim(),
    });
    setSaving(false);
    if (!result.ok) {
      const message = result.message ?? t.networkError;
      setError(message);
      toast.error(t.authRequestFailed, message);
      return;
    }
    toast.success(locale === "ar" ? "تم حفظ العنوان." : "Address saved.");
    setShowForm(false);
    await loadAddresses();
  }

  async function deleteSavedAddress(addressId: string) {
    setPendingId(addressId);
    const result = await removeAddress(addressId);
    setPendingId("");
    if (!result.ok) {
      const message = result.message ?? t.networkError;
      setError(message);
      toast.error(t.authRequestFailed, message);
      return;
    }
    setAddresses((items) => items.filter((item) => item._id !== addressId));
    toast.success(locale === "ar" ? "تم حذف العنوان." : "Address removed.");
  }

  return <main className="account-page addresses-page">
    <header className="account-hero"><nav><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><span>{copy.account}</span></nav><div><span><FiMapPin /></span><section><h1>{copy.account}</h1><p>{locale === "ar" ? "إدارة عناوينك وإعدادات حسابك" : "Manage your addresses and account settings"}</p></section></div></header>
    <div className="account-workspace"><AccountNavigation active="addresses" /><section className="account-address-content"><header className="account-content-heading"><div><h2>{copy.addressesTitle}</h2><p>{copy.addressesDescription}</p></div><Button onClick={() => setShowForm((value) => !value)}><FiPlus />{copy.addAddress}</Button></header>
      {error && <div className="store-state error" role="alert"><p>{error}</p><Button variant="outline" onClick={() => void loadAddresses()}>{copy.retry}</Button></div>}
      {showForm && <section className="address-form-card"><h3>{copy.addAddress}</h3><form className="auth-form address-form" onSubmit={addNewAddress}>
        <label className="auth-field"><span className="auth-field-label">{copy.addressName}</span><input className="address-input" name="name" placeholder={copy.home} required /></label>
        <label className="auth-field"><span className="auth-field-label">{copy.city}</span><input className="address-input" name="city" placeholder={copy.cityPlaceholder} required /></label>
        <label className="auth-field address-field-wide"><span className="auth-field-label">{copy.streetAddress}</span><textarea className="address-input" name="details" placeholder={copy.addressPlaceholder} rows={3} required /></label>
        <label className="auth-field"><span className="auth-field-label">{copy.phone}</span><input className="address-input" name="phone" type="tel" placeholder={copy.phonePlaceholder} required /></label>
        <label className="auth-field"><span className="auth-field-label">{copy.postalCode}</span><input className="address-input" name="postalCode" inputMode="numeric" /></label>
        <div className="address-form-actions"><Button type="submit" disabled={saving}>{saving ? copy.savingAddress : copy.saveAddress}</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>{locale === "ar" ? "إلغاء" : "Cancel"}</Button></div>
      </form></section>}
      {loading ? <div className="store-loading" role="status">{copy.loading}</div> : addresses.length === 0 ? <section className="account-address-empty" role="status"><span><FiMapPin /></span><h3>{copy.noAddresses}</h3><p>{copy.noAddressesDescription}</p>{!showForm && <Button onClick={() => setShowForm(true)}><FiPlus />{copy.addFirstAddress}</Button>}</section> : <div className="address-list">{addresses.map((address) => <article className="saved-address-card" key={address._id}><div className="saved-address-icon"><FiMapPin /></div><div><strong>{address.name ?? copy.home}</strong><p>{address.details}</p><p>{address.city}{address.postalCode ? `, ${address.postalCode}` : ""}</p><small>{address.phone}</small></div><Button size="icon" variant="outline" aria-label={copy.removeAddress} disabled={pendingId === address._id} onClick={() => void deleteSavedAddress(address._id)}><FiTrash2 /></Button></article>)}</div>}
    </section></div>
  </main>;
}
