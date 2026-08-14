"use client";

import { useEffect, useState } from "react";
import { casesQueries } from "../_api/cases.query-controller";
import { calendarEventListPageSize, type CalendarEventType } from "../_components/detail/case-calendar/constants";
import type { CaseCalendarResponseDto } from "../_types/cases.types";
import { useCasesQuery } from "./use-cases-query";

export function useCaseCalendarEventsQuery({
  caseId,
  enabled,
  month,
  visibleTypes
}: {
  caseId: string;
  enabled: boolean;
  month: string;
  visibleTypes: CalendarEventType[];
}) {
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const types = visibleTypes.join(",");
  const query = useCasesQuery<CaseCalendarResponseDto>(
    casesQueries.calendar({
      caseId,
      cursor,
      enabled,
      limit: calendarEventListPageSize,
      mode: "list",
      month,
      types
    })
  );

  useEffect(() => {
    setCursorStack([""]);
  }, [month, types]);

  return {
    ...query,
    canGoBack: cursorStack.length > 1,
    goBack: () => setCursorStack((current) => current.slice(0, -1)),
    goForward: () => {
      const nextCursor = query.data?.pageInfo?.nextCursor;
      if (nextCursor) {
        setCursorStack((current) => [...current, nextCursor]);
      }
    },
    pageIndex: cursorStack.length - 1,
    pageSize: calendarEventListPageSize
  };
}

