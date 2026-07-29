"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CaseFormValues } from "@/lib/validation/cases";
import { saveCase } from "../_api/cases.api";
import type { CaseDto } from "../_types/cases.types";

export function useSaveCaseMutation(caseId?: string) {
  const queryClient = useQueryClient();

  return useDashboardMutation<CaseDto, CaseFormValues>({
    permission: caseId ? "cases:update" : "cases:create",
    mutationFn: (input) => saveCase({ caseId, input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    }
  });
}
