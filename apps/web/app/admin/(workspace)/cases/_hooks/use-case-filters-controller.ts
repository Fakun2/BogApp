"use client";

import { useEffect, useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import type { CaseFilterKey, CaseFiltersDraft } from "../_types/case-filter.types";
import type { CatalogResponse, ForumDto, ProvinceDto } from "../_types/cases.types";
import { hasCaseFilterChanges, hasCaseFilters } from "../_utils/case-filter-options";
import { useCasesQuery } from "./use-cases-query";

export function useCaseFiltersController(filters: CaseFiltersDraft) {
  const [draft, setDraft] = useState<CaseFiltersDraft>(filters);
  const provincesQuery = useCasesQuery<CatalogResponse<ProvinceDto>>(
    casesQueries.catalogOptions<ProvinceDto>({
      key: "provinces",
      path: "/provinces",
      params: { limit: 50 }
    })
  );
  const forumsQuery = useCasesQuery<CatalogResponse<ForumDto>>(
    casesQueries.catalogOptions<ForumDto>({
      key: "forums",
      path: "/forums",
      params: { limit: 50, provinceId: draft.provinceId || undefined }
    })
  );

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  function updateDraft<K extends CaseFilterKey>(key: K, value: CaseFiltersDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === "provinceId" ? { forumTemplateId: "" } : {})
    }));
  }

  return {
    draft,
    forums: forumsQuery.data?.items ?? [],
    forumsLoading: forumsQuery.isLoading,
    hasActiveFilters: hasCaseFilters(filters),
    hasDraftFilters: hasCaseFilterChanges({ draft, filters }),
    provinces: provincesQuery.data?.items ?? [],
    provincesLoading: provincesQuery.isLoading,
    updateDraft
  };
}
