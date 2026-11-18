"use client";

import {
  FiCheck,
  FiLock,
  FiMail,
  FiShield,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import type { AuthShellProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import GroceryCartIllustration from "./GroceryCartIllustration";

export default function AuthShell({ variant, children }: AuthShellProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const storyTitle =
    variant === "forgot"
      ? t.resetSideTitle
      : variant === "signup"
        ? t.authWelcome
        : t.authOneStop;
  const storyDescription =
    variant === "forgot"
      ? t.resetSideDescription
      : variant === "signup"
        ? t.authJoin
        : t.authDailyNeeds;
  const benefits =
    variant === "forgot"
      ? [
          { icon: <FiMail />, label: t.emailVerification },
          { icon: <FiShield />, label: t.secureReset },
          { icon: <FiLock />, label: t.encrypted },
        ]
      : [
          { icon: <FiCheck />, label: t.authPremiumQuality },
          { icon: <FiTruck />, label: t.fastDelivery },
          { icon: <FiShield />, label: t.secureShopping },
        ];
  return (
    <main className={`auth-page auth-page-${variant}`}>
      <section className="auth-story">
        {variant === "signin" ? (
          <GroceryCartIllustration />
        ) : variant === "forgot" ? (
          <div
            className="auth-illustration illustration-forgot"
            aria-hidden="true"
          >
            <span className="auth-orb orb-one" />
            <span className="auth-orb orb-two" />
            <span className="auth-orb orb-three" />
            <div className="auth-art-side">
              <FiMail />
            </div>
            <div className="auth-art-main">
              <FiLock />
            </div>
            <div className="auth-art-side">
              <FiShield />
            </div>
            <div className="auth-art-dots">
              <i />
              <i />
              <i />
            </div>
          </div>
        ) : null}
        <h1>
          {variant === "signup" ? (
            <>
              Welcome to <span>FreshCart</span>
            </>
          ) : (
            storyTitle
          )}
        </h1>
        <p>{storyDescription}</p>
        <ul className="auth-benefits">
          {benefits.map(({ icon, label }, index) => (
            <li key={label}>
              <span className="auth-benefit-icon">{icon}</span>
              <span>
                <strong>{label}</strong>
                <small>
                  {variant === "signup"
                    ? [
                        t.premiumQualityDetail,
                        t.fastDeliveryDetail,
                        t.secureShoppingDetail,
                      ][index]
                    : label}
                </small>
              </span>
            </li>
          ))}
        </ul>
        {variant === "signup" && (
          <blockquote className="auth-testimonial">
            <span className="testimonial-avatar">S</span>
            <div>
              <strong>{t.testimonialName}</strong>
              <span className="testimonial-stars">★★★★★</span>
              <p>{t.testimonialQuote}</p>
            </div>
          </blockquote>
        )}
      </section>
      <section className="auth-panel">
        {children}
        <div className="auth-security">
          <span>
            <FiLock />
            {t.sslSecured}
          </span>
          <span>
            <FiShoppingCart />
            {t.happyShoppers}
          </span>
          <span>★ {t.customerRating}</span>
        </div>
      </section>
    </main>
  );
}
