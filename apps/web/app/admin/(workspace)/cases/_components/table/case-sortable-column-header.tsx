"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseSortDirection, CaseSortKey } from "../../_types/cases.types";

export function CaseSortableColumnHeader({
  active,
  direction,
  label,
  onSort,
  sortKey
}: {
  active: boolean;
  direction: CaseSortDirection;
  label: string;
  onSort: (sortKey: CaseSortKey) => void;
  sortKey: CaseSortKey;
}) {
  const Icon = active ? (direction === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => onSort(sortKey)}
    >
      {label}
      <Icon className={cn("h-3.5 w-3.5", active ? "opacity-100" : "opacity-45")} aria-hidden />
    </button>
  );
}
