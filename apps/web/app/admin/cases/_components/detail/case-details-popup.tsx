"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseDetailDto } from "../../_types/cases.types";
import { CaseDetailsDialog } from "./case-details-dialog";

export function CaseDetailsPopup({ caseItem }: { caseItem: CaseDetailDto }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-6 w-6 shrink-0 border-transparent bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
        onClick={() => setOpen(true)}
        aria-label="Ver detalles judiciales del expediente"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      {open ? <CaseDetailsDialog caseItem={caseItem} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
