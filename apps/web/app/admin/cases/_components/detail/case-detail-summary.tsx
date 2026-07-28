import type { ReactNode } from "react";
import { ArrowLeft, Banknote, CheckCircle2, Clock3, Eye, ListTodo } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { adminSurfaceClassName, adminSurfacePrimaryClassName } from "../../../_constants/dashboard";
import { caseInstanceLabels, caseStatusLabels } from "../../_constants/cases.constants";
import type { CaseDetailDto } from "../../_types/cases.types";
import { formatCaseDate, formatCaseMoney } from "./case-detail-format";

export function CaseDetailSummary({ caseItem }: { caseItem: CaseDetailDto }) {
  return (
    <div className="grid shrink-0 gap-3 md:gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <Button asChild variant="outline" className="mb-2 h-8 px-2 text-muted-foreground">
            <Link href="/admin/cases">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Expedientes
            </Link>
          </Button>

          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1
                className={`line-clamp-2 text-xl font-semibold leading-tight md:truncate md:text-2xl ${adminSurfacePrimaryClassName}`}
              >
                {caseItem.caption}
              </h1>
              <div className="mt-2 grid gap-0.5 sm:max-w-[720px]">
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {caseItem.caseNumber}
                </p>
                <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {caseItem.province.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">{caseItem.forum.name}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CaseStatusPill status={caseItem.status} />
              <CaseJudicialDetailsPopover caseItem={caseItem} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <MetricCard
          icon={<Banknote className="h-5 w-5" aria-hidden="true" />}
          label="Gastos del expediente"
          value={formatCaseMoney(caseItem.metrics.totalExpenses)}
        />
        <MetricCard
          icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
          label="Pagos pendientes"
          value={formatCaseMoney(caseItem.metrics.pendingPayments)}
        />
        <MetricCard
          icon={<ListTodo className="h-5 w-5" aria-hidden="true" />}
          label="Tareas totales"
          value={String(caseItem.metrics.totalTasks)}
        />
        <MetricCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          label="Tareas pendientes"
          value={String(caseItem.metrics.pendingTasks)}
        />
      </div>
    </div>
  );
}

function CaseStatusPill({ status }: { status: CaseDetailDto["status"] }) {
  const classNameByStatus: Record<CaseDetailDto["status"], string> = {
    closed: "border-border/50 bg-muted text-muted-foreground",
    open: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    paused: "border-amber-500/20 bg-amber-500/10 text-amber-700"
  };

  return (
    <span
      className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium ${classNameByStatus[status]}`}
    >
      {caseStatusLabels[status]}
    </span>
  );
}

function CaseJudicialDetailsPopover({ caseItem }: { caseItem: CaseDetailDto }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 w-9 shrink-0 rounded-lg border-border/50 p-0"
          aria-label="Ver detalles judiciales del expediente"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[70svh] w-[min(360px,calc(100vw-2rem))] overflow-y-auto p-4">
        <div className="grid gap-4 text-sm">
          <DetailItem
            label="Centro judicial"
            value={caseItem.judicialCenter?.name ?? caseItem.judicialCenterText}
          />
          <DetailItem label="Juzgado / Tribunal" value={caseItem.court} />
          <DetailItem label="Instancia" value={caseInstanceLabels[caseItem.instance]} />
          <DetailItem label="Estado" value={caseStatusLabels[caseItem.status]} />
          <DetailItem label="Fecha de ingreso" value={formatCaseDate(caseItem.filingDate)} />
          <DetailItem label="Asunto" value={caseItem.subject} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} min-w-0 border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardContent className="flex min-w-0 items-center gap-2 p-3 sm:gap-3 sm:p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-btn-primary text-btn-primary-foreground sm:size-10">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[11px] text-muted-foreground sm:text-sm">
            {label}
          </span>
          <span
            className={`block truncate text-sm font-semibold leading-tight sm:text-lg lg:text-xl ${adminSurfacePrimaryClassName}`}
          >
            {value}
          </span>
        </span>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  className = "",
  label,
  value
}: {
  className?: string;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium text-foreground">{value || "Sin cargar"}</p>
    </div>
  );
}
