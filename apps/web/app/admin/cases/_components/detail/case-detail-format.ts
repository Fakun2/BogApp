import type { CaseExpenseStatus, CaseTaskStatus } from "../../_types/cases.types";

export function formatCaseDate(value: string | null | undefined) {
  if (!value) {
    return "Sin cargar";
  }

  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(value));
}

export function formatCaseMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    currency: "ARS",
    maximumFractionDigits: 2,
    style: "currency"
  }).format(value);
}

export function getTaskStatusClassName(status: CaseTaskStatus) {
  const statusClassMap: Record<CaseTaskStatus, string> = {
    cancelled: "border-border/50 bg-muted text-muted-foreground",
    completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    in_progress: "border-blue-500/20 bg-blue-500/10 text-blue-700",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-700"
  };

  return statusClassMap[status];
}

export function getExpenseStatusClassName(status: CaseExpenseStatus) {
  const statusClassMap: Record<CaseExpenseStatus, string> = {
    cancelled: "border-border/50 bg-muted text-muted-foreground",
    overdue: "border-destructive/20 bg-destructive/10 text-destructive",
    paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-700"
  };

  return statusClassMap[status];
}
