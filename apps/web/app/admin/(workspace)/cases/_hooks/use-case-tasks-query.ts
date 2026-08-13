"use client";

import { useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import type { CaseTasksListResponse } from "../_types/cases.types";
import { useCasesQuery } from "./use-cases-query";

const caseTasksPageSize = 8;

export function useCaseTasksQuery(caseId: string) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const query = useCasesQuery<CaseTasksListResponse>(
    casesQueries.tasks({ caseId, cursor, limit: caseTasksPageSize })
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
    pageSize: caseTasksPageSize
  };
}
