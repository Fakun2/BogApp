import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TasksTablePagination({
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  pageIndex,
  taskCount
}: {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  pageIndex: number;
  taskCount: number;
}) {
  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border/30 py-3 text-sm text-muted-foreground">
      <span>
        Pagina {pageIndex + 1} - {taskCount} tareas
      </span>
      <nav className="flex gap-2" aria-label="Paginacion de tareas del expediente">
        <Button
          type="button"
          variant="outline"
          className="h-7 w-7 border-border/50 p-0"
          disabled={!canGoBack}
          onClick={goBack}
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-7 w-7 border-border/50 p-0"
          disabled={!canGoForward}
          onClick={goForward}
          aria-label="Pagina siguiente"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    </footer>
  );
}
