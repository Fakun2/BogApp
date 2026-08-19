"use client";

import { Button } from "@/components/ui/button";

export function LibraryPagination({
  canGoBack,
  canGoForward,
  total,
  onNext,
  onPrevious
}: {
  canGoBack: boolean;
  canGoForward: boolean;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border/70 p-3 text-sm">
      <span className="text-muted-foreground">Pagina actual: {total} items</span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={!canGoBack} onClick={onPrevious}>
          Anterior
        </Button>
        <Button size="sm" variant="outline" disabled={!canGoForward} onClick={onNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
