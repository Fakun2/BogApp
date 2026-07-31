import type { CaseCalendarEventDto } from "../../../_types/cases.types";
import { CalendarDay } from "./calendar-day";
import { calendarPanelClassName } from "./constants";
import { getCalendarDays, groupEventsByDate } from "./date-utils";

const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

export function CalendarMonthGrid({
  events,
  isFetching,
  month
}: {
  events: CaseCalendarEventDto[];
  isFetching: boolean;
  month: string;
}) {
  const days = getCalendarDays(month);
  const eventsByDate = groupEventsByDate(events);

  return (
    <section className={`grid gap-2 ${calendarPanelClassName}`} aria-label="Vista mensual del calendario">
      <ol className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {weekDays.map((day, index) => (
          <li className="py-1" key={`${day}-${index}`}>
            {day}
          </li>
        ))}
      </ol>
      <section className="relative" aria-label="Dias del mes">
        <ol className="grid grid-cols-7 overflow-visible rounded-xl border-b border-l border-border/35">
          {days.map((day, index) => (
            <CalendarDay
              date={day.date}
              day={day.day}
              events={eventsByDate[day.date] ?? []}
              inCurrentMonth={day.inCurrentMonth}
              key={`${day.date}-${index}`}
            />
          ))}
        </ol>
        {isFetching ? <CalendarFetchingOverlay /> : null}
      </section>
    </section>
  );
}

function CalendarFetchingOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-xl bg-card/45 backdrop-blur-[1px]"
      aria-hidden="true"
    >
      <span className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted/70">
        <span className="block h-full w-1/3 animate-[calendar-loading_1.1s_ease-in-out_infinite] rounded-full bg-foreground/20" />
      </span>
    </div>
  );
}
