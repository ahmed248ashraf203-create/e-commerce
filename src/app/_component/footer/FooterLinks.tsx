import type { FooterContentProps } from "@/app/_types";
import Link from "next/link";

const footerGroups = {
  shop: ["allProducts", "categories", "brands", "electronics", "menFashion", "womenFashion"],
  account: ["myAccount", "orderHistory", "wishlist", "cart", "signIn", "createAccount"],
  support: ["contact", "help", "shippingInfo", "refunds", "track"],
  legal: ["privacy", "terms", "cookies"],
} as const;

export default function FooterLinks({ copy }: FooterContentProps) {
  const labels: Record<string, string> = { allProducts: copy.allProducts, categories: copy.categories, brands: copy.brands, electronics: copy.electronics, menFashion: copy.menFashion, womenFashion: copy.womenFashion, myAccount: copy.account, orderHistory: copy.orderHistory, wishlist: copy.wishlist, cart: copy.cart, signIn: copy.signIn, createAccount: copy.createAccount, contact: copy.contact, help: copy.help, shippingInfo: copy.shippingInfo, refunds: copy.refunds, track: copy.track, privacy: copy.privacy, terms: copy.terms, cookies: copy.cookies };
  const titles = { shop: copy.shop, account: copy.account, support: copy.support, legal: copy.legal };
  return <>{Object.entries(footerGroups).map(([group, links]) => <div className="footer-column" key={group}><h3>{titles[group as keyof typeof titles]}</h3>{links.map((key) => <Link key={key} href={key === "categories" ? "/#categories" : key === "brands" ? "/brands" : key === "wishlist" ? "/wishlist" : key === "cart" ? "/cart" : key === "contact" ? "/contact" : key === "help" ? "/help" : key === "shippingInfo" ? "/help#shipping" : key === "refunds" ? "/help#returns" : key === "track" ? "/help#orders" : key === "orderHistory" ? "/account/orders" : key === "myAccount" ? "/account/profile" : key === "signIn" ? "/signin" : key === "createAccount" ? "/signup" : "/shop"}>{labels[key]}</Link>)}</div>)}</>;
}
