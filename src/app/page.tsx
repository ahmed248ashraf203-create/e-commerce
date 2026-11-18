import { Suspense } from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import MainSlider from "./_component/main-slider/MainSlider";
import Features from "./_component/features/Features";
import Category from "./_component/category/Category";
import Deals from "./_component/deals/Deals";
import ProductsSection from "./_component/product/ProductsSection";
import Newsletter from "./_component/newsletter/Newsletter";
import SectionSkeleton from "./_component/shared/SectionSkeleton";
export default function Home() {
  const hasHeroImage = existsSync(
    join(process.cwd(), "public", "images", "hero-supermarket.jpg"),
  );
  return (
    <main className="storefront">
      <MainSlider hasHeroImage={hasHeroImage} />
      <Features />
      <Suspense fallback={<SectionSkeleton kind="categories" />}>
        <Category />
      </Suspense>
      <Deals />
      <Suspense fallback={<SectionSkeleton kind="products" />}>
        <ProductsSection />
      </Suspense>
      <Newsletter />
    </main>
  );
}
