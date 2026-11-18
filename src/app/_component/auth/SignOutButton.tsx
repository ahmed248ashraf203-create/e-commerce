"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { toast } from "@/lib/toast";

export default function SignOutButton() {
  const { signOut } = useAuth();
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleSignOut() {
    if (pending) return;
    setPending(true);
    try {
      await signOut();
      toast.success(t.signOut);
      router.replace("/");
      router.refresh();
    } catch {
      toast.error(t.networkError);
      setPending(false);
    }
  }
  return <Button className="nav-signin nav-signout" type="button" disabled={pending} onClick={handleSignOut}>{pending ? t.loading : t.signOut}</Button>;
}
