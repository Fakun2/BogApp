"use client";

import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { caseKeys, listCaseExpenseAttachments } from "../_api/cases.api";
import type { CaseExpenseAttachmentsListResponse } from "../_types/cases.types";

export function useCaseExpenseAttachmentsQuery({
  caseId,
  expenseId,
  enabled = true
}: {
  caseId: string;
  enabled?: boolean;
  expenseId: string;
}) {
  return useDashboardQuery<CaseExpenseAttachmentsListResponse>({
    enabled,
    permission: "expenses:read",
    queryKey: caseKeys.expenseAttachments(caseId, expenseId),
    queryFn: () => listCaseExpenseAttachments({ caseId, expenseId })
  });
}
