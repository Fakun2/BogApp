import type { CaseCalendarEventDto } from "../../../_types/cases.types";
import type { CalendarEventType } from "./constants";

export function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function shiftMonth(monthKey: string, offset: number) {
  const { month, year } = parseMonthKey(monthKey);
  const date = new Date(year, month - 1 + offset, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getCalendarDays(monthKey: string) {
  const { month, year } = parseMonthKey(monthKey);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();
  const previousMonthKey = shiftMonth(monthKey, -1);
  const previousMonthDays = new Date(year, month - 1, 0).getDate();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, index) =>
    createCalendarDay(monthKey, index + 1, true)
  );
  const previousMonthCells = Array.from({ length: leadingEmptyDays }, (_, index) =>
    createCalendarDay(
      previousMonthKey,
      previousMonthDays - leadingEmptyDays + index + 1,
      false
    )
  );
  const trailingCellsCount = 42 - previousMonthCells.length - currentMonthDays.length;
  const nextMonthKey = shiftMonth(monthKey, 1);
  const nextMonthCells = Array.from({ length: trailingCellsCount }, (_, index) =>
    createCalendarDay(nextMonthKey, index + 1, false)
  );

  return [...previousMonthCells, ...currentMonthDays, ...nextMonthCells];
}

export function getMonthLabel(monthKey: string) {
  const { month, year } = parseMonthKey(monthKey);

  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric"
  }).format(new Date(year, month - 1, 1));
}

function parseMonthKey(monthKey: string) {
  const [yearValue = "", monthValue = ""] = monthKey.split("-");

  return {
    month: Number(monthValue),
    year: Number(yearValue)
  };
}

function createCalendarDay(monthKey: string, day: number, inCurrentMonth: boolean) {
  return {
    date: `${monthKey}-${String(day).padStart(2, "0")}`,
    day,
    inCurrentMonth
  };
}

export function groupEventsByDate(events: CaseCalendarEventDto[]) {
  return events.reduce<Record<string, CaseCalendarEventDto[]>>((accumulator, event) => {
    accumulator[event.date] = [...(accumulator[event.date] ?? []), event];

    return accumulator;
  }, {});
}

export function filterCalendarEvents(
  events: CaseCalendarEventDto[],
  visibleTypes: CalendarEventType[],
  searchQuery = ""
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return events
    .filter((event) => visibleTypes.includes(event.type))
    .filter((event) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        event.title,
        event.date,
        event.status ?? "",
        event.type
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    })
    .sort((firstEvent, secondEvent) => firstEvent.date.localeCompare(secondEvent.date));
}
