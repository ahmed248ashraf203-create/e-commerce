import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import type { ProductPriceProps } from "@/app/_types";

export default function ProductPrice({ currentPrice, originalPrice, discounted, onAdd, addLabel }: ProductPriceProps) {
  return <div className="product-price-row"><span className="product-price">{currentPrice.toLocaleString()} EGP</span>{discounted && <del>{originalPrice.toLocaleString()} EGP</del>}<Button size="icon" aria-label={addLabel} onClick={onAdd}><FiPlus /></Button></div>;
}
