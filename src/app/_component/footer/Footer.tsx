"use client";

import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";
import ClosingBenefits from "./ClosingBenefits";
import FooterAbout from "./FooterAbout";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  return <>
    <ClosingBenefits />
    <footer className="site-footer" id="footer"><div className="footer-main"><FooterAbout copy={t} /><FooterLinks copy={t} /></div><div className="footer-bottom"><span>© 2026 FreshCart. {t.copyright}</span><div className="payment-marks"><span>▰ Visa</span><span>▰ Mastercard</span><span>▰ PayPal</span></div></div></footer>
  </>;
}
