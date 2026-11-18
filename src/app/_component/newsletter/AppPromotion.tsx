import { FiDownload } from "react-icons/fi";
import type { NewsletterContentProps } from "@/app/_types";

export default function AppPromotion({ copy }: NewsletterContentProps) {
  return <aside className="app-promo"><span className="app-pill">📱 {copy.app}</span><h3>{copy.faster}</h3><p>{copy.appDeals}</p><a href="#newsletter" className="store-button"><span></span><small>DOWNLOAD ON<strong>App Store</strong></small></a><a href="#newsletter" className="store-button"><span>▷</span><small>GET IT ON<strong>Google Play</strong></small></a><div className="app-rating"><span>★★★★★</span> 4.9 · {copy.download}</div><FiDownload className="app-watermark" /></aside>;
}
