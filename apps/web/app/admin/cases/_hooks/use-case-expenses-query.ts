"use client";

import { useState } from "react";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { caseKeys, listCaseExpenses } from "../_api/cases.api";
import type { CaseExpensesListResponse } from "../_types/cases.types";

const caseExpensesPageSize = 8;

export function useCaseExpensesQuery({ caseId, taskId }: { caseId: string; taskId: string }) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const params = { cursor, limit: caseExpensesPageSize, taskId };
  const query = useDashboardQuery<CaseExpensesListResponse>({
    permission: "expenses:read",
    queryKey: caseKeys.expenses(caseId, params),
    queryFn: () => listCaseExpenses({ caseId, ...params })
  });

  return {
    ...query,
    canGoBack: cursorStack.length > 1,
    goBack: () => setCursorStack((current) => current.slice(0, -1)),
    goForward: () => {
      const nextCursor = query.data?.pageInfo.nextCursor;
      if (nextCursor) {
        setCursorStack((current) => [...current, nextCursor]);
      }
    },
    pageIndex: cursorStack.length - 1,
    pageSize: caseExpensesPageSize
  };
}
