import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";

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
        className="h-11 border-border/50 px-3 text-sm sm:px-4"
        disabled={!hasActiveFilters && !hasDraftFilters}
        onClick={onReset}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Limpiar</span>
      </Button>
      <Button
        type="button"
        className={`h-11 px-3 text-sm sm:px-4 ${adminPrimaryActionButtonClassName}`}
        disabled={disabled}
        onClick={onApply}
      >
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </div>
  );
}
