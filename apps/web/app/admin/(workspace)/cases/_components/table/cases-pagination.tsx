"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CasesPagination({
  hasNextPage,
  nextCursor,
  onNextPage,
  onPreviousPage,
  pageIndex,
  pageRowsLength
}: {
  hasNextPage: boolean;
  nextCursor: string | null;
  onNextPage: () => void;
  onPreviousPage: () => void;
  pageIndex: number;
  pageRowsLength: number;
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-t border-border/40 px-1">
      <p className="text-xs text-muted-foreground">
        {pageRowsLength === 0 ? "0 resultados" : `${pageRowsLength} resultados en esta pagina`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-8 border-border/50 px-2.5"
          disabled={pageIndex === 0}
          onClick={onPreviousPage}
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="min-w-16 text-center text-xs text-muted-foreground">
          Pagina {pageIndex + 1}
        </span>
        <Button
          type="button"
          variant="outline"
          className="h-8 border-border/50 px-2.5"
          disabled={!hasNextPage || !nextCursor}
          onClick={onNextPage}
          aria-label="Pagina siguiente"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
