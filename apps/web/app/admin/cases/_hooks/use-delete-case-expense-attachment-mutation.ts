"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { deleteCaseExpenseAttachment } from "../_api/cases.api";

export function useDeleteCaseExpenseAttachmentMutation({
  caseId,
  expenseId
}: {
  caseId: string;
  expenseId: string;
}) {
  const queryClient = useQueryClient();

  return useDashboardMutation<{ status: "ok" }, string>({
    mutationFn: (attachmentId) => deleteCaseExpenseAttachment({ attachmentId, caseId, expenseId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: "expenses:update"
  });
}
