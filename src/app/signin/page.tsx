import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthShell from "@/app/_component/auth/AuthShell";
import SignInForm from "@/app/_component/auth/SignInForm";
import PageSkeleton from "@/app/_component/shared/PageSkeleton";
import { getSafeCallbackUrl } from "@/lib/auth-redirect";

async function SignInContent({ searchParams }: PageProps<"/signin">) {
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);
  const session = await auth();
  if (session?.user) redirect(safeCallbackUrl);
  return <AuthShell variant="signin"><SignInForm callbackUrl={safeCallbackUrl} /></AuthShell>;
}

export default function SignInPage(props: PageProps<"/signin">) {
  return <Suspense fallback={<PageSkeleton variant="auth" />}><SignInContent {...props} /></Suspense>;
}
