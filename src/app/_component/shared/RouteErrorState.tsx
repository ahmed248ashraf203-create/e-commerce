"use client";

import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import type { RouteErrorProps } from "@/app/_types";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function RouteErrorState({ retry }: RouteErrorProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  return <main className="route-error-page"><div className="route-error-card"><span className="route-error-icon"><FiAlertTriangle /></span><h1>{t.pageErrorTitle}</h1><p>{t.pageErrorMessage}</p><div className="route-error-actions"><Button onClick={retry}><FiRefreshCw />{t.tryAgain}</Button><Button variant="outline" render={<Link href="/" />}>{t.goHome}</Button></div></div></main>;
}
