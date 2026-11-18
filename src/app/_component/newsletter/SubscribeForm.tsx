import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewsletterSubmitProps } from "@/app/_types";

export default function SubscribeForm({ copy, subscribed, onSubmit }: NewsletterSubmitProps) {
  return <><form className="subscribe-form" onSubmit={onSubmit}><Input type="email" required placeholder={copy.email} aria-label={copy.email} /><Button type="submit">{subscribed ? copy.subscribed : copy.subscribe}<FiArrowRight /></Button></form><small className="unsubscribe-note">{subscribed ? `✓ ${copy.subscribed}` : `✨ ${copy.unsubscribe}`}</small></>;
}
