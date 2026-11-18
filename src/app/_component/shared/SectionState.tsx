"use client";

import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";
import type { SectionStateProps } from "@/app/_types";

export function SectionState({ state }: SectionStateProps) {
  const { locale } = usePreferences();
  const copy = getDictionary(locale);
  return <div className={`section-state ${state}`} role={state === "error" ? "alert" : "status"}>
    {state === "loading" ? <span className="loading-dot" aria-hidden="true" /> : null}
    {state === "loading" ? copy.loading : state === "error" ? copy.error : state === "noMatches" ? copy.noMatches : copy.empty}
  </div>;
}
