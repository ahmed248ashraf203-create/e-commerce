import { FiCheck, FiTag, FiTruck } from "react-icons/fi";
import type { NewsletterContentProps } from "@/app/_types";

export default function NewsletterPerks({ copy }: NewsletterContentProps) {
  return <div className="newsletter-perks"><span><FiCheck />{copy.freshPicks}</span><span><FiTruck />{copy.deliveryCodes}</span><span><FiTag />{copy.memberDeals}</span></div>;
}
