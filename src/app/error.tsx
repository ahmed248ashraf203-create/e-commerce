"use client";

import { useEffect } from "react";
import type { RouteErrorProps } from "@/app/_types";
import RouteErrorState from "./_component/shared/RouteErrorState";
import { getDictionary } from "@/lib/dictionary";
import { toast } from "@/lib/toast";
import { usePreferences } from "./_component/preferences/Preferences";

export default function ErrorPage(props: RouteErrorProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  useEffect(() => {
    toast.error(t.pageErrorTitle, t.pageErrorMessage);
  }, [t.pageErrorMessage, t.pageErrorTitle]);

  return <RouteErrorState {...props} />;
}
