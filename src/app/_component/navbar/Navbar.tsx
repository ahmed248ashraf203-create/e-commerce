"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeadphones, FiHeart, FiMail, FiMenu, FiMoon, FiPhone, FiSearch, FiShoppingCart, FiSun, FiUser, FiX } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "../preferences/Preferences";
import { useAuth } from "../auth/AuthProvider";
import SignOutButton from "../auth/SignOutButton";
import { getDictionary } from "@/lib/dictionary";
import type { SearchSubmitEvent } from "@/app/_types";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export default function Navbar() {
  const { locale, setLocale, theme, toggleTheme, searchQuery, setSearchQuery, cartCount, wishlistCount } = usePreferences();
  const { user } = useAuth();
  const router = useRouter();
  const t = getDictionary(locale);
  const cartHref = user ? "/cart" : "/signin?callbackUrl=%2Fcart";
  const wishlistHref = user ? "/wishlist" : "/signin?callbackUrl=%2Fwishlist";
  const [menuOpen, setMenuOpen] = useState(false);
  const submitSearch = (event: SearchSubmitEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  };
  return <header className="site-header">
    <div className="topbar"><div className="topbar-promos"><span>▣ {t.shipping}</span><span>✦ {t.arrivals}</span></div><div className="topbar-actions"><a href="tel:+18001234567"><FiPhone /> +1 (800) 123-4567</a><a href="mailto:support@freshcart.com"><FiMail /> support@freshcart.com</a><button type="button" className="tiny-switch" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>{locale === "en" ? "عربي" : "EN"}</button><button type="button" className="tiny-switch" aria-label={theme === "light" ? t.switchToDark : t.switchToLight} onClick={toggleTheme}>{theme === "light" ? <FiMoon /> : <FiSun />}</button><Link href={user ? "/account/profile" : "/signin"}>{user?.name ?? t.signIn}</Link><Link href={user ? "/account/profile" : "/signup"}>{user ? t.account : t.signUp}</Link></div></div>
    <div className="main-nav">
      <Link className="brand-logo" href="/" aria-label="FreshCart home"><HiOutlineShoppingCart /><span>FreshCart</span></Link>
      <form className="nav-search" onSubmit={submitSearch}><Input aria-label={t.search} placeholder={t.search} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /><Button type="submit" aria-label="Search"><FiSearch /></Button></form>
      <DesktopNavigation copy={t} closeMobileMenu={() => setMenuOpen(false)} />
      <div className="nav-actions"><Link className="support-link" href="/contact"><span className="support-icon"><FiHeadphones /></span><span>{t.support}</span></Link><Link className="nav-icon" href={wishlistHref} aria-label={`${t.wishlist} ${wishlistCount}`}><FiHeart />{wishlistCount > 0 && <b>{wishlistCount}</b>}</Link><Link className="nav-icon" href={cartHref} aria-label={`${t.cart} ${cartCount}`}><FiShoppingCart />{cartCount > 0 && <b>{cartCount}</b>}</Link>{user ? <SignOutButton /> : <Button className="nav-signin" onClick={() => router.push("/signin")}><FiUser />{t.signIn}</Button>}</div>
      <Button variant="outline" size="icon" className="mobile-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX /> : <FiMenu />}</Button>
    </div>
    {menuOpen && <MobileNavigation copy={t} wishlistCount={wishlistCount} cartCount={cartCount} userName={user?.name} onClose={() => setMenuOpen(false)} />}
  </header>;
}
