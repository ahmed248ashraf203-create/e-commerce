"use client";

import type { CategoryViewProps } from "@/app/_types";
import { usePreferences } from "../preferences/Preferences";
import { getDictionary } from "@/lib/dictionary";
import { SectionHeading } from "../shared/SectionHeading";
import { SectionState } from "../shared/SectionState";
import CategoryCard from "./CategoryCard";

export default function CategoryView({ categories, failed }: CategoryViewProps) {
  const { locale } = usePreferences();
  const t = getDictionary(locale);
  return <section className="content-section category-section" id="categories"><SectionHeading title={t.shopCategory} action={<a className="text-action" href="#categories">{t.allCategories}<span aria-hidden="true">→</span></a>} />
    {failed ? <SectionState state="error" /> : categories.length === 0 ? <SectionState state="empty" /> : <div className="category-grid">{categories.map((category) => <CategoryCard key={category._id} category={category} name={t.categoryNames[category.name.toLowerCase()] ?? category.name} />)}</div>}
  </section>;
}
