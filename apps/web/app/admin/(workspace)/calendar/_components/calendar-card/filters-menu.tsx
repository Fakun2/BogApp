"use client";

import { useState } from "react";
import { BriefcaseBusiness, CalendarClock } from "lucide-react";
import {
  AdminTableFilterClearItem,
  AdminTableFilterMenu
} from "../../../_components/admin-table-filter-menu";
import {
  CasePickerField,
  type CasePickerOption
} from "../../../cases/_components/case-picker-field";
import {
  calendarEventTypeLabels,
  defaultCalendarEventTypes,
  type CalendarEventType
} from "../../_constants/calendar.constants";

export function CalendarFiltersMenu({
  disabled,
  onClearCase,
  onClearTypes,
  onSelectCase,
  onToggleType,
  selectedCase,
  visibleTypes
}: {
  disabled?: boolean;
  onClearCase: () => void;
  onClearTypes: () => void;
  onSelectCase: (caseItem: CasePickerOption) => void;
  onToggleType: (type: CalendarEventType, checked: boolean) => void;
  selectedCase: CasePickerOption | null;
  visibleTypes: CalendarEventType[];
}) {
  const [casePickerOpen, setCasePickerOpen] = useState(false);
  const hasCaseFilter = Boolean(selectedCase);
  const hasTypeFilters = visibleTypes.length !== defaultCalendarEventTypes.length;
  const hasActiveFilters = hasCaseFilter || hasTypeFilters;

  function clearAllFilters() {
    onClearCase();
    onClearTypes();
  }

  return (
    <>
      <AdminTableFilterMenu
        active={hasActiveFilters}
        className="w-80"
        disabled={disabled}
        label="Filtros"
        sections={[
          {
            icon: BriefcaseBusiness,
            label: "Expediente",
            options: [
              {
                active: !hasCaseFilter,
                label: "Todos los expedientes",
                onSelect: onClearCase
              },
              {
                active: hasCaseFilter,
                label: selectedCase?.caseNumber ?? "Elegir expediente",
                valueLabel: selectedCase?.caption ?? "Buscar",
                onSelect: () => setCasePickerOpen(true)
              }
            ]
          },
          {
            icon: CalendarClock,
            label: "Eventos",
            options: [
              {
                active: !hasTypeFilters,
                label: "Todos los eventos",
                onSelect: onClearTypes
              },
              ...defaultCalendarEventTypes.map((type) => ({
                checked: visibleTypes.includes(type),
                label: calendarEventTypeLabels[type],
                multiple: true,
                onCheckedChange: (checked: boolean) => onToggleType(type, checked)
              }))
            ]
          }
        ]}
        footer={
          <AdminTableFilterClearItem
            disabled={disabled || !hasActiveFilters}
            onClear={clearAllFilters}
          />
        }
      />
      <CasePickerField
        buttonClassName="hidden"
        disabled={disabled}
        label="Filtrar por expediente"
        open={casePickerOpen}
        selectedCase={selectedCase}
        onOpenChange={setCasePickerOpen}
        onSelect={onSelectCase}
      />
    </>
  );
}
