import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutPage from "@/app/_component/checkout/CheckoutPage";

export default async function CheckoutRoute() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=%2Fcheckout");
  return <CheckoutPage />;
}
