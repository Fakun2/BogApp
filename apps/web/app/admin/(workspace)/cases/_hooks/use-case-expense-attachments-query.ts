"use client";

import { useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import type { CaseExpenseAttachmentsListResponse } from "../_types/cases.types";
import { useCasesQuery } from "./use-cases-query";

const caseExpenseAttachmentsPageSize = 8;

export function useCaseExpenseAttachmentsQuery({
  caseId,
  expenseId,
  enabled = true
}: {
  caseId: string;
  enabled?: boolean;
  expenseId: string;
}) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const query = useCasesQuery<CaseExpenseAttachmentsListResponse>(
    casesQueries.expenseAttachments({
      caseId,
      cursor,
      enabled,
      expenseId,
      limit: caseExpenseAttachmentsPageSize
    })
  );

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
    pageSize: caseExpenseAttachmentsPageSize
  };
}
