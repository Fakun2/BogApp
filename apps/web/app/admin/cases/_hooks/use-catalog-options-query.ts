"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { caseKeys, listCatalogOptions } from "../_api/cases.api";
import type { CatalogResponse } from "../_types/cases.types";

export function useCatalogOptionsQuery<TItem>(
  path: string,
  key: string,
  params: Record<string, string | number | undefined> = {}
) {
  return useDashboardQuery<CatalogResponse<TItem>>({
    permission: key === "provinces" ? "provinces:read" : "forums:read",
    queryKey: caseKeys.options(key, params),
    queryFn: () => listCatalogOptions<TItem>({ params, path })
  });
}
