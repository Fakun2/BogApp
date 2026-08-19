"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaseExpensesQuery } from "../../../_hooks/use-case-expenses-query";
import {
  PaidExpensesPopupEmpty,
  PaidExpensesPopupError,
  PaidExpensesPopupRestricted,
  PaidExpensesPopupSkeleton
} from "./paid-expenses-popup-states";
import { PaidExpensesPopupTable } from "./paid-expenses-popup-table";

export function CaseExpensesAllPopup({
  caseId,
  onClose
}: {
  caseId: string;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const expensesQuery = useCaseExpensesQuery({ caseId, status: "paid" });
  const expenses = expensesQuery.data?.items ?? [];
  const hasNextPage = Boolean(expensesQuery.data?.pageInfo.hasNextPage);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  }

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-200 ease-out ${
        isClosing || !isVisible ? "opacity-0 backdrop-blur-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Gastos pagados del expediente"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <article
        data-admin-surface
        className={`flex max-h-[82svh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--admin-card-shadow)] transition-[opacity,transform] duration-200 ease-out ${
          isClosing || !isVisible
            ? "translate-y-2 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/30 px-5 py-4">
          <h2 className="min-w-0">
            <span className="block truncate text-base font-semibold text-foreground">
              Gastos pagados del expediente
            </span>
            <span className="mt-1 block text-sm font-normal text-muted-foreground">
              Listado paginado de gastos abonados.
            </span>
          </h2>
          <Button
            type="button"
            variant="outline"
            className="h-7 w-7 border-border/50 p-0"
            onClick={requestClose}
            aria-label="Cerrar gastos"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {expensesQuery.isLoading ? (
            <PaidExpensesPopupSkeleton />
          ) : expensesQuery.error ? (
            <PaidExpensesPopupError message={expensesQuery.error.message} />
          ) : !expensesQuery.hasPermission ? (
            <PaidExpensesPopupRestricted />
          ) : expenses.length ? (
            <section className="grid gap-3" aria-label="Listado paginado de gastos pagados">
              <PaidExpensesPopupTable expenses={expenses} />
              <PaidExpensesPagination
                canGoBack={expensesQuery.canGoBack}
                canGoForward={hasNextPage}
                goBack={expensesQuery.goBack}
                goForward={expensesQuery.goForward}
                itemCount={expenses.length}
                pageIndex={expensesQuery.pageIndex}
              />
            </section>
          ) : (
            <PaidExpensesPopupEmpty />
          )}
        </main>
      </article>
    </section>
  );
}

function PaidExpensesPagination({
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  itemCount,
  pageIndex
}: {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  itemCount: number;
  pageIndex: number;
}) {
  return (
    <footer className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        Pagina {pageIndex + 1} - {itemCount} gastos
      </span>
      <nav className="flex gap-2" aria-label="Paginacion de gastos pagados">
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
