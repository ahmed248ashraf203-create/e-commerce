"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductGalleryProps } from "@/app/_types";

export default function ProductGallery({ title, images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);
  return <div className="detail-gallery"><div className="detail-main-image"><Image src={activeImage} alt={title} fill priority sizes="(max-width:800px) 100vw, 35vw" /></div><div className="detail-thumbnails">{images.map((image, index) => <button type="button" key={`${image}-${index}`} className={activeImage === image ? "active" : ""} aria-label={`View image ${index + 1}`} aria-pressed={activeImage === image} onClick={() => setActiveImage(image)}><Image src={image} alt={`${title} ${index + 1}`} fill sizes="80px" /></button>)}</div></div>;
}
