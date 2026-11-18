"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { signIn as authenticate } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AuthFormEvent, AuthFormPageProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import AuthField from "./AuthField";
import PasswordField from "./PasswordField";
import { getDictionary } from "@/lib/dictionary";
import { getSignInErrorMessage, submitAuthRequest } from "@/lib/auth-client";
import { useAuth } from "./AuthProvider";
import { toast } from "@/lib/toast";

// Same format the Route API accepts: 010 / 011 / 012 / 015 + 8 digits.
const EGYPT_PHONE = /^01[0125][0-9]{8}$/;

export default function SignUpForm({ callbackUrl }: AuthFormPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function signUp(event: AuthFormEvent) {
    event.preventDefault();
    setError("");

    const values = new FormData(event.currentTarget);

    const password = String(values.get("password") ?? "");
    const rePassword = String(values.get("rePassword") ?? "");

    if (password !== rePassword) {
      setError(t.passwordMismatch);
      return;
    }

    const phone = String(values.get("phone") ?? "").trim();
    if (!EGYPT_PHONE.test(phone)) {
      setError(t.phoneInvalid);
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitAuthRequest("signup", {
        name: String(values.get("name") ?? "").trim(),
        email: String(values.get("email") ?? "").trim(),
        password,
        rePassword,
        phone,
      });

      if (!result.ok) {
        const serverMessage = result.data.message ?? "";
        const errorMessage =
          serverMessage === "networkError"
            ? t.networkError
            : result.status === 409 || /already exist/i.test(serverMessage)
              ? t.accountExists
              : result.status === 429
                ? t.tooManyRequests
                : t.authRequestFailed;
        setError(errorMessage);
        toast.error(t.authRequestFailed, errorMessage);
        return;
      }

      const signInResult = await authenticate("credentials", {
        email: String(values.get("email") ?? "").trim(),
        password,
        redirect: false,
      });
      if (signInResult?.ok && !signInResult.error) {
        const signedInUser = await refreshUser();
        if (!signedInUser) {
          setCreated(true);
          toast.error(
            getSignInErrorMessage({ error: "auth-session-incomplete" }, locale, t.authRequestFailed),
          );
          return;
        }
        toast.success(t.accountCreated);
        router.replace(callbackUrl);
        router.refresh();
        return;
      }

      // Account exists but auto sign-in failed: show one clear "account created, please sign in" state.
      setCreated(true);
      toast.error(getSignInErrorMessage(signInResult ?? {}, locale, t.authRequestFailed));
    } catch {
      setError(t.networkError);
      toast.error(t.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  // Password Strength
  const passwordStrength =
    passwordValue.length === 0
      ? 0
      : Math.min(
          4,
          Number(passwordValue.length >= 8) +
            Number(/[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue)) +
            Number(/\d/.test(passwordValue)) +
            Number(/[^A-Za-z0-9]/.test(passwordValue)),
        );

  const strengthLabel =
    passwordStrength < 2
      ? t.passwordWeak
      : passwordStrength < 4
        ? t.passwordMedium
        : t.passwordStrong;

  return (
    <div className="auth-form-content signup-form-content">
      {/* Heading */}
      <h2>{t.signupTitle}</h2>
      <p className="auth-form-subtitle">{t.signupSubtitle}</p>

      {created ? (
        /* Success Message */
        <div className="auth-success" role="status">
          <strong>{t.accountCreated}</strong>
          <p>{locale === "ar" ? "استخدم نفس البريد الإلكتروني وكلمة المرور اللذين سجلت بهما." : "Sign in with the same email address and password you just registered."}</p>
          <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>{t.signInButton}</Link>
        </div>
      ) : (
        <>
          {/* Social Login */}
          <div className="signup-social flex  gap-4">
            {/* Google */}
            <button
              type="button"
              disabled
              title={t.socialLoginUnavailable}
              className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-base font-medium text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-100"
            >
              <FaGoogle className="text-[23px] text-[#EA4335]" />
              <span>{t.google}</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              disabled
              title={t.socialLoginUnavailable}
              className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-base font-medium text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-100"
            >
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1877F2]">
                <FaFacebookF className="text-[10px] text-white" />
              </span>

              <span>{t.facebook}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="signup-divider">
            <span>{t.or}</span>
          </div>

          {/* Signup Form */}
          <form className="auth-form signup-auth-form" onSubmit={signUp}>
            {/* Name */}
            <AuthField
              id="signup-name"
              name="name"
              label={t.name}
              placeholder={t.namePlaceholder}
              autoComplete="name"
              icon={<FiUser />}
            />

            {/* Email */}
            <AuthField
              id="signup-email"
              name="email"
              label={t.emailAddress}
              type="email"
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              icon={<FiMail />}
            />

            {/* Password */}
            <div className="signup-password-field">
              <PasswordField
                id="signup-password"
                name="password"
                label={t.password}
                placeholder={t.passwordPlaceholder}
                autoComplete="new-password"
                minLength={8}
                onChange={(event) =>
                  setPasswordValue(event.currentTarget.value)
                }
              />

              {/* Password Strength */}
              <div
                className="password-strength"
                data-strength={passwordStrength}
                aria-live="polite"
              >
                <span />
                <span />
                <span />
                <span />
                <strong>{strengthLabel}</strong>
              </div>

              <small className="password-strength-help">
                {t.passwordStrengthHelp}
              </small>
            </div>

            {/* Confirm Password */}
            <PasswordField
              id="signup-repassword"
              name="rePassword"
              label={t.confirmPassword}
              placeholder={t.confirmPasswordPlaceholder}
              autoComplete="new-password"
              minLength={8}
            />

            {/* Phone */}
            <AuthField
              id="signup-phone"
              name="phone"
              label={t.phoneNumber}
              type="tel"
              placeholder={t.phonePlaceholder}
              autoComplete="tel"
              icon={<FiPhone />}
            />

            {/* Terms & Privacy */}
            <label className="auth-checkbox terms-checkbox">
              <input type="checkbox" required />

              <span>
                {t.termsAgreement}{" "}
                <Link href="/#footer">{t.termsOfService}</Link>{" "}
                {locale === "ar" ? "و" : "and"}{" "}
                <Link href="/#footer">{t.privacyPolicy}</Link>.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="auth-message error" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? t.creatingAccount : t.createMyAccount}
            </Button>
          </form>
        </>
      )}

      <div className="auth-form-divider" />

      {/* Footer */}
      <p className="auth-form-footer">
        {t.alreadyHaveAccount} <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>{t.signInButton}</Link>
      </p>
    </div>
  );
}
