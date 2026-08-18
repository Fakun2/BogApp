import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      className={`${adminSurfaceClassName} flex min-h-0 flex-1 flex-col overflow-hidden border-0 py-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CardHeader className="flex shrink-0 flex-col gap-3 border-b border-border/30 px-4 py-3 md:px-4 md:py-3 lg:flex-row lg:items-center lg:justify-between xl:px-5 xl:py-4">
        <div className="grid gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-80 max-w-[70vw]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-visible px-3 md:px-4 lg:overflow-hidden">
        <div className="max-h-[52svh] overflow-auto rounded-2xl lg:min-h-0 lg:max-h-none lg:flex-1">
          <Table className="min-w-full text-xs">
            <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableHead className="h-10 px-3" key={`case-skeleton-head-${index}`}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: casesPageSize }).map((_, rowIndex) => (
                <TableRow className="h-16 border-border/40" key={`case-skeleton-row-${rowIndex}`}>
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <TableCell
                      className="h-16 px-3 py-2"
                      key={`case-skeleton-cell-${rowIndex}-${cellIndex}`}
                    >
                      <Skeleton className={cellIndex === 1 ? "h-5 w-44" : "h-5 w-24"} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-border/40 px-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}
