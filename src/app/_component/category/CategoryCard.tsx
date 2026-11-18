import Image from "next/image";
import Link from "next/link";
import type { CategoryCardProps } from "@/app/_types";

export default function CategoryCard({ category, name }: CategoryCardProps) {
  return <Link className="category-card" href={`/shop?category=${encodeURIComponent(category.name)}`}><span className="category-image"><Image src={category.image} alt={name} fill sizes="(max-width:640px) 35vw, (max-width:1000px) 20vw, 140px" /></span><span>{name}</span></Link>;
}
