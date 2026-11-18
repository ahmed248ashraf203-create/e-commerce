"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function NotFoundContent() {
  const router = useRouter();
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  return <main className="not-found-page">
    <span className="not-found-decoration apple-one" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 10c-3-4-1-8 3-9 1 4 0 7-3 9Zm0 2c-4-4-11-2-11 4 0 8 5 14 10 14 2 0 3-1 5-1s3 1 5 1c3 0 7-6 7-13 0-5-5-8-10-5-2 1-4 1-6 0Z" /></svg></span>
    <span className="not-found-decoration carrot-one" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M13 10 5 3l1 9-5-2 6 8 4-3 4 3 2-4-4-4Zm6 4 9-9 2 2-8 10-7 12-4-2 6-13 2 0Z" /></svg></span>
    <span className="not-found-decoration apple-two" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 10c-2-3-1-6 2-8 1 3 0 6-2 8Zm0 2c-4-4-10-2-10 4 0 7 5 13 10 13 2 0 3-1 5-1s3 1 5 1c3 0 6-6 6-12 0-5-5-8-10-5-2 1-4 1-6 0Z" /></svg></span>
    <span className="not-found-decoration carrot-two" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m17 13 9-10 3 2-8 11-9 14-5-3 8-14 2 0ZM13 10 8 2l-1 8-6-2 7 8 5-3 3 2 2-4-5-3Z" /></svg></span>
    <span className="not-found-decoration leaf-one" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M28 3C14 2 4 7 4 18c0 6 4 10 9 10 11 0 15-12 15-25ZM8 25c5-7 10-12 17-17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></span>
    <span className="not-found-decoration sprout-one" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 28V14M16 17C6 18 3 12 4 5c8 0 13 4 12 12Zm1-5c0-7 4-11 11-11 1 7-3 12-11 13Z" /></svg></span>
    <section className="not-found-content"><div className="not-found-art"><div className="not-found-cart" aria-hidden="true"><svg viewBox="0 0 576 512" focusable="false"><path fill="currentColor" d="M0 24C0 10.7 10.7 0 24 0h45.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-45.6 168.2A64 64 0 0 1 462.3 298H162.7l8.2 40H464a24 24 0 1 1 0 48H151.3a24 24 0 0 1-23.5-19.2L73.2 48H24A24 24 0 0 1 0 24Zm176 400a44 44 0 1 1-88 0 44 44 0 0 1 88 0Zm288 0a44 44 0 1 1-88 0 44 44 0 0 1 88 0Z" /></svg></div><span>404</span></div><div className="not-found-dots"><i /><i /><i /></div><h1>{t.page404Title}</h1><p>{t.page404Message}</p><div className="not-found-actions"><Button render={<Link href="/" />}><FiHome />{t.goHome}</Button><Button variant="outline" onClick={() => router.back()}><FiArrowLeft />{t.goBack}</Button></div><div className="not-found-destinations"><span>{t.popularDestinations}</span><nav><Link href="/shop">{t.allProducts}</Link><Link href="/#categories">{t.categories}</Link><Link href="/#deals">{t.todaysDeals}</Link><Link href="/contact">{t.contactUs}</Link></nav></div></section>
  </main>;
}
