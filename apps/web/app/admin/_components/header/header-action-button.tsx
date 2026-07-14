"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderActionButtonProps = {
  children: ReactNode;
  className?: string;
  label: string;
  onClick?: () => void;
};

export function HeaderActionButton({ children, className, label, onClick }: HeaderActionButtonProps) {
  return (
    <Button
      data-admin-surface
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "size-10 rounded-md border-0 bg-card px-0 text-muted-foreground shadow-[var(--admin-header-control-shadow)] hover:bg-secondary/80 hover:text-foreground",
        className
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
