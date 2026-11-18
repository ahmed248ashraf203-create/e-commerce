"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail } from "react-icons/fi";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { signIn as authenticate } from "next-auth/react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import type { AuthFormEvent, AuthFormPageProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { useAuth } from "./AuthProvider";
import AuthField from "./AuthField";
import PasswordField from "./PasswordField";
import { getDictionary } from "@/lib/dictionary";
import { getSignInErrorMessage } from "@/lib/auth-client";
import { toast } from "@/lib/toast";

export default function SignInForm({ callbackUrl }: AuthFormPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { locale } = usePreferences();
  const { refreshUser } = useAuth();
  const t = getDictionary(locale);
  const router = useRouter();

  async function signIn(event: AuthFormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const values = new FormData(event.currentTarget);

      const result = await authenticate("credentials", {
        email: String(values.get("email") ?? "").trim(),
        password: String(values.get("password") ?? ""),
        redirect: false,
      });

      if (!result?.ok || result.error) {
        const message = getSignInErrorMessage(result ?? {}, locale, t.authRequestFailed);
        setError(message);
        toast.error(message);
        return;
      }

      const signedInUser = await refreshUser();
      if (!signedInUser) {
        const message = getSignInErrorMessage(
          { error: "auth-session-incomplete" },
          locale,
          t.authRequestFailed,
        );
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(t.signInButton);
      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError(t.networkError);
      toast.error(t.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form-content">
      {/* Brand */}
      <div className="auth-brand">
        <HiOutlineShoppingCart />
        <span>
          <b>Fresh</b>Cart
        </span>
      </div>

      {/* Heading */}
      <h2>{t.signinTitle}</h2>
      <p className="auth-form-subtitle">{t.signinSubtitle}</p>

      {/* Social Login */}
      <div className="signin-social flex flex-col gap-4">
        <button
          type="button"
          disabled
          title={t.socialLoginUnavailable}
          className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-base font-medium text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-100"
        >
          <FaGoogle className="text-[23px] text-[#EA4335]" />
          <span>{t.continueGoogle}</span>
        </button>

        <button
          type="button"
          disabled
          title={t.socialLoginUnavailable}
          className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-base font-medium text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-100"
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1877F2]">
            <FaFacebookF className="text-[10px] text-white" />
          </span>

          <span>{t.continueFacebook}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="signup-divider">
        <span>{t.orContinueEmail}</span>
      </div>

      {/* Sign In Form */}
      <form className="auth-form signin-auth-form" onSubmit={signIn}>
        <AuthField
          id="signin-email"
          name="email"
          label={t.emailAddress}
          type="email"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          icon={<FiMail />}
        />

        {/* Password Heading */}
        <div className="auth-password-heading">
          <span>{t.password}</span>
          <Link href="/forgot-password">{t.forgotPassword}</Link>
        </div>

        {/* Password Input */}
        <PasswordField
          id="signin-password"
          name="password"
          label={t.password}
          placeholder={t.passwordPlaceholder}
          autoComplete="current-password"
          minLength={0}
        />

        {/* Error Message */}
        {error && (
          <p className="auth-message error" role="alert">
            {error}
          </p>
        )}

        {/* Submit */}
        <Button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? t.signingIn : t.signInButton}
        </Button>
      </form>

      <div className="auth-form-divider" />

      {/* Footer */}
      <p className="auth-form-footer">
        {t.newToFreshCart} <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>{t.createAccount}</Link>
      </p>
    </div>
  );
}
