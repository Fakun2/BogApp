import { ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AdminTableHeaderActionButton } from "../../../../_components/admin-table-header-action-button";
import {
  calendarEventTypeLabels,
  defaultCalendarEventTypes,
  type CalendarEventType
} from "./constants";

export function CalendarEventFilter({
  onToggleType,
  visibleTypes
}: {
  onToggleType: (type: CalendarEventType, checked: boolean) => void;
  visibleTypes: CalendarEventType[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTableHeaderActionButton
          className="h-8 w-8 rounded-xl sm:h-8 sm:px-3"
          icon={ListFilter}
          label="Filtros"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Mostrar eventos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {defaultCalendarEventTypes.map((type) => (
          <DropdownMenuCheckboxItem
            checked={visibleTypes.includes(type)}
            key={type}
            onCheckedChange={(value) => onToggleType(type, Boolean(value))}
          >
            {calendarEventTypeLabels[type]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

