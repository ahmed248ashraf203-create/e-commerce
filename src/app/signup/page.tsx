import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthShell from "@/app/_component/auth/AuthShell";
import SignUpForm from "@/app/_component/auth/SignUpForm";
import PageSkeleton from "@/app/_component/shared/PageSkeleton";
import { getSafeCallbackUrl } from "@/lib/auth-redirect";

async function SignUpContent({ searchParams }: PageProps<"/signup">) {
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);
  const session = await auth();
  if (session?.user) redirect(safeCallbackUrl);
  return <AuthShell variant="signup"><SignUpForm callbackUrl={safeCallbackUrl} /></AuthShell>;
}

export default function SignUpPage(props: PageProps<"/signup">) {
  return <Suspense fallback={<PageSkeleton variant="auth" />}><SignUpContent {...props} /></Suspense>;
}
