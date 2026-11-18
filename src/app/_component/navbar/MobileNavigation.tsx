import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import type { MobileNavigationProps } from "@/app/_types";
import SignOutButton from "../auth/SignOutButton";

export default function MobileNavigation({ copy, wishlistCount, cartCount, onClose, userName }: MobileNavigationProps) {
  return <div className="mobile-panel"><nav aria-label="Mobile navigation"><Link href="/" onClick={onClose}>{copy.home}</Link><Link href="/shop" onClick={onClose}>{copy.shop}</Link><Link href="/#categories" onClick={onClose}>{copy.categories}</Link><Link href="/brands" onClick={onClose}>{copy.brands}</Link><Link href="/contact" onClick={onClose}>{copy.support}</Link><Link href="/help" onClick={onClose}>{copy.help}</Link></nav><div><Link href={userName ? "/wishlist" : "/signin?callbackUrl=%2Fwishlist"} onClick={onClose}><FiHeart /> {copy.wishlist} ({wishlistCount})</Link><Link href={userName ? "/cart" : "/signin?callbackUrl=%2Fcart"} onClick={onClose}><FiShoppingCart /> {copy.cart} ({cartCount})</Link><Link href={userName ? "/account/profile" : "/signin"} onClick={onClose}><FiUser /> {userName ?? copy.signIn}</Link>{userName && <SignOutButton />}</div></div>;
}
