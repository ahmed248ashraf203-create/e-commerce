"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartApiResponse, Locale, PreferencesContextValue, PreferencesProviderProps, Theme } from "@/app/_types";
import { getDictionary } from "@/lib/dictionary";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import { fetchCart, fetchWishlist, mutateWishlist, normalizeCart } from "@/lib/store-client";

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem("freshcart-locale");
    const savedTheme = localStorage.getItem("freshcart-theme");
    queueMicrotask(() => {
      if (savedLocale === "ar" || savedLocale === "en") setLocale(savedLocale);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
      setPreferencesReady(true);
    });
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("freshcart-locale", locale);
  }, [locale, preferencesReady]);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("freshcart-theme", theme);
  }, [theme, preferencesReady]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    fetch("/api/cart", { cache: "no-store" })
      .then(async (response) => ({ ok: response.ok, data: await response.json() as CartApiResponse }))
      .then(({ ok, data }) => {
        if (!active) return;
        if (!user || !ok) {
          setCartCount(0);
          return;
        }
        setCartCount(normalizeCart(data).itemCount);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    fetchWishlist().then((result) => {
      if (!active) return;
      setWishlist(user && result.ok ? (result.data ?? []).map((product) => product._id) : []);
    });
    return () => { active = false; };
  }, [authLoading, user]);

  const toggleWishlist = useCallback(async (productId: string) => {
    const isSaved = wishlist.includes(productId);
    let currentUser = user;
    if (authLoading || !currentUser) currentUser = await refreshUser();
    if (!currentUser) {
      router.push("/signin?callbackUrl=%2Fwishlist");
      return;
    }
    const result = await mutateWishlist(productId, isSaved);
    if (!result.ok) {
      toast.error(getDictionary(locale).authRequestFailed, result.message);
      return;
    }
    setWishlist((items) => isSaved ? items.filter((item) => item !== productId) : [...items, productId]);
    const copy = getDictionary(locale);
    toast.success(isSaved ? copy.removedFromWishlist : copy.addedToWishlist);
  }, [authLoading, locale, refreshUser, router, user, wishlist]);
  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const result = await fetchWishlist();
    if (result.ok) setWishlist((result.data ?? []).map((product) => product._id));
  }, [user]);
  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    const result = await fetchCart();
    if (result.ok) setCartCount(result.data?.itemCount ?? 0);
  }, [user]);
  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);
  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    let currentUser = user;
    if (authLoading || !currentUser) currentUser = await refreshUser();
    if (!currentUser) {
      router.push("/signin?callbackUrl=%2F");
      return;
    }
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json().catch(() => ({})) as CartApiResponse;
      if (!response.ok) {
        toast.error(getDictionary(locale).authRequestFailed, data.message);
        return;
      }
      const count = normalizeCart(data).itemCount;
      setCartCount(count > 0 ? count : (current) => current + quantity);
      toast.success(getDictionary(locale).addedToCart);
    } catch {
      toast.error(getDictionary(locale).networkError);
    }
  }, [authLoading, locale, refreshUser, router, user]);
  const value = useMemo<PreferencesContextValue>(() => ({
    locale, theme, setLocale, toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light"),
    searchQuery, setSearchQuery, cartCount, refreshCart, wishlistCount: wishlist.length,
    addToCart, toggleWishlist, refreshWishlist, isWishlisted,
  }), [locale, theme, searchQuery, cartCount, refreshCart, wishlist, addToCart, toggleWishlist, refreshWishlist, isWishlisted]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
