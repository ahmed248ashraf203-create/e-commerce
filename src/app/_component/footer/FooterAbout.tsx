import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter, FiYoutube } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import type { FooterContentProps } from "@/app/_types";

export default function FooterAbout({ copy }: FooterContentProps) {
  return <div className="footer-about"><a className="footer-logo" href="#home"><HiOutlineShoppingCart />FreshCart</a><p>{copy.description}</p><a href="tel:+18001234567"><FiPhone /> +1 (800) 123-4567</a><a href="mailto:support@freshcart.com"><FiMail /> support@freshcart.com</a><span><FiMapPin /> 123 Commerce Street, New York, NY 10001</span><div className="social-links"><a href="#footer" aria-label="Facebook"><FiFacebook /></a><a href="#footer" aria-label="Twitter"><FiTwitter /></a><a href="#footer" aria-label="Instagram"><FiInstagram /></a><a href="#footer" aria-label="YouTube"><FiYoutube /></a></div></div>;
}
