import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CartPage from "@/app/_component/cart/CartPage";

export default async function CartRoute() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=%2Fcart");
  return <CartPage />;
}
