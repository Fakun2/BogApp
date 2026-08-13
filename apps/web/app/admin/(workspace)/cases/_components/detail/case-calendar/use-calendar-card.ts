"use client";

import { useMemo, useState } from "react";
import { casesQueries } from "../../../_api/cases.query-controller";
import { useCaseCalendarEventsQuery } from "../../../_hooks/use-case-calendar-events-query";
import { useCasesQuery } from "../../../_hooks/use-cases-query";
import {
  defaultCalendarEventTypes,
  type CalendarEventType,
  type CalendarView
} from "./constants";
import { filterCalendarEvents, getCurrentMonthKey, shiftMonth } from "./date-utils";

export function useCalendarCard({
  caseId,
  canCreateTask,
  canUpdateExpense
}: {
  caseId: string;
  canCreateTask: boolean;
  canUpdateExpense: boolean;
}) {
  const [month, setMonth] = useState(() => getCurrentMonthKey());
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<CalendarView>("month");
  const [visibleEventTypes, setVisibleEventTypes] = useState<CalendarEventType[]>([
    ...defaultCalendarEventTypes
  ]);
  const calendarQuery = useCasesQuery(casesQueries.calendar({ caseId, mode: "month", month }));
  const assigneesQuery = useCasesQuery({
    ...casesQueries.taskAssignees(),
    enabled: canCreateTask
  });
  const calendarEventsQuery = useCaseCalendarEventsQuery({
    caseId,
    enabled: view === "list",
    month,
    search: searchQuery,
    visibleTypes: visibleEventTypes
  });
  const selectedExpenseQuery = useCasesQuery(
    casesQueries.expense({
      caseId,
      enabled: Boolean(selectedExpenseId),
      expenseId: selectedExpenseId ?? "00000000-0000-0000-0000-000000000000"
    })
  );
  const visibleMonthEvents = useMemo(
    () => filterCalendarEvents(calendarQuery.data?.events ?? [], visibleEventTypes, searchQuery),
    [calendarQuery.data?.events, searchQuery, visibleEventTypes]
  );
  const visibleListEvents = calendarEventsQuery.data?.events ?? [];
  const visibleEventsCount = view === "list" ? visibleListEvents.length : visibleMonthEvents.length;

  function goToToday() {
    setMonth(getCurrentMonthKey());
  }

  function navigateMonth(direction: -1 | 1) {
    setMonth((currentMonth) => shiftMonth(currentMonth, direction));
  }

  function selectCalendarEvent(event: { id: string; type: string }) {
    if (event.type === "payment_due" && canUpdateExpense) {
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

  return {
    calendarEventsQuery,
    calendarQuery,
    assignees: assigneesQuery.data ?? [],
    assigneesQuery,
    goToToday,
    month,
    navigateMonth,
    searchQuery,
    selectCalendarEvent,
    selectedExpenseId,
    selectedExpenseQuery,
    setSearchQuery,
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
