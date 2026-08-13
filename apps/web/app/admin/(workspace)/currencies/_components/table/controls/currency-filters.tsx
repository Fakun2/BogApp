import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CurrencyStatusFilter } from "../../../_types/currencies.types";

export function CurrencyFilters({
  search,
  status,
  onSearchChange,
  onStatusChange
}: {
  search: string;
  status: CurrencyStatusFilter;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: CurrencyStatusFilter) => void;
}) {
  return (
    <>
      <div className="relative hidden min-w-52 sm:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Buscar monedas del estudio"
          className="h-10 rounded-md border-border/40 bg-card pl-9"
          placeholder="Buscar moneda"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <select
        aria-label="Filtrar monedas por estado"
        className="h-10 rounded-md border border-border/40 bg-card px-3 text-sm text-foreground shadow-none outline-none focus:border-ring/50 focus:ring-2 focus:ring-ring/10"
        value={status}
        onChange={(event) => onStatusChange(event.target.value as CurrencyStatusFilter)}
      >
        <option value="all">Todas</option>
        <option value="active">Activas</option>
        <option value="inactive">Inactivas</option>
      </select>
    </>
  );
}
