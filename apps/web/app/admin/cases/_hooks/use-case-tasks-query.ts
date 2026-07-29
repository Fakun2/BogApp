"use client";

import { useState } from "react";
import { useDashboardQuery } from "@/lib/query/use-dashboard-query";
import { caseKeys, listCaseTasks } from "../_api/cases.api";
import type { CaseTasksListResponse } from "../_types/cases.types";

const caseTasksPageSize = 8;

export function useCaseTasksQuery(caseId: string) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const params = { cursor, limit: caseTasksPageSize };
  const query = useDashboardQuery<CaseTasksListResponse>({
    permission: "tasks:read",
    queryKey: caseKeys.tasks(caseId, params),
    queryFn: () => listCaseTasks({ caseId, ...params })
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
    pageSize: caseTasksPageSize
  };
}
