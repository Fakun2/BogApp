"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseSortDirection, CaseSortKey } from "../../_types/cases.types";
import { getNextCaseSortDirection } from "../../_utils/case-sorting";

export function CaseSortableColumnHeader({
  active,
  direction,
  label,
  sortKey
}: {
  active: boolean;
  direction: CaseSortDirection;
  label: string;
  sortKey: CaseSortKey;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const Icon = active ? (direction === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;

  function updateSort() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("sortBy", sortKey);
    nextParams.set(
      "sortDirection",
      getNextCaseSortDirection({ active, currentDirection: direction })
    );
    nextParams.delete("cursor");
    nextParams.delete("cursorStack");

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={updateSort}
    >
      {label}
      <Icon className={cn("h-3.5 w-3.5", active ? "opacity-100" : "opacity-45")} aria-hidden />
    </button>
  );
}
