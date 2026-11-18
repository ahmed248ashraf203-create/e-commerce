"use client";

import type { RouteErrorProps } from "@/app/_types";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({ retry }: RouteErrorProps) {
  return <html lang="en"><body><main className="route-error-page"><div className="route-error-card"><span className="route-error-icon">!</span><h1>FreshCart had a problem</h1><p>We could not load the store. Please try again.</p><Button onClick={retry}>Try again</Button></div></main></body></html>;
}
