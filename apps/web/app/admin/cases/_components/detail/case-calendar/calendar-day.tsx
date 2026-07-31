import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import type { CaseCalendarEventDto } from "../../../_types/cases.types";
import { formatCaseMoney } from "../case-detail-format";
import {
  calendarEventTypeDotClassNames,
  calendarEventTypeShortLabels
} from "./constants";

export function CalendarDay({
  date,
  day,
  events,
  inCurrentMonth
}: {
  date: string;
  day: number;
  events: CaseCalendarEventDto[];
  inCurrentMonth: boolean;
}) {
  const hasEvents = events.length > 0;
  const cell = (
    <button
      type="button"
      className={`relative flex h-12 w-full items-center justify-center border-r border-t border-border/35 text-sm transition-colors hover:bg-secondary/35 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
        hasEvents && inCurrentMonth
          ? "font-semibold text-foreground"
          : inCurrentMonth
            ? "text-muted-foreground"
            : "text-muted-foreground/45"
      }`}
    >
      {day}
      {hasEvents ? (
        <span className="absolute right-1.5 top-1.5 flex gap-0.5" aria-hidden="true">
          {events.slice(0, 2).map((event) => (
            <span
              className={`h-1.5 w-1.5 rounded-full ${calendarEventTypeDotClassNames[event.type]}`}
              key={`${event.type}-${event.id}`}
            />
          ))}
        </span>
      ) : null}
    </button>
  );

  return (
    <li className="relative min-h-12">
      {hasEvents ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{cell}</TooltipTrigger>
            <CalendarDayTooltip date={date} events={events} />
          </Tooltip>
        </TooltipProvider>
      ) : (
        cell
      )}
    </li>
  );
}

function CalendarDayTooltip({
  date,
  events
}: {
  date: string;
  events: CaseCalendarEventDto[];
}) {
  return (
    <TooltipContent
      className="w-72 rounded-xl border border-border/50 bg-popover px-3 py-2.5 text-left font-normal leading-normal text-popover-foreground shadow-[0_14px_34px_-20px_rgba(15,23,42,0.42)] [&_svg]:fill-popover"
      side="top"
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
                  {event.amount ? formatCaseMoney(event.amount) : "Sin monto"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {event.status === "overdue" ? "Vencido" : "Pendiente"}
                </span>
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">Audiencia</span>
            )}
          </span>
        ))}
      </span>
    </TooltipContent>
  );
}

function formatCalendarDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`)
  );
}
