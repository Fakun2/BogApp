import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { adminSurfaceClassName } from "../../../_constants/dashboard";
import { casesPageSize } from "../../_constants/cases.constants";

export function CasesTableSkeleton() {
  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col overflow-hidden border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardHeader className="flex shrink-0 flex-col gap-3 border-b border-border/30 px-4 py-4 md:gap-4 md:px-6 md:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-2">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="h-4 w-80 max-w-[70vw]" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-56" />
          <SkeletonBlock className="h-10 w-28" />
          <SkeletonBlock className="h-10 w-28" />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
        <div className="min-h-0 flex-1 overflow-auto rounded-2xl">
          <Table className="h-full text-xs">
            <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableHead className="h-11 px-4" key={`case-skeleton-head-${index}`}>
                    <SkeletonBlock className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: casesPageSize }).map((_, rowIndex) => (
                <TableRow className="h-[70px] border-border/40" key={`case-skeleton-row-${rowIndex}`}>
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <TableCell className="px-4 py-4" key={`case-skeleton-cell-${rowIndex}-${cellIndex}`}>
                      <SkeletonBlock className={cellIndex === 1 ? "h-5 w-44" : "h-5 w-24"} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-border/40 px-1">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-8 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}
