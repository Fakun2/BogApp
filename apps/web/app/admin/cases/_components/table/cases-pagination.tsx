"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  appendCursor,
  removeLastCursor,
  serializeCursorStack
} from "../../_utils/case-pagination";

export function CasesPagination({
  cursorStack,
  hasNextPage,
  nextCursor,
  pageIndex,
  pageRowsLength
}: {
  cursorStack: string[];
  hasNextPage: boolean;
  nextCursor: string | null;
  pageIndex: number;
  pageRowsLength: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(nextStack: string[]) {
    const nextParams = new URLSearchParams(searchParams.toString());
    const cursor = nextStack.at(-1);

    if (cursor) {
      nextParams.set("cursor", cursor);
    } else {
      nextParams.delete("cursor");
    }

    if (nextStack.length) {
      nextParams.set("cursorStack", serializeCursorStack(nextStack));
    } else {
      nextParams.delete("cursorStack");
    }

    router.push(`${pathname}?${nextParams.toString()}`);
  }

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-t border-border/40 px-1">
      <p className="text-xs text-muted-foreground">
        {pageRowsLength === 0 ? "0 resultados" : `${pageRowsLength} resultados en esta pagina`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-lg border-border/50 px-2.5"
          disabled={pageIndex === 0}
          onClick={() => navigate(removeLastCursor(cursorStack))}
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="min-w-16 text-center text-xs text-muted-foreground">
          Pagina {pageIndex + 1}
        </span>
        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-lg border-border/50 px-2.5"
          disabled={!hasNextPage || !nextCursor}
          onClick={() => {
            if (nextCursor) {
              navigate(appendCursor(cursorStack, nextCursor));
            }
          }}
          aria-label="Pagina siguiente"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
