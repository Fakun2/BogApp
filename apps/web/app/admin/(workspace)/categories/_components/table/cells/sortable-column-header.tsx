import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  CategorySortDirection,
  CategorySortKey
} from "../../../_types/categories.types";

export function SortableColumnHeader({
  active,
  direction,
  label,
  onClick
}: {
  active: boolean;
  direction: CategorySortDirection;
  label: string;
  onClick: () => void;
}) {
  const Icon = direction === "asc" ? ArrowDownAZ : ArrowUpAZ;

  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-2 h-8 px-2 text-sm font-medium text-foreground hover:bg-secondary/70"
      onClick={onClick}
    >
      {label}
      {active ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
    </Button>
  );
}

export function isCategorySortKey(columnId: string): columnId is CategorySortKey {
  return columnId === "active" || columnId === "kind" || columnId === "name" || columnId === "origin";
}
