"use client";

import { useEffect, useState } from "react";
import { useCatalogOptionsQuery } from "./use-catalog-options-query";
import type { CaseFilterKey, CaseFiltersDraft } from "../_types/case-filter.types";
import type { ForumDto, ProvinceDto } from "../_types/cases.types";
import { hasCaseFilterChanges, hasCaseFilters } from "../_utils/case-filter-options";

export function useCaseFiltersController(filters: CaseFiltersDraft) {
  const [draft, setDraft] = useState<CaseFiltersDraft>(filters);
  const provincesQuery = useCatalogOptionsQuery<ProvinceDto>("/provinces", "provinces", {
    limit: 50
  });
  const forumsQuery = useCatalogOptionsQuery<ForumDto>("/forums", "forums", {
    limit: 50,
    provinceId: draft.provinceId || undefined
  });

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
