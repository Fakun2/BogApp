import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type CalendarEventType, type CalendarView } from "../../_constants/calendar.constants";
import type { CasePickerOption } from "../../../cases/_components/case-picker-field";
import { CalendarFiltersMenu } from "./filters-menu";
import { CalendarViewSwitch } from "./view-switch";

export function CalendarToolbar({
  caseFiltersDisabled,
  eventCount,
  monthLabel,
  onClearCaseFilter,
  onGoToday,
  onClearTypes,
  onNavigate,
  onSelectCaseFilter,
  onToggleType,
  onViewChange,
  selectedCase,
  view,
  visibleTypes
}: {
  caseFiltersDisabled?: boolean;
  eventCount: number;
  monthLabel: string;
  onClearCaseFilter?: () => void;
  onClearTypes: () => void;
  onGoToday: () => void;
  onNavigate: (direction: -1 | 1) => void;
  onSelectCaseFilter?: (caseItem: CasePickerOption) => void;
  onToggleType: (type: CalendarEventType, checked: boolean) => void;
  onViewChange: (view: CalendarView) => void;
  selectedCase: CasePickerOption | null;
  view: CalendarView;
  visibleTypes: CalendarEventType[];
}) {
  const canFilterCases = Boolean(onClearCaseFilter && onSelectCaseFilter);

  return (
    <header className="grid gap-3 px-5 py-3 md:px-8">
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
          <CalendarFiltersMenu
            disabled={caseFiltersDisabled}
            onClearCase={onClearCaseFilter ?? (() => undefined)}
            onClearTypes={onClearTypes}
            onSelectCase={onSelectCaseFilter ?? (() => undefined)}
            onToggleType={onToggleType}
            selectedCase={canFilterCases ? selectedCase : null}
            visibleTypes={visibleTypes}
          />
          <CalendarViewSwitch onViewChange={onViewChange} view={view} />
          <Button
            type="button"
            variant="outline"
            className="h-7 w-7 rounded-xl border-border/50 p-0"
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
            className="h-7 w-7 rounded-xl border-border/50 p-0"
            onClick={() => onNavigate(1)}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </section>
    </header>
  );
}
