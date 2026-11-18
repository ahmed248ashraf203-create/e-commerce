import { FiStar } from "react-icons/fi";
import type { ProductRatingProps } from "@/app/_types";

export default function ProductRating({ rating, average, quantity }: ProductRatingProps) {
  return <div className="rating-row" aria-label={`${average.toFixed(1)} out of 5, ${quantity} reviews`}>
    <span className="stars">{[1, 2, 3, 4, 5].map((star) => <FiStar key={star} fill={star <= rating ? "currentColor" : "none"} />)}</span>
    <small>{average.toFixed(1)} ({quantity})</small>
  </div>;
}
