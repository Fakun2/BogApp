"use client";

import { useState } from "react";
import type { CaseCalendarEventDto } from "../../../_types/cases.types";
import { calendarEventTypeDotClassNames } from "./constants";
import type { CalendarEventType } from "./constants";
import { CalendarEmptyDayActions } from "./empty-day-actions";
import { CalendarDayTooltip } from "./calendar-day-tooltip";
import type { TaskAssigneeOption } from "../../../_types/cases.types";

const calendarEventTypeIndicatorOrder: CalendarEventType[] = [
  "payment_due",
  "task_due",
  "hearing"
];

export function CalendarDay({
  assignees,
  canCreateExpense,
  canCreateHearing,
  canCreateTask,
  caseId,
  date,
  day,
  events,
  inCurrentMonth
}: {
  assignees: TaskAssigneeOption[];
  canCreateExpense: boolean;
  canCreateHearing: boolean;
  canCreateTask: boolean;
  caseId: string;
  date: string;
  day: number;
  events: CaseCalendarEventDto[];
  inCurrentMonth: boolean;
}) {
  const hasEvents = events.length > 0;
  const [open, setOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const canCreateOnDay = inCurrentMonth && (canCreateExpense || canCreateHearing || canCreateTask);
  const eventTypes = new Set(events.map((event) => event.type));
  const visibleEventTypes = calendarEventTypeIndicatorOrder.filter((eventType) =>
    eventTypes.has(eventType)
  );
  const hiddenEventsCount = Math.max(events.length - visibleEventTypes.length, 0);
  const cell = (
    <button
      type="button"
      aria-expanded={hasEvents ? open : undefined}
      className={`relative flex h-12 w-full items-center justify-center border-r border-t border-border/35 text-sm transition-colors hover:bg-secondary/35 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
        hasEvents && inCurrentMonth
          ? "font-semibold text-foreground"
          : inCurrentMonth
            ? "text-muted-foreground"
            : "text-muted-foreground/45"
      }`}
      onClick={() => {
        if (hasEvents) {
          setOpen((currentOpen) => !currentOpen);
          return;
        }

        if (canCreateOnDay) {
          setActionsOpen(true);
        }
      }}
      onDoubleClick={() => {
        if (hasEvents && canCreateOnDay) {
          setOpen(false);
          setActionsOpen(true);
        }
      }}
    >
      {day}
      {hasEvents ? (
        <span
          className="absolute bottom-1.5 right-1.5 flex max-w-[calc(100%-0.75rem)] items-center justify-end gap-0.5"
          aria-hidden="true"
        >
          {visibleEventTypes.map((eventType) => (
            <span
              className={`h-1.5 w-1.5 rounded-full shadow-[0_0_0_1px_hsl(var(--background))] ${calendarEventTypeDotClassNames[eventType]}`}
              key={eventType}
            />
          ))}
          {hiddenEventsCount > 0 ? (
            <span className="ml-0.5 text-[0.625rem] font-semibold leading-none text-muted-foreground">
              +{hiddenEventsCount}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );

  return (
    <li className="relative min-h-12">
      {hasEvents ? (
        <>
          {cell}
          {open ? <CalendarDayTooltip date={date} events={events} /> : null}
          {canCreateOnDay ? (
            <CalendarEmptyDayActions
              assignees={assignees}
              canCreateExpense={canCreateExpense}
              canCreateHearing={canCreateHearing}
              canCreateTask={canCreateTask}
              caseId={caseId}
              date={date}
              day={day}
              open={actionsOpen}
              onOpenChange={setActionsOpen}
            />
          ) : null}
        </>
      ) : (
        canCreateOnDay ? (
          <>
            {cell}
            <CalendarEmptyDayActions
              assignees={assignees}
              canCreateExpense={canCreateExpense}
              canCreateHearing={canCreateHearing}
              canCreateTask={canCreateTask}
              caseId={caseId}
              date={date}
              day={day}
              open={actionsOpen}
              onOpenChange={setActionsOpen}
            />
          </>
        ) : (
          cell
        )
      )}
    </li>
  );
}
