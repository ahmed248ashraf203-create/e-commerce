import Image from "next/image";
import Link from "next/link";
import { FiTag } from "react-icons/fi";
import type { BrandCardProps } from "@/app/_types";

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link className="brand-card" href={`/brands/${brand._id}`}>
      <span className="brand-card-image">
        {brand.image ? <Image src={brand.image} alt={brand.name} width={220} height={160} /> : <FiTag aria-hidden="true" />}
      </span>
      <strong>{brand.name}</strong>
    </Link>
  );
}
