"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DesktopNavigationProps } from "@/app/_types";

export default function DesktopNavigation({ copy, closeMobileMenu }: DesktopNavigationProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const router = useRouter();
  return <nav className="desktop-links" aria-label="Main navigation">
    <Link href="/" onClick={closeMobileMenu}>{copy.home}</Link>
    <Link href="/shop" onClick={closeMobileMenu}>{copy.shop}</Link>
    <DropdownMenu open={categoryOpen} onOpenChange={setCategoryOpen}>
      <DropdownMenuTrigger className="nav-dropdown">{copy.categories}<span aria-hidden="true">⌄</span></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="category-menu">
        {["Music", "Men's Fashion", "Women's Fashion", "Supermarket", "Baby & Toys", "Home", "Books", "Beauty & Health", "Mobiles", "Electronics"].map((name) => <DropdownMenuItem key={name} onClick={() => { setCategoryOpen(false); closeMobileMenu(); router.push(`/shop?category=${encodeURIComponent(name)}`); }}>{copy.categoryNames[name.toLowerCase()] ?? name}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
    <Link href="/brands" onClick={closeMobileMenu}>{copy.brands}</Link>
  </nav>;
}
