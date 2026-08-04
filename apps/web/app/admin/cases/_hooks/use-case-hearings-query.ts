"use client";

import { useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import { useCasesQuery } from "./use-cases-query";

const caseHearingsPageSize = 8;

export function useCaseHearingsQuery(caseId: string) {
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined]);
  const pageIndex = cursorStack.length - 1;
  const cursor = cursorStack[pageIndex];
  const query = useCasesQuery(
    casesQueries.hearings({ caseId, cursor, limit: caseHearingsPageSize })
  );

  function goForward() {
    const nextCursor = query.data?.pageInfo.nextCursor;
    if (nextCursor) {
      setCursorStack((current) => [...current, nextCursor]);
    }
  }

  function goBack() {
    setCursorStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }

  return {
    ...query,
    canGoBack: pageIndex > 0,
    goBack,
    goForward,
    pageIndex
  };
}
