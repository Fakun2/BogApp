"use client";

type HeaderSearchButtonProps = {
  onOpenCommand: () => void;
};

export function HeaderSearchButton({ onOpenCommand }: HeaderSearchButtonProps) {
  return (
    <button
      data-admin-surface
      type="button"
      className="hidden h-8 w-[170px] items-center gap-2.5 rounded-full border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] px-4 text-left text-sm font-semibold text-muted-foreground backdrop-blur-xl transition-[width,background-color,border-color] duration-200 hover:border-border/70 hover:bg-[var(--dropdown-item-hover)] focus-visible:w-[340px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
      onClick={onOpenCommand}
      aria-label="Abrir busqueda global"
    >
      <span className="truncate">Buscar...</span>
      <span className="ml-auto inline-flex items-center gap-1">
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
