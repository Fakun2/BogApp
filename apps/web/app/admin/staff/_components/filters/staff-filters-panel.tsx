import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { StaffFilters, StaffListResponse } from "../../_types/staff.types";
import { filterControlClassName } from "../../_utils/staff-format";
import { FilterField } from "./filter-field";
import { StaffFilterActions } from "./staff-filter-actions";
import { StaffSelectFilter } from "./staff-select-filter";

export function StaffFiltersPanel({
  disabled,
  filters,
  hasActiveFilters,
  hasDraftFilters,
  surface = "card",
  staffData,
  onApply,
  onReset,
  onUpdateFilter
}: {
  disabled: boolean;
  filters: StaffFilters;
  hasActiveFilters: boolean;
  hasDraftFilters: boolean;
  surface?: "card" | "plain";
  staffData: StaffListResponse | undefined;
  onApply: () => void;
  onReset: () => void;
  onUpdateFilter: <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => void;
}) {
  const content = (
    <CardContent
      className={
        surface === "card"
          ? "grid gap-3 p-4 xl:grid-cols-[minmax(280px,1fr)_140px_150px_140px_140px_auto] xl:items-end"
          : "grid gap-3 p-0"
      }
    >
      <FilterField className="xl:min-w-0" label="Nombre">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={filters.firstName}
            onChange={(event) => onUpdateFilter("firstName", event.target.value)}
            placeholder="Buscar por nombre..."
            disabled={disabled}
            aria-label="Filtrar por nombre"
            className={filterControlClassName("pl-9")}
          />
        </div>
      </FilterField>

      <FilterField label="Apellido">
        <Input
          value={filters.lastName}
          onChange={(event) => onUpdateFilter("lastName", event.target.value)}
          placeholder="Apellido"
          disabled={disabled}
          aria-label="Filtrar por apellido"
          className={filterControlClassName()}
        />
      </FilterField>

      <StaffSelectFilter
        disabled={disabled}
        label="Area"
        value={filters.practiceAreaId}
        onValueChange={(value) => onUpdateFilter("practiceAreaId", value)}
        options={(staffData?.filterOptions.practiceAreas ?? []).map((area) => ({
          label: area.name,
          value: area.id
        }))}
      />

      <StaffSelectFilter
        disabled={disabled}
        label="Rol"
        value={filters.role}
        onValueChange={(value) => onUpdateFilter("role", value)}
        options={(staffData?.filterOptions.roles ?? []).map((role) => ({
          label: role.name,
          value: role.code
        }))}
      />

      <StaffSelectFilter
        disabled={disabled}
        label="Estado"
        value={filters.status}
        onValueChange={(value) => onUpdateFilter("status", value)}
        options={(staffData?.filterOptions.statuses ?? []).map((status) => ({
          label: status.label,
          value: status.value
        }))}
      />

      <StaffFilterActions
        disabled={disabled}
        hasActiveFilters={hasActiveFilters}
        hasDraftFilters={hasDraftFilters}
        onApply={onApply}
        onReset={onReset}
      />
    </CardContent>
  );

  if (surface === "plain") {
    return content;
  }

  return (
    <Card
      data-admin-surface
      className="border border-border/50 bg-card text-card-foreground shadow-[var(--admin-card-shadow)]"
    >
      {content}
    </Card>
  );
}
