"use client";

import type { CaseCalendarEventDto } from "../../../_types/cases.types";
import { caseHearingTypeLabels } from "../../../_constants/cases.constants";
import { formatCaseMoney } from "../case-detail-format";
import {
  calendarEventTypeDotClassNames,
  calendarEventTypeShortLabels
} from "./constants";

export function CalendarDayTooltip({
  date,
  events
}: {
  date: string;
  events: CaseCalendarEventDto[];
}) {
  return (
    <div
      className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 w-72 -translate-x-1/2 rounded-xl border border-border/50 bg-popover px-3 py-2.5 text-left font-normal leading-normal text-popover-foreground shadow-[0_14px_34px_-20px_rgba(15,23,42,0.42)] animate-in fade-in-0 zoom-in-95"
      role="dialog"
    >
      <span className="block text-xs font-medium text-muted-foreground">
        {formatCalendarDate(date)}
      </span>
      <span className="mt-2 grid gap-2">
        {events.map((event) => (
          <span
            className="grid grid-cols-[auto_1fr_auto] items-start gap-2"
            key={`${event.type}-${event.id}`}
          >
            <span
              className={`mt-1.5 h-2.5 w-2.5 rounded-[3px] ${calendarEventTypeDotClassNames[event.type]}`}
              aria-hidden="true"
            />
            <span className="grid min-w-0 gap-0.5">
              <span className="truncate text-sm font-medium text-popover-foreground">
                {event.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {calendarEventTypeShortLabels[event.type]}
              </span>
            </span>
            {event.type === "payment_due" ? (
              <span className="grid justify-items-end gap-0.5 text-right">
                <span className="text-sm font-semibold text-popover-foreground">
                  {event.amount ? formatCaseMoney(event.amount, event.currencyCode) : "Sin monto"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {event.status === "overdue" ? "Vencido" : "Pendiente"}
                </span>
              </span>
            ) : event.type === "task_due" ? (
              <span className="text-xs font-medium text-muted-foreground">
                {event.status === "in_progress" ? "En curso" : "Pendiente"}
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {event.time ? `${event.time} · ` : ""}
                {event.hearingType ? caseHearingTypeLabels[event.hearingType] : "Audiencia"}
              </span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}

function formatCalendarDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`)
  );
}
