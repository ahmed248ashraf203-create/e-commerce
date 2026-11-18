"use client";

import { useState } from "react";
import Link from "next/link";
import { FiKey, FiLock, FiMail } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import type { AuthFormEvent, AuthRecoveryStep } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import AuthField from "./AuthField";
import PasswordField from "./PasswordField";
import { getDictionary } from "@/lib/dictionary";
import { submitAuthRequest } from "@/lib/auth-client";
import { toast } from "@/lib/toast";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<AuthRecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  async function runRequest(event: AuthFormEvent, action: "forgot-password" | "verify-reset-code" | "reset-password") {
    event.preventDefault();
    setError("");
    setNotice("");
    const values = new FormData(event.currentTarget);
    const formEmail = String(values.get("email") ?? email).trim();
    const body: import("@/app/_types").AuthRequestBody = action === "forgot-password"
      ? { email: formEmail }
      : action === "verify-reset-code"
        ? { resetCode: String(values.get("resetCode") ?? "").trim() }
        : { email, newPassword: String(values.get("newPassword") ?? "") };
    if (action === "reset-password" && body.newPassword !== String(values.get("rePassword") ?? "")) {
      setError(t.passwordMismatch);
      return;
    }
    setSubmitting(true);
    const result = await submitAuthRequest(action, body);
    setSubmitting(false);
    if (!result.ok) {
      const errorMessage = result.data.message === "networkError" ? t.networkError : result.data.message ?? t.authRequestFailed;
      setError(errorMessage);
      toast.error(t.authRequestFailed, errorMessage);
      return;
    }
    if (action === "forgot-password") {
      setEmail(formEmail);
      setStep("code");
      setNotice(t.resetCodeSent);
      toast.success(t.resetCodeSent);
    } else if (action === "verify-reset-code") {
      setStep("password");
    } else {
      setStep("done");
      setNotice(t.resetSuccess);
      toast.success(t.resetSuccess);
    }
  }

  const stepIndex = step === "email" ? 0 : step === "code" ? 1 : 2;
  const busyLabel = step === "email" ? t.sendingResetCode : step === "code" ? t.verifyingResetCode : t.resettingPassword;
  const buttonLabel = step === "email" ? t.sendResetCode : step === "code" ? t.verifyResetCode : t.resetPassword;

  return <div className="auth-form-content"><div className="auth-brand"><HiOutlineShoppingCart /><span><b>Fresh</b>Cart</span></div><h2>{step === "done" ? t.resetSuccess : t.forgotTitle}</h2><p className="auth-form-subtitle">{t.forgotSubtitle}</p><div className="recovery-steps" aria-label={`${stepIndex + 1} of 3 steps`}>{[FiMail, FiKey, FiLock].map((Icon, index) => <span className={index <= stepIndex ? "active" : ""} key={index}><Icon /></span>)}</div>
    {step === "done" ? <div className="auth-success" role="status"><p>{notice}</p><Link href="/signin">{t.backToSignIn}</Link></div> : <form className="auth-form" onSubmit={(event) => runRequest(event, step === "email" ? "forgot-password" : step === "code" ? "verify-reset-code" : "reset-password")}>
      {step === "email" && <AuthField id="recovery-email" name="email" label={t.emailAddress} type="email" placeholder={t.emailPlaceholder} autoComplete="email" icon={<FiMail />} />}
      {step === "code" && <><input type="hidden" name="email" value={email} /><AuthField id="recovery-code" name="resetCode" label={t.resetCode} placeholder={t.resetCodePlaceholder} autoComplete="one-time-code" icon={<FiKey />} /></>}
      {step === "password" && <><input type="hidden" name="email" value={email} /><PasswordField id="recovery-password" name="newPassword" label={t.newPassword} placeholder={t.passwordPlaceholder} autoComplete="new-password" minLength={8} /><PasswordField id="recovery-repassword" name="rePassword" label={t.confirmPassword} placeholder={t.confirmPasswordPlaceholder} autoComplete="new-password" minLength={8} /></>}
      {notice && <p className="auth-message success" role="status">{notice}</p>}{error && <p className="auth-message error" role="alert">{error}</p>}
      <Button className="auth-submit" type="submit" disabled={submitting}>{submitting ? busyLabel : buttonLabel}</Button>
    </form>}
    <Link className="auth-back-link" href="/signin">← {t.backToSignIn}</Link><div className="auth-form-divider" /><p className="auth-form-footer">{t.rememberPassword} <Link href="/signin">{t.signInButton}</Link></p></div>;
}
