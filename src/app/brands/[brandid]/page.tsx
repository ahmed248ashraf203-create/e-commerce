import { connection } from "next/server";
import { getBrandById, getProductsByBrand } from "@/lib/api";
import BrandProductsPage from "@/app/_component/brands/BrandProductsPage";
import type { Brand } from "@/app/_types";

export default async function BrandRoute({ params }: PageProps<"/brands/[brandid]">) {
  await connection();
  const { brandid } = await params;
  const [brandResult, productsResult] = await Promise.all([getBrandById(brandid), getProductsByBrand(brandid)]);
  const brand: Brand = brandResult.ok ? brandResult.data : { _id: brandid, name: "Brand", slug: brandid, image: "" };
  return <BrandProductsPage brand={brand} products={productsResult.ok ? productsResult.data : []} failed={!brandResult.ok || !productsResult.ok} />;
}
