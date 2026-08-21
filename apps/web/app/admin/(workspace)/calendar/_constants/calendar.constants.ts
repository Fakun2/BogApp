import type { CaseCalendarEventDto } from "../../cases/_types/cases.types";

export type CalendarEventType = CaseCalendarEventDto["type"];
export type CalendarView = "month" | "list";

export const calendarEventTypeLabels: Record<CalendarEventType, string> = {
  hearing: "Audiencias",
  payment_due: "Gastos",
  task_due: "Tareas"
};

export const calendarEventTypeShortLabels: Record<CalendarEventType, string> = {
  hearing: "Audiencia",
  payment_due: "Gasto",
  task_due: "Tarea"
};

export const calendarEventTypeDotClassNames: Record<CalendarEventType, string> = {
  hearing: "bg-amber-500",
  payment_due: "bg-red-500",
  task_due: "bg-sky-500"
};

export const defaultCalendarEventTypes: CalendarEventType[] = [
  "payment_due",
  "hearing",
  "task_due"
];

export const calendarEventListPageSize = 5;

export const calendarPanelClassName = "min-h-[320px]";

export const calendarViewLabels: Record<CalendarView, string> = {
  list: "Lista",
  month: "Mes"
};
