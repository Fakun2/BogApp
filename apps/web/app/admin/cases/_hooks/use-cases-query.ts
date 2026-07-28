"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { caseKeys, listCases } from "../_api/cases.api";
import type { CasesListResponse, CasesQueryParams } from "../_types/cases.types";

export function useCasesQuery(params: CasesQueryParams) {
  return useDashboardQuery<CasesListResponse>({
    permission: "cases:read",
    queryKey: caseKeys.list(params),
    queryFn: () => listCases(params)
  });
}
