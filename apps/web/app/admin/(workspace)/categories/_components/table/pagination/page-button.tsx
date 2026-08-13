import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageButton({
  children,
  disabled,
  label,
  onClick
}: {
  children: ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 border-border/50 px-2.5"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
