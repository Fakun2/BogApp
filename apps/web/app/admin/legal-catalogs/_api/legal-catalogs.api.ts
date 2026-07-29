import { dashboardHttpClient } from "@/lib/http";
import type {
  Forum,
  ForumQueryParams,
  LegalCatalogPage,
  Province,
  ProvinceQueryParams
} from "../_types/legal-catalogs.types";

export const legalCatalogKeys = {
  all: ["legal-catalogs"] as const,
  forums: (params: ForumQueryParams) => [...legalCatalogKeys.all, "forums", params] as const,
  provinces: (params: ProvinceQueryParams) =>
    [...legalCatalogKeys.all, "provinces", params] as const
};

export async function listForums(params: ForumQueryParams): Promise<LegalCatalogPage<Forum>> {
  return dashboardHttpClient.request<LegalCatalogPage<Forum>>({
    params: { ...params, includeInactive: true },
    path: "/forums"
  });
}

export async function listProvinces(
  params: ProvinceQueryParams
): Promise<LegalCatalogPage<Province>> {
  return dashboardHttpClient.request<LegalCatalogPage<Province>>({
    params,
    path: "/provinces"
  });
}
