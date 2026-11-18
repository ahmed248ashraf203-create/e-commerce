import Image from "next/image";
import Link from "next/link";
import type { ProductImageProps } from "@/app/_types";

export default function ProductImage({ product, discount, discounted, children }: ProductImageProps) {
  return <div className="product-image-wrap">
    {discounted && <span className="discount-badge">-{discount}%</span>}
    <Link href={`/viewproduct/${product._id}`} className="product-image-link" aria-label={product.title}>
      <Image src={product.imageCover} alt={product.title} fill sizes="(max-width:640px) 45vw, (max-width:1000px) 30vw, 220px" className="product-image" />
    </Link>
    {children}
  </div>;
}
