"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import type { CasesQuerySpec } from "../_api/cases.query-controller";

export function useCasesQuery<TData>(spec: CasesQuerySpec<TData>) {
  return useDashboardQuery<TData>(spec);
}
