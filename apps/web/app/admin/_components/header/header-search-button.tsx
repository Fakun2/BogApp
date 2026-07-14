"use client";

import { Search } from "lucide-react";

type HeaderSearchButtonProps = {
  onOpenCommand: () => void;
};

export function HeaderSearchButton({ onOpenCommand }: HeaderSearchButtonProps) {
  return (
    <button
      data-admin-surface
      type="button"
      className="hidden h-10 w-[250px] items-center gap-2.5 rounded-md border-0 bg-card px-3.5 text-left text-[13px] font-normal text-muted-foreground shadow-[var(--admin-header-control-shadow)] transition-[width,background-color] duration-200 hover:bg-secondary/50 focus-visible:w-[340px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
      onClick={onOpenCommand}
      aria-label="Abrir busqueda global"
    >
      <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span className="truncate">Search anything</span>
      <span className="ml-auto rounded bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
        Ctrl K
      </span>
    </button>
  );
}
