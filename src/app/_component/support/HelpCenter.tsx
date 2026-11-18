"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiHelpCircle, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function HelpCenter() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const faqItems = [
    { id: "orders", question: t.faqOrderQuestion, answer: t.faqOrderAnswer },
    { id: "shipping", question: t.faqShippingQuestion, answer: t.faqShippingAnswer },
    { id: "returns", question: t.faqReturnsQuestion, answer: t.faqReturnsAnswer },
    { id: "payments", question: t.faqPaymentQuestion, answer: t.faqPaymentAnswer },
  ];
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleFaqs = faqItems.filter(({ question, answer }) => `${question} ${answer}`.toLocaleLowerCase().includes(normalizedQuery));

  return <main className="support-page help-center-page">
    <header className="support-hero"><div className="support-breadcrumb"><Link href="/">{t.home}</Link><span>/</span><span>{t.helpTitle}</span></div><div className="support-hero-title"><span><FiHelpCircle /></span><div><h1>{t.helpTitle}</h1><p>{t.helpSubtitle}</p></div></div></header>
    <section className="help-center-content"><label className="help-search"><FiSearch /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchFaq} aria-label={t.searchFaq} /></label><div className="help-faq-heading"><h2>{t.faqTitle}</h2><span>{visibleFaqs.length} / {faqItems.length}</span></div><div className="help-faq-list">{visibleFaqs.map(({ id, question, answer }) => <details className="help-faq-item" id={id} key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}{visibleFaqs.length === 0 && <p className="help-empty" role="status">{t.noFaqMatches}</p>}</div><aside className="help-contact-card"><span><FiHelpCircle /></span><div><h2>{t.stillNeedHelp}</h2><p>{t.contactSubtitle}</p><Button render={<Link href="/contact" />}>{t.contactUs}<FiArrowRight /></Button></div></aside></section>
  </main>;
}
