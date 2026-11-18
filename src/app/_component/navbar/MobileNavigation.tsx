import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import type { MobileNavigationProps } from "@/app/_types";
import SignOutButton from "../auth/SignOutButton";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function MobileNavigation({ copy, categories, wishlistCount, cartCount, onClose, userName }: MobileNavigationProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  return <div className="mobile-panel"><nav aria-label="Mobile navigation"><Link href="/" onClick={onClose}>{copy.home}</Link><Link href="/shop" onClick={onClose}>{copy.shop}</Link><button className="mobile-category-trigger" type="button" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((open) => !open)}>{copy.categories}<FiChevronDown className={categoriesOpen ? "is-open" : ""} /></button>{categoriesOpen && <div className="mobile-category-list">{categories.map((category) => <Link key={category._id} href={`/shop?category=${encodeURIComponent(category.name)}`} onClick={onClose}>{copy.categoryNames[category.name.toLowerCase()] ?? category.name}</Link>)}<Link href="/shop" onClick={onClose}>{copy.allProducts}</Link></div>}<Link href="/brands" onClick={onClose}>{copy.brands}</Link><Link href="/contact" onClick={onClose}>{copy.support}</Link><Link href="/help" onClick={onClose}>{copy.help}</Link></nav><div><Link href={userName ? "/wishlist" : "/signin?callbackUrl=%2Fwishlist"} onClick={onClose}><FiHeart /> {copy.wishlist} ({wishlistCount})</Link><Link href={userName ? "/cart" : "/signin?callbackUrl=%2Fcart"} onClick={onClose}><FiShoppingCart /> {copy.cart} ({cartCount})</Link><Link href={userName ? "/account/profile" : "/signin"} onClick={onClose}><FiUser /> {userName ?? copy.signIn}</Link>{userName && <SignOutButton />}</div></div>;
}
