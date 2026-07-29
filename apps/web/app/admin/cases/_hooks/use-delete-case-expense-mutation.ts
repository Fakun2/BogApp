"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { deleteCaseExpense } from "../_api/cases.api";

export function useDeleteCaseExpenseMutation(caseId: string) {
  const queryClient = useQueryClient();

  return useDashboardMutation<{ status: "ok" }, string>({
    mutationFn: (expenseId) => deleteCaseExpense({ caseId, expenseId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: "expenses:delete"
  });
}
