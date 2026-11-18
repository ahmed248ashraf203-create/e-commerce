import { redirect } from "next/navigation";
import { auth } from "@/auth";
import OrdersPage from "@/app/_component/account/OrdersPage";

export default async function AccountOrdersRoute() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=%2Faccount%2Forders");
  return <OrdersPage />;
}
