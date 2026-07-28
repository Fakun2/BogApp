"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardMutation } from "@/lib/query/use-dashboard-mutation";
import { uploadCaseExpenseAttachment } from "../_api/cases.api";
import type { CaseExpenseAttachmentDto } from "../_types/cases.types";

export function useUploadCaseExpenseAttachmentMutation({
  caseId,
  expenseId
}: {
  caseId: string;
  expenseId: string;
}) {
  const queryClient = useQueryClient();

  return useDashboardMutation<CaseExpenseAttachmentDto, File>({
    mutationFn: (file) => uploadCaseExpenseAttachment({ caseId, expenseId, file }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("cases")
      });
    },
    permission: "expenses:update"
  });
}
