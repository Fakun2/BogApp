import { CalendarDays, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { calendarViewLabels, type CalendarView } from "./constants";

export function CalendarViewSwitch({
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
