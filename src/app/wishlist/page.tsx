import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WishlistPage from "@/app/_component/wishlist/WishlistPage";

export default async function WishlistRoute() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=%2Fwishlist");
  return <WishlistPage />;
}
