"use client";

import { FiClock, FiMail, FiMapPin, FiPhone, FiSend, FiHeadphones } from "react-icons/fi";
import { FiHelpCircle } from "react-icons/fi";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/dictionary";
import { toast } from "@/lib/toast";
import { usePreferences } from "../preferences/Preferences";
import type { SupportFormEvent } from "@/app/_types";

export default function ContactSupport() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  function sendMessage(event: SupportFormEvent) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = String(values.get("subject") ?? t.contactUs);
    const body = [
      `${t.fullName}: ${String(values.get("name") ?? "")}`,
      `${t.emailAddress}: ${String(values.get("email") ?? "")}`,
      "",
      String(values.get("message") ?? ""),
    ].join("\n");
    toast.info(t.contactEmailNotice);
    window.location.href = `mailto:support@freshcart.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <main className="support-page contact-page">
    <header className="support-hero"><div className="support-breadcrumb"><Link href="/">{t.home}</Link><span>/</span><span>{t.contactUs}</span></div><div className="support-hero-title"><span><FiHeadphones /></span><div><h1>{t.contactUs}</h1><p>{t.contactSubtitle}</p></div></div></header>
    <div className="contact-content"><aside className="contact-sidebar">
      <article className="contact-info-card"><span><FiPhone /></span><div><h2>{t.phoneTitle}</h2><p>{t.phoneHours}</p><a href="tel:+18001234567">+1 (800) 123-4567</a></div></article>
      <article className="contact-info-card"><span><FiMail /></span><div><h2>{t.emailTitle}</h2><p>{t.emailResponse}</p><a href="mailto:support@freshcart.com">support@freshcart.com</a></div></article>
      <article className="contact-info-card"><span><FiMapPin /></span><div><h2>{t.officeTitle}</h2><p>123 Commerce Street<br />New York, NY 10001<br />United States</p></div></article>
      <article className="contact-info-card"><span><FiClock /></span><div><h2>{t.businessHours}</h2><p>Monday - Friday: 8am - 6pm<br />Saturday: 9am - 4pm<br />Sunday: Closed</p></div></article>
      <article className="contact-info-card contact-social-card"><h2>{t.followUs}</h2><div aria-label={t.followUs}><span><FaFacebookF /></span><span><FaTwitter /></span><span><FaInstagram /></span><span><FaLinkedinIn /></span></div></article>
    </aside><div className="contact-main-column"><section className="contact-form-card"><div className="contact-form-heading"><span><FiHeadphones /></span><div><h2>{t.sendUsMessage}</h2><p>{t.contactSubtitle}</p></div></div><form className="contact-form" onSubmit={sendMessage}>
      <label>{t.fullName}<Input name="name" autoComplete="name" placeholder="John Doe" required /></label>
      <label>{t.emailAddress}<Input name="email" type="email" autoComplete="email" placeholder="john@example.com" required /></label>
      <label className="contact-form-wide">{t.subject}<select name="subject" defaultValue="" required><option value="" disabled>{t.selectSubject}</option><option>{t.orderSubject}</option><option>{t.shippingSubject}</option><option>{t.returnSubject}</option><option>{t.paymentSubject}</option><option>{t.otherSubject}</option></select></label>
      <label className="contact-form-wide">{t.message}<textarea name="message" placeholder={t.messagePlaceholder} rows={5} required /></label>
      <Button className="contact-form-wide" type="submit"><FiSend />{t.sendMessage}</Button>
    </form></section><aside className="contact-help-callout"><span><FiHelpCircle /></span><div><h3>{t.helpQuickAnswers}</h3><p>{t.helpSubtitle}</p><Link href="/help">{t.helpTitle} →</Link></div></aside></div></div>
  </main>;
}
