"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CasesMutationSpec } from "../_api/cases.mutation-controller";

export function useCasesMutation<TData, TVariables>(
  spec: CasesMutationSpec<TData, TVariables>
) {
  const queryClient = useQueryClient();

  return useDashboardMutation<TData, TVariables>({
    ...spec,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    }
  });
}
