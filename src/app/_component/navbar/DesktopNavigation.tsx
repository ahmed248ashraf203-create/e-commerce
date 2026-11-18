"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DesktopNavigationProps } from "@/app/_types";
import { FiGrid } from "react-icons/fi";

export default function DesktopNavigation({ copy, categories, closeMobileMenu }: DesktopNavigationProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const router = useRouter();
  return <nav className="desktop-links" aria-label="Main navigation">
    <Link href="/" onClick={closeMobileMenu}>{copy.home}</Link>
    <Link href="/shop" onClick={closeMobileMenu}>{copy.shop}</Link>
    <DropdownMenu open={categoryOpen} onOpenChange={setCategoryOpen}>
      <DropdownMenuTrigger className="nav-dropdown" aria-expanded={categoryOpen}><span>{copy.categories}</span><span className={`category-chevron${categoryOpen ? " is-open" : ""}`} aria-hidden="true">⌄</span></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="category-menu">
        <div className="category-menu-heading"><span className="category-menu-heading-icon"><FiGrid /></span><span><strong>{copy.categories}</strong><small>{categories.length} {copy.categories.toLowerCase()}</small></span></div>
        <div className="category-menu-list">
          {categories.map((category) => <DropdownMenuItem className="category-menu-item" key={category._id} onClick={() => { setCategoryOpen(false); closeMobileMenu(); router.push(`/shop?category=${encodeURIComponent(category.name)}`); }}>{copy.categoryNames[category.name.toLowerCase()] ?? category.name}<span aria-hidden="true">→</span></DropdownMenuItem>)}
          {categories.length === 0 && <DropdownMenuItem className="category-menu-item" onClick={() => { setCategoryOpen(false); router.push("/shop"); }}>{copy.shop}<span aria-hidden="true">→</span></DropdownMenuItem>}
        </div>
        <DropdownMenuItem className="category-menu-all" onClick={() => { setCategoryOpen(false); router.push("/shop"); }}>{copy.allProducts}<span aria-hidden="true">→</span></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Link href="/brands" onClick={closeMobileMenu}>{copy.brands}</Link>
  </nav>;
}
