"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { usePreferences } from "../preferences/Preferences";
import { useAuth } from "./AuthProvider";
import PasswordField from "./PasswordField";
import AccountNavigation from "../account/AccountNavigation";
import { getDictionary } from "@/lib/dictionary";
import { getCommerceDictionary } from "@/lib/commerce-dictionary";
import { submitAuthRequest } from "@/lib/auth-client";
import { toast } from "@/lib/toast";
import type { AuthFormEvent } from "@/app/_types";

export default function AccountProfile() {
  const { user, loading, refreshUser } = useAuth();
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const copy = getCommerceDictionary(locale);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function updateProfile(event: AuthFormEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");
    const result = await submitAuthRequest("update-profile", { name: String(values.get("name") ?? "").trim(), email: String(values.get("email") ?? "").trim(), phone: String(values.get("phone") ?? "").trim() });
    setSavingProfile(false);
    if (!result.ok) {
      setProfileError(result.data.message ?? t.updateProfileError);
      toast.error(t.updateProfileError, result.data.message);
      return;
    }
    await refreshUser();
    setProfileMessage(t.profileUpdated);
    toast.success(t.profileUpdated);
  }

  async function changePassword(event: AuthFormEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    setSavingPassword(true);
    setPasswordError("");
    setPasswordMessage("");
    const values = new FormData(form);
    const password = String(values.get("password") ?? "");
    const rePassword = String(values.get("rePassword") ?? "");
    if (password !== rePassword) {
      setSavingPassword(false);
      setPasswordError(t.passwordMismatch);
      return;
    }
    const result = await submitAuthRequest("change-password", {
      currentPassword: String(values.get("currentPassword") ?? ""),
      password,
      rePassword,
    });
    setSavingPassword(false);
    if (!result.ok) {
      setPasswordError(result.data.message ?? t.authRequestFailed);
      toast.error(t.authRequestFailed, result.data.message);
      return;
    }
    form.reset();
    setPasswordMessage(t.passwordUpdated);
    toast.success(t.passwordUpdated);
  }

  if (loading) return <main className="account-page"><p>{t.loadingAccount}</p></main>;
  if (!user) return <main className="account-page"><p role="alert">{t.profileLoadError}</p></main>;

  return <main className="account-page profile-page"><header className="account-hero"><nav><Link href="/">{t.homeBreadcrumb}</Link><span>/</span><span>{copy.account}</span></nav><div><span><FiUser /></span><section><h1>{t.profileTitle}</h1><p>{locale === "ar" ? "إدارة عناوينك وإعدادات حسابك" : "Manage your addresses and account settings"}</p></section></div></header><div className="account-workspace"><AccountNavigation active="settings" /><section className="account-profile-content"><header className="account-content-heading"><div><h2>{t.profileTitle}</h2><p>{t.profileSubtitle}</p></div></header><div className="account-forms-grid">
    <section className="account-form-card"><h2>{t.profileTitle}</h2><form className="auth-form" onSubmit={updateProfile}>
      <label className="auth-field" htmlFor="profile-name"><span className="auth-field-label">{t.name}</span><span className="auth-input-wrap"><FiUser /><input id="profile-name" name="name" defaultValue={user.name ?? ""} required autoComplete="name" /></span></label>
      <label className="auth-field" htmlFor="profile-email"><span className="auth-field-label">{t.emailAddress}</span><span className="auth-input-wrap"><FiMail /><input id="profile-email" name="email" type="email" defaultValue={user.email ?? ""} required autoComplete="email" /></span></label>
      <label className="auth-field" htmlFor="profile-phone"><span className="auth-field-label">{t.phoneNumber}</span><span className="auth-input-wrap"><FiPhone /><input id="profile-phone" name="phone" type="tel" defaultValue={user.phone ?? ""} required autoComplete="tel" /></span></label>
      {profileError && <p className="auth-message error" role="alert">{profileError}</p>}{profileMessage && <p className="auth-message success" role="status">{profileMessage}</p>}
      <Button className="auth-submit" type="submit" disabled={savingProfile}>{savingProfile ? t.savingChanges : t.saveChanges}</Button>
    </form></section>
    <section className="account-form-card"><h2>{t.changePasswordTitle}</h2><form className="auth-form" onSubmit={changePassword}>
      <PasswordField id="current-password" name="currentPassword" label={t.currentPassword} placeholder={t.passwordPlaceholder} autoComplete="current-password" />
      <PasswordField id="account-new-password" name="password" label={t.newPassword} placeholder={t.passwordPlaceholder} autoComplete="new-password" minLength={8} />
      <PasswordField id="account-confirm-password" name="rePassword" label={t.confirmPassword} placeholder={t.confirmPasswordPlaceholder} autoComplete="new-password" minLength={8} />
      {passwordError && <p className="auth-message error" role="alert">{passwordError}</p>}{passwordMessage && <p className="auth-message success" role="status">{passwordMessage}</p>}
      <Button className="auth-submit" type="submit" disabled={savingPassword}>{savingPassword ? t.savingChanges : t.changePasswordTitle}</Button>
    </form></section>
  </div></section></div></main>;
}
