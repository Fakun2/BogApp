"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { legalCatalogKeys, listForums, listProvinces } from "../_api/legal-catalogs.api";
import type { ForumQueryParams, ProvinceQueryParams } from "../_types/legal-catalogs.types";

export function useForumsQuery(params: ForumQueryParams) {
  return useDashboardQuery({
    permission: "forums:read",
    queryKey: legalCatalogKeys.forums(params),
    queryFn: () => listForums(params)
  });
}

export function useProvincesQuery(params: ProvinceQueryParams) {
  return useDashboardQuery({
    permission: "provinces:read",
    queryKey: legalCatalogKeys.provinces(params),
    queryFn: () => listProvinces(params)
  });
}
