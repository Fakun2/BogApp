import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StaffFilterActions({
  disabled,
  hasActiveFilters,
  hasDraftFilters,
  onApply,
  onReset
}: {
  disabled: boolean;
  hasActiveFilters: boolean;
  hasDraftFilters: boolean;
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-xl border-border/50 px-4 text-sm"
        disabled={!hasActiveFilters && !hasDraftFilters}
        onClick={onReset}
      >
        Limpiar
      </Button>
      <Button type="button" className="h-11 rounded-xl px-4 text-sm" disabled={disabled} onClick={onApply}>
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
        Buscar
      </Button>
    </div>
  );
}
