"use client";

import { useMemo, useState } from "react";
import { Banknote, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminPrimaryActionButtonClassName } from "../../../../_constants/dashboard";
import { adminSurfaceClassName } from "../../../../_constants/dashboard";
import { casesQueries } from "../../../_api/cases.query-controller";
import { useCaseCalendarEventsQuery } from "../../../_hooks/use-case-calendar-events-query";
import { useCasesQuery } from "../../../_hooks/use-cases-query";
import {
  defaultCalendarEventTypes,
  type CalendarEventType,
  type CalendarView
} from "./constants";
import { filterCalendarEvents, getCurrentMonthKey, getMonthLabel, shiftMonth } from "./date-utils";
import { CalendarEventList } from "./event-list";
import { CalendarMonthGrid } from "./month-grid";
import { CalendarError, CalendarMessage, CalendarSkeleton } from "./states";
import { CalendarToolbar } from "./toolbar";
import { CaseExpenseSheet } from "../expense-sheet";

export function CaseCalendarCard({
  canCreateExpense,
  canUpdateExpense,
  caseId
}: {
  canCreateExpense: boolean;
  canUpdateExpense: boolean;
  caseId: string;
}) {
  const [month, setMonth] = useState(() => getCurrentMonthKey());
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<CalendarView>("month");
  const [visibleEventTypes, setVisibleEventTypes] = useState<CalendarEventType[]>([
    ...defaultCalendarEventTypes
  ]);
  const calendarQuery = useCasesQuery(casesQueries.calendar({ caseId, mode: "month", month }));
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

  function toggleEventType(type: CalendarEventType, checked: boolean) {
    setVisibleEventTypes((currentTypes) => {
      const nextTypes = checked
        ? [...new Set([...currentTypes, type])]
        : currentTypes.filter((currentType) => currentType !== type);

      return nextTypes.length ? nextTypes : currentTypes;
    });
  }

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} min-h-[380px] overflow-visible border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CalendarToolbar
        actions={<CalendarCreateActions canCreateExpense={canCreateExpense} caseId={caseId} />}
        eventCount={visibleEventsCount}
        monthLabel={getMonthLabel(month)}
        onGoToday={() => setMonth(getCurrentMonthKey())}
        onNavigate={(direction) => setMonth((currentMonth) => shiftMonth(currentMonth, direction))}
        onSearch={setSearchQuery}
        onToggleType={toggleEventType}
        onViewChange={setView}
        searchQuery={searchQuery}
        view={view}
        visibleTypes={visibleEventTypes}
      />
      <CardContent className="grid gap-3 px-4 pb-4 md:px-5">
        {calendarQuery.isLoading && !calendarQuery.data ? (
          <CalendarSkeleton />
        ) : calendarQuery.error ? (
          <CalendarError message={calendarQuery.error.message} />
        ) : !calendarQuery.hasPermission ? (
          <CalendarMessage message="No tenes permisos para ver vencimientos del expediente." />
        ) : view === "month" ? (
          <CalendarMonthGrid
            events={visibleMonthEvents}
            isFetching={calendarQuery.isFetching}
            month={month}
          />
        ) : calendarEventsQuery.isLoading ? (
          <CalendarSkeleton />
        ) : calendarEventsQuery.error ? (
          <CalendarError message={calendarEventsQuery.error.message} />
        ) : (
          <CalendarEventList
            canGoBack={calendarEventsQuery.canGoBack}
            canGoForward={Boolean(calendarEventsQuery.data?.pageInfo?.hasNextPage)}
            events={visibleListEvents}
            goBack={calendarEventsQuery.goBack}
            goForward={calendarEventsQuery.goForward}
            onEventSelect={(event) => {
              if (event.type === "payment_due" && canUpdateExpense) {
                setSelectedExpenseId(event.id);
              }
            }}
            pageIndex={calendarEventsQuery.pageIndex}
          />
        )}
      </CardContent>
      {canUpdateExpense && selectedExpenseQuery.data ? (
        <CaseExpenseSheet
          caseId={caseId}
          expense={selectedExpenseQuery.data}
          hideTaskSelect
          onOpenChange={(open) => {
            if (!open) {
              setSelectedExpenseId(null);
            }
          }}
          open={Boolean(selectedExpenseId)}
          tasks={[]}
        />
      ) : null}
    </Card>
  );
}

function CalendarCreateActions({
  canCreateExpense,
  caseId
}: {
  canCreateExpense: boolean;
  caseId: string;
}) {
  return (
    <section className="flex items-center gap-1" aria-label="Crear eventos del calendario">
      <Button
        type="button"
        variant="outline"
        className="h-9 w-9 rounded-xl border-border/50 p-0 text-sm sm:w-auto sm:px-4"
        disabled
        title="Las audiencias todavia no estan modeladas."
        aria-label="Nueva audiencia"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Nueva audiencia</span>
      </Button>
      {canCreateExpense ? (
        <CaseExpenseSheet
          caseId={caseId}
          tasks={[]}
          trigger={
            <Button
              type="button"
              className={`h-9 w-9 rounded-xl p-0 text-sm sm:w-auto sm:px-4 ${adminPrimaryActionButtonClassName}`}
              aria-label="Nuevo gasto"
            >
              <Banknote className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nuevo gasto</span>
            </Button>
          }
        />
      ) : null}
    </section>
  );
}
