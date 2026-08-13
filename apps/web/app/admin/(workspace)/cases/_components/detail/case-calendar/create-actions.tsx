"use client";

import { Banknote, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminPrimaryActionButtonClassName } from "../../../../_constants/dashboard";
import { CaseExpenseSheet } from "../expense-sheet";
import { CaseHearingSheet } from "../hearing-sheet";
import type { CalendarCreateActionsProps } from "./types";

export function CalendarCreateActions({
  canCreateExpense,
  canCreateHearing,
  caseId
}: CalendarCreateActionsProps) {
  return (
    <section className="flex items-center gap-1" aria-label="Crear eventos del calendario">
      {canCreateHearing ? (
        <CaseHearingSheet
          caseId={caseId}
          trigger={
            <Button
              type="button"
              variant="outline"
              className="h-9 w-9 rounded-xl border-border/50 p-0 text-sm sm:w-auto sm:px-4"
              aria-label="Nueva audiencia"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nueva audiencia</span>
            </Button>
          }
        />
      ) : null}
      {canCreateExpense ? (
        <CaseExpenseSheet
          caseId={caseId}
          tasks={[]}
          trigger={
            <Button
              type="button"
              className={`h-9 w-9 rounded-xl p-0 text-sm sm:w-auto sm:px-4 ${adminPrimaryActionButtonClassName}`}
              aria-label="Nuevo gasto"
            >
              <Banknote className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nuevo gasto</span>
            </Button>
          }
        />
      ) : null}
    </section>
  );
}
