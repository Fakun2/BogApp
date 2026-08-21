"use client";

import { useEffect, useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import type { CaseExpensesListResponse, CaseExpenseStatus } from "../_types/cases.types";
import { useCasesQuery } from "./use-cases-query";

const caseExpensesPageSize = 8;

export function useCaseExpensesQuery({
  caseId,
  currencyCode,
  status,
  taskId
}: {
  caseId: string;
  currencyCode?: string;
  status?: CaseExpenseStatus;
  taskId?: string;
}) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const query = useCasesQuery<CaseExpensesListResponse>(
    casesQueries.expenses({
      caseId,
      currencyCode,
      cursor,
      limit: caseExpensesPageSize,
      status,
      taskId
    })
  );

  useEffect(() => {
    setCursorStack([""]);
  }, [caseId, currencyCode, status, taskId]);

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
