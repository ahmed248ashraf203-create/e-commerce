import { Button } from "@/components/ui/button";
import type { IconButtonProps } from "@/app/_types";

export function IconButton({ label, children, onClick, active = false }: IconButtonProps) {
  return <Button type="button" variant="outline" size="icon" aria-label={label} aria-pressed={active} onClick={onClick} className={`icon-button ${active ? "active" : ""}`}>{children}</Button>;
}
