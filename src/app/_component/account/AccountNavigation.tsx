"use client";

import Link from "next/link";
import { FiChevronRight, FiMapPin, FiPackage, FiSettings } from "react-icons/fi";
import type { AccountNavigationProps } from "@/app/_types";
import { getCommerceDictionary } from "@/lib/commerce-dictionary";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function AccountNavigation({ active }: AccountNavigationProps) {
  const { locale } = usePreferences();
  const copy = getCommerceDictionary(locale);
  const t = getDictionary(locale);
  return <aside className="account-navigation"><h2>{copy.account}</h2><nav>
    <Link className={active === "addresses" ? "active" : ""} href="/account/addresses"><FiMapPin />{copy.myAddresses}<FiChevronRight /></Link>
    <Link className={active === "settings" ? "active" : ""} href="/account/profile"><FiSettings />{copy.settings}<FiChevronRight /></Link>
    <Link className={active === "orders" ? "active" : ""} href="/account/orders"><FiPackage />{t.orderHistory}<FiChevronRight /></Link>
  </nav></aside>;
}
