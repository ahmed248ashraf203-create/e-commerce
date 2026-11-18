import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AddressesPage from "@/app/_component/account/AddressesPage";

export default async function AccountAddressesRoute() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=%2Faccount%2Faddresses");
  return <AddressesPage />;
}
