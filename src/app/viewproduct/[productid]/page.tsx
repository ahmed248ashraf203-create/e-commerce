import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/api";
import ProductDetail from "@/app/_component/product/view/ProductDetail";
import RelatedProductsSection from "@/app/_component/product/view/RelatedProductsSection";
import RelatedProductsSkeleton from "@/app/_component/product/view/RelatedProductsSkeleton";
import ProductDetailSkeleton from "@/app/_component/product/view/ProductDetailSkeleton";
import type { ViewProductPageProps } from "@/app/_types";

async function ProductPageContent({ params }: ViewProductPageProps) {
  await connection();
  const { productid } = await params;
  const productResult = await getProductById(productid);
  if (!productResult.ok) notFound();
  const product = productResult.data;
  return <><ProductDetail product={product} /><Suspense fallback={<RelatedProductsSkeleton />}><RelatedProductsSection categoryId={product.category._id} productId={product._id} /></Suspense></>;
}

export default function Page({ params }: ViewProductPageProps) {
  return <Suspense fallback={<ProductDetailSkeleton />}><ProductPageContent params={params} /></Suspense>;
}
