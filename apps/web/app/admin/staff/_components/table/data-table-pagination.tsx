import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageButton } from "./page-button";

export function DataTablePagination({
  hasNextPage,
  nextCursor,
  pageIndex,
  pageRowsLength,
  onNextPage,
  onPreviousPage
}: {
  hasNextPage: boolean;
  nextCursor: string | null;
  pageIndex: number;
  pageRowsLength: number;
  onNextPage: (cursor: string) => void;
  onPreviousPage: () => void;
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-t border-border/40 px-1">
      <p className="text-xs text-muted-foreground">
        {pageRowsLength === 0 ? "0 resultados" : `${pageRowsLength} resultados en esta pagina`}
      </p>
      <div className="flex items-center gap-2">
        <PageButton
          disabled={pageIndex === 0}
          label="Pagina anterior"
          onClick={onPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </PageButton>
        <span className="min-w-16 text-center text-xs text-muted-foreground">
          Pagina {pageIndex + 1}
        </span>
        <PageButton
          disabled={!hasNextPage || !nextCursor}
          label="Pagina siguiente"
          onClick={() => {
            if (nextCursor) {
              onNextPage(nextCursor);
            }
          }}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </PageButton>
      </div>
    </div>
  );
}
