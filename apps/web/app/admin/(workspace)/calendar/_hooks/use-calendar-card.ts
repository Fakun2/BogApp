"use client";

import { useEffect, useMemo, useState } from "react";
import { casesQueries } from "../../cases/_api/cases.query-controller";
import { useCasesQuery } from "../../cases/_hooks/use-cases-query";
import {
  calendarEventListPageSize,
  defaultCalendarEventTypes,
  type CalendarEventType,
  type CalendarView
} from "../_constants/calendar.constants";
import { filterCalendarEvents, getCurrentMonthKey, shiftMonth } from "../_utils/calendar-date-utils";

export function useCalendarCard({
  caseId,
  canCreateTask,
  taskSheetOpen = false,
  canUpdateExpense,
  scope = "case"
}: {
  caseId?: string;
  canCreateTask: boolean;
  taskSheetOpen?: boolean;
  canUpdateExpense: boolean;
  scope?: "case" | "tenant";
}) {
  const [month, setMonth] = useState(() => getCurrentMonthKey());
  const [listPageIndex, setListPageIndex] = useState(0);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [view, setView] = useState<CalendarView>("month");
  const [visibleEventTypes, setVisibleEventTypes] = useState<CalendarEventType[]>([
    ...defaultCalendarEventTypes
  ]);
  const calendarQuery = useCasesQuery(
    scope === "tenant"
      ? casesQueries.tenantCalendar({ caseId, mode: "month", month })
      : casesQueries.calendar({
          caseId: caseId ?? "",
          enabled: Boolean(caseId),
          mode: "month",
          month
        })
  );
  const assigneesQuery = useCasesQuery({
    ...casesQueries.taskAssignees(),
    enabled: canCreateTask && taskSheetOpen
  });
  const selectedExpenseQuery = useCasesQuery(
    casesQueries.expense({
      caseId: caseId ?? "",
      enabled: Boolean(selectedExpenseId && caseId),
      expenseId: selectedExpenseId ?? "00000000-0000-0000-0000-000000000000"
    })
  );
  const visibleMonthEvents = useMemo(
    () => filterCalendarEvents(calendarQuery.data?.events ?? [], visibleEventTypes),
    [calendarQuery.data?.events, visibleEventTypes]
  );
  const visibleListEvents = useMemo(() => {
    const start = listPageIndex * calendarEventListPageSize;

    return visibleMonthEvents.slice(start, start + calendarEventListPageSize);
  }, [listPageIndex, visibleMonthEvents]);
  const visibleEventsCount = visibleMonthEvents.length;
  const canGoBack = listPageIndex > 0;
  const canGoForward = (listPageIndex + 1) * calendarEventListPageSize < visibleEventsCount;

  useEffect(() => {
    setListPageIndex(0);
  }, [caseId, month, scope, visibleEventTypes]);

  function goToToday() {
    setMonth(getCurrentMonthKey());
  }

  function navigateMonth(direction: -1 | 1) {
    setMonth((currentMonth) => shiftMonth(currentMonth, direction));
  }

  function selectCalendarEvent(event: { id: string; type: string }) {
    if (event.type === "payment_due" && canUpdateExpense && caseId) {
      setSelectedExpenseId(event.id);
    }
  }

  function toggleEventType(type: CalendarEventType, checked: boolean) {
    setVisibleEventTypes((currentTypes) => {
      const nextTypes = checked
        ? [...new Set([...currentTypes, type])]
        : currentTypes.filter((currentType) => currentType !== type);

      return nextTypes.length ? nextTypes : currentTypes;
    });
  }

  function clearEventTypes() {
    setVisibleEventTypes([...defaultCalendarEventTypes]);
  }

  return {
    calendarQuery,
    calendarListPagination: {
      canGoBack,
      canGoForward,
      goBack: () => setListPageIndex((currentPage) => Math.max(currentPage - 1, 0)),
      goForward: () =>
        setListPageIndex((currentPage) => (canGoForward ? currentPage + 1 : currentPage)),
      pageIndex: listPageIndex,
      pageSize: calendarEventListPageSize
    },
    assignees: assigneesQuery.data ?? [],
    assigneesQuery,
    clearEventTypes,
    goToToday,
    month,
    navigateMonth,
    selectCalendarEvent,
    selectedExpenseId,
    selectedExpenseQuery,
    setSelectedExpenseId,
    setView,
    toggleEventType,
    view,
    visibleEventsCount,
    visibleEventTypes,
    visibleListEvents,
    visibleMonthEvents
  };
}
