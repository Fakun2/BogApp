import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export type RoleStatusFilter = "all" | "active" | "inactive";

export function RolesFilters({
  disabled,
  name,
  status,
  onNameChange,
  onStatusChange
}: {
  disabled: boolean;
  name: string;
  status: RoleStatusFilter;
  onNameChange: (value: string) => void;
  onStatusChange: (value: RoleStatusFilter) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px]">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Filtrar por nombre..."
          disabled={disabled}
          aria-label="Filtrar roles por nombre"
          className="h-11 rounded-2xl border-border/35 bg-card pl-9"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as RoleStatusFilter)}>
        <SelectTrigger
          disabled={disabled}
          className="h-11 rounded-2xl border-border/35 bg-card"
          aria-label="Filtrar roles por estado"
        >
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
