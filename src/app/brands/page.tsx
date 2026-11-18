import { connection } from "next/server";
import { getBrands } from "@/lib/api";
import BrandsPage from "@/app/_component/brands/BrandsPage";

export default async function BrandsRoute() {
  await connection();
  const result = await getBrands();
  return <BrandsPage brands={result.ok ? result.data : []} failed={!result.ok} />;
}
