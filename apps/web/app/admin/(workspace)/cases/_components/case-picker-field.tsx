"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SearchHighlight } from "../../_components/search-highlight";
import { casesQueries } from "../_api/cases.query-controller";
import { useCasesQuery } from "../_hooks/use-cases-query";
import type { CasePickerOptionDto, CasePickerOptionsQueryParams } from "../_types/cases.types";

export type CasePickerOption = CasePickerOptionDto;

const casePickerPageSize = 8;
const casePickerSearchDebounceMs = 300;

export function CasePickerField({
  buttonClassName,
  disabled,
  label = "Expediente",
  onOpenChange,
  onSelect,
  open,
  placeholder = "Seleccionar expediente",
  selectedCase
}: {
  buttonClassName?: string;
  disabled?: boolean;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  onSelect: (caseItem: CasePickerOption) => void;
  open?: boolean;
  placeholder?: string;
  selectedCase?: CasePickerOption | null;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogOpen = open ?? uncontrolledOpen;
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const cursor = cursorStack.at(-1) || undefined;
  const pageIndex = cursorStack.length - 1;
  const queryParams = useMemo<CasePickerOptionsQueryParams>(
    () => ({
      cursor,
      limit: casePickerPageSize,
      offset: pageIndex * casePickerPageSize,
      search: search || undefined
    }),
    [cursor, pageIndex, search]
  );
  const casesQuery = useCasesQuery({
    ...casesQueries.pickerOptions(queryParams),
    enabled: dialogOpen
  });
  const cases = casesQuery.data?.items ?? [];
  const pageInfo = casesQuery.data?.pageInfo;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setCursorStack([""]);
    }, casePickerSearchDebounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    if (dialogOpen) {
      setSearchInput("");
      setSearch("");
      setCursorStack([""]);
    }
  }, [dialogOpen]);

  function setDialogOpen(nextOpen: boolean) {
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function selectCase(caseItem: CasePickerOption) {
    onSelect({
      caption: caseItem.caption,
      caseNumber: caseItem.caseNumber,
      id: caseItem.id,
      subject: caseItem.subject
    });
    setDialogOpen(false);
  }

  function goForward() {
    const nextCursor = pageInfo?.nextCursor;
    if (nextCursor) {
      setCursorStack((currentStack) => [...currentStack, nextCursor]);
    }
  }

  function goBack() {
    setCursorStack((currentStack) => currentStack.slice(0, -1));
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-10 w-full min-w-0 max-w-full justify-start gap-2 overflow-hidden rounded-xl border-border/50 px-3 text-left",
          buttonClassName
        )}
        disabled={disabled}
        onClick={() => setDialogOpen(true)}
      >
        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 flex-1 overflow-hidden truncate">
          {selectedCase ? `${selectedCase.caseNumber} - ${selectedCase.caption}` : placeholder}
        </span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="grid max-h-[min(680px,calc(100svh-2rem))] max-w-2xl grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-3 overflow-hidden p-0">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>Busca y selecciona un expediente del estudio.</DialogDescription>
          </DialogHeader>

          <div className="px-5">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Input
                autoComplete="off"
                type="text"
                className="h-8 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                placeholder="Buscar por numero, caratula o asunto"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto px-5">
            {casesQuery.isLoading || casesQuery.isFetching ? (
              <div className="grid gap-2 py-1">
                {Array.from({ length: casePickerPageSize }).map((_, index) => (
                  <Skeleton className="h-14 rounded-xl" key={index} />
                ))}
              </div>
            ) : casesQuery.error ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {casesQuery.error.message}
              </div>
            ) : cases.length ? (
              <div className="grid gap-1 py-1">
                {cases.map((caseItem) => (
                  <button
                    type="button"
                    className={cn(
                      "grid min-w-0 gap-0.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                      selectedCase?.id === caseItem.id ? "bg-secondary text-foreground" : ""
                    )}
                    key={caseItem.id}
                    onClick={() => selectCase(caseItem)}
                  >
                    <span className="truncate text-sm font-medium text-foreground">
                      <SearchHighlight query={search} text={caseItem.caseNumber} />
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      <SearchHighlight query={search} text={caseItem.caption} />
                    </span>
                    {caseItem.subject ? (
                      <span className="truncate text-[11px] text-muted-foreground">
                        <SearchHighlight query={search} text={caseItem.subject} />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/40 bg-background/45 px-4 py-6 text-center text-sm text-muted-foreground">
                No se encontraron expedientes.
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-border/30 px-5 py-3">
            <span className="text-xs text-muted-foreground">Pagina {pageIndex + 1}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-xl border-border/50 px-3"
                disabled={pageIndex === 0 || casesQuery.isFetching}
                onClick={goBack}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-xl border-border/50 px-3"
                disabled={!pageInfo?.hasNextPage || !pageInfo.nextCursor || casesQuery.isFetching}
                onClick={goForward}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </footer>
        </DialogContent>
      </Dialog>
    </>
  );
}
