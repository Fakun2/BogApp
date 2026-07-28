"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import type { CaseExpenseFormValues } from "@/lib/validation/cases";
import { saveCaseExpense } from "../_api/cases.api";
import type { CaseExpenseDto } from "../_types/cases.types";

export function useSaveCaseExpenseMutation({
  caseId,
  expenseId
}: {
  caseId: string;
  expenseId?: string;
}) {
  const queryClient = useQueryClient();

  return useDashboardMutation<CaseExpenseDto, CaseExpenseFormValues>({
    mutationFn: (input) => saveCaseExpense({ caseId, expenseId, input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: expenseId ? "expenses:update" : "expenses:create"
  });
}
