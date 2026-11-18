import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountProfile from "@/app/_component/auth/AccountProfile";

async function ProfileContent() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  return <AccountProfile />;
}

export default function AccountProfilePage() {
  return <Suspense fallback={<main className="account-page"><p>Loading your account...</p></main>}><ProfileContent /></Suspense>;
}
