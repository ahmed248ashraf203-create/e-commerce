"use client";

import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";
import type { NewsletterSubmitEvent } from "@/app/_types";
import NewsletterPerks from "./NewsletterPerks";
import SubscribeForm from "./SubscribeForm";
import AppPromotion from "./AppPromotion";
import { toast } from "@/lib/toast";

export default function Newsletter() {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const [subscribed, setSubscribed] = useState(false);
  function subscribe(event: NewsletterSubmitEvent) {
    event.preventDefault();
    setSubscribed(true);
    toast.success(t.subscribed);
  }
  return <section className="newsletter-section" id="newsletter"><div className="newsletter-copy"><div className="newsletter-label"><span><FiMail /></span><div><strong>{t.newsletter}</strong><small>{t.subscribers}</small></div></div><h2>{t.freshUpdates}</h2><p>{t.weekly}</p><NewsletterPerks copy={t} /><SubscribeForm copy={t} subscribed={subscribed} onSubmit={subscribe} /></div>
    <AppPromotion copy={t} />
  </section>;
}
