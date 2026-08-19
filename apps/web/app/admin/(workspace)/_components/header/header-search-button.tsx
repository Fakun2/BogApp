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
      className="hidden h-8 w-8 items-center justify-center gap-2.5 rounded-full border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] px-0 text-left text-sm font-semibold text-muted-foreground backdrop-blur-xl transition-[width,background-color,border-color] duration-200 hover:border-border/70 hover:bg-[var(--dropdown-item-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex lg:w-[170px] lg:justify-start lg:px-4 lg:focus-visible:w-[300px]"
      onClick={onOpenCommand}
      aria-label="Abrir busqueda global"
    >
      <Search className="h-4 w-4 shrink-0 lg:hidden" strokeWidth={1.9} aria-hidden="true" />
      <span className="hidden truncate lg:inline">Buscar...</span>
      <span className="ml-auto hidden items-center gap-1 lg:inline-flex">
        <kbd className="rounded-lg bg-secondary/80 px-2 py-1 font-sans text-xs font-semibold leading-none text-muted-foreground">
          Ctrl
        </kbd>
        <kbd className="rounded-lg bg-secondary/80 px-2 py-1 font-sans text-xs font-semibold leading-none text-muted-foreground">
          K
        </kbd>
      </span>
    </button>
  );
}
