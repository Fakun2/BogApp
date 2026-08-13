import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  RotateCcw,
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  calendarViewLabels,
  type CalendarEventType,
  type CalendarView
} from "./constants";
import { CalendarEventFilter } from "./event-filter";

export function CalendarToolbar({
  actions,
  eventCount,
  monthLabel,
  onGoToday,
  onNavigate,
  onSearch,
  onToggleType,
  onViewChange,
  searchQuery,
  view,
  visibleTypes
}: {
  actions?: ReactNode;
  eventCount: number;
  monthLabel: string;
  onGoToday: () => void;
  onNavigate: (direction: -1 | 1) => void;
  onSearch: (value: string) => void;
  onToggleType: (type: CalendarEventType, checked: boolean) => void;
  onViewChange: (view: CalendarView) => void;
  searchQuery: string;
  view: CalendarView;
  visibleTypes: CalendarEventType[];
}) {
  return (
    <header className="grid gap-3 px-4 py-3 md:px-5">
      <section className="flex flex-row items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold text-foreground">
          <CalendarDays className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
          <span className="truncate capitalize">{monthLabel}</span>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              eventCount > 0
                ? "bg-red-500 text-white"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {eventCount}
          </span>
        </h2>
        <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Acciones del calendario">
          {actions}
          <CalendarViewSwitch onViewChange={onViewChange} view={view} />
          <CalendarEventFilter onToggleType={onToggleType} visibleTypes={visibleTypes} />
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 rounded-xl border-border/50 p-0"
            onClick={() => onNavigate(-1)}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hidden h-8 rounded-xl border-border/50 px-3 text-xs sm:inline-flex"
            onClick={onGoToday}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Hoy
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 rounded-xl border-border/50 p-0"
            onClick={() => onNavigate(1)}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </section>
      <section className="relative" aria-label="Buscar eventos del calendario">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="h-9 rounded-xl border-border/50 bg-card pl-9 pr-9 text-sm"
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Buscar gastos o audiencias..."
          value={searchQuery}
        />
        {searchQuery ? (
          <Button
            type="button"
            variant="outline"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg p-0"
            onClick={() => onSearch("")}
            aria-label="Limpiar busqueda"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
      </section>
    </header>
  );
}

function CalendarViewSwitch({
  onViewChange,
  view
}: {
  onViewChange: (view: CalendarView) => void;
  view: CalendarView;
}) {
  const viewIcons = {
    list: List,
    month: CalendarDays
  };

  return (
    <section
      className="hidden rounded-xl border border-border/50 bg-card p-0.5 sm:flex"
      aria-label="Vista del calendario"
    >
      {Object.entries(calendarViewLabels).map(([value, label]) => {
        const Icon = viewIcons[value as CalendarView];

        return (
          <button
            type="button"
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground",
              view === value && "bg-secondary text-foreground"
            )}
            key={value}
            onClick={() => onViewChange(value as CalendarView)}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </section>
  );
}
