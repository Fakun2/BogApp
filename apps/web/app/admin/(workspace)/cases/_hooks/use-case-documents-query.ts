"use client";

import { useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import type { CaseDocumentsListResponse } from "../_types/cases.types";
import { useCasesQuery } from "./use-cases-query";

const caseDocumentsPageSize = 8;

export function useCaseDocumentsQuery({
  caseId,
  categoryId,
  enabled = true
}: {
  caseId: string;
  categoryId?: string;
  enabled?: boolean;
}) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const query = useCasesQuery<CaseDocumentsListResponse>(
    casesQueries.documents({
      caseId,
      categoryId,
      cursor,
      enabled,
      limit: caseDocumentsPageSize
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
    pageSize: caseDocumentsPageSize,
    resetPagination: () => setCursorStack([""])
  };
}
