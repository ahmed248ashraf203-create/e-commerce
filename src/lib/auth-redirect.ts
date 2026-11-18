export function getSafeCallbackUrl(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return "/";
  }

  const parsed = new URL(candidate, "http://localhost");
  if (parsed.pathname === "/signin" || parsed.pathname === "/signup") return "/";
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
