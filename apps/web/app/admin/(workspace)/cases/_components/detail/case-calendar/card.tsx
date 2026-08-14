"use client";

import { Card, CardContent } from "@/components/ui/card";
import { adminSurfaceClassName } from "../../../../_constants/dashboard";
import { getMonthLabel } from "./date-utils";
import { CalendarCreateActions } from "./create-actions";
import { CalendarEventList } from "./event-list";
import { CalendarMonthGrid } from "./month-grid";
import { CalendarError, CalendarMessage, CalendarSkeleton } from "./states";
import { CalendarToolbar } from "./toolbar";
import { useCalendarCard } from "./use-calendar-card";
import { CaseExpenseSheet } from "../expense-sheet";
import type { CaseCalendarCardProps } from "./types";

export function CaseCalendarCard({
  canCreateExpense,
  canCreateHearing,
  canCreateTask,
  canUpdateExpense,
  caseId
}: CaseCalendarCardProps) {
  const calendar = useCalendarCard({ canCreateTask, canUpdateExpense, caseId });

  return (
    <Card
      data-admin-surface
      className={`${adminSurfaceClassName} min-h-[380px] overflow-visible border-0 shadow-[var(--admin-card-shadow)]`}
    >
      <CalendarToolbar
        actions={
          <CalendarCreateActions
            canCreateExpense={canCreateExpense}
            canCreateHearing={canCreateHearing}
            caseId={caseId}
          />
        }
        eventCount={calendar.visibleEventsCount}
        monthLabel={getMonthLabel(calendar.month)}
        onGoToday={calendar.goToToday}
        onNavigate={calendar.navigateMonth}
        onToggleType={calendar.toggleEventType}
        onViewChange={calendar.setView}
        view={calendar.view}
        visibleTypes={calendar.visibleEventTypes}
      />
      <CardContent className="grid gap-3 px-4 pb-4 md:px-5">
        {calendar.calendarQuery.isLoading && !calendar.calendarQuery.data ? (
          <CalendarSkeleton />
        ) : calendar.calendarQuery.error ? (
          <CalendarError message={calendar.calendarQuery.error.message} />
        ) : !calendar.calendarQuery.hasPermission ? (
          <CalendarMessage message="No tenes permisos para ver vencimientos del expediente." />
        ) : calendar.view === "month" ? (
          <CalendarMonthGrid
            assignees={calendar.assignees}
            canCreateExpense={canCreateExpense}
            canCreateHearing={canCreateHearing}
            canCreateTask={canCreateTask}
            caseId={caseId}
            events={calendar.visibleMonthEvents}
            isFetching={calendar.calendarQuery.isFetching}
            month={calendar.month}
          />
        ) : calendar.calendarEventsQuery.isLoading ? (
          <CalendarSkeleton />
        ) : calendar.calendarEventsQuery.error ? (
          <CalendarError message={calendar.calendarEventsQuery.error.message} />
        ) : (
          <CalendarEventList
            canGoBack={calendar.calendarEventsQuery.canGoBack}
            canGoForward={Boolean(calendar.calendarEventsQuery.data?.pageInfo?.hasNextPage)}
            events={calendar.visibleListEvents}
            goBack={calendar.calendarEventsQuery.goBack}
            goForward={calendar.calendarEventsQuery.goForward}
            onEventSelect={calendar.selectCalendarEvent}
            pageIndex={calendar.calendarEventsQuery.pageIndex}
          />
        )}
      </CardContent>
      {canUpdateExpense && calendar.selectedExpenseQuery.data ? (
        <CaseExpenseSheet
          caseId={caseId}
          expense={calendar.selectedExpenseQuery.data}
          hideTaskSelect
          onOpenChange={(open) => {
            if (!open) {
              calendar.setSelectedExpenseId(null);
            }
          }}
          open={Boolean(calendar.selectedExpenseId)}
          tasks={[]}
        />
      ) : null}
    </Card>
  );
}
