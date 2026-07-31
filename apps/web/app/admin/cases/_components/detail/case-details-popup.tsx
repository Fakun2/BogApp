"use client";

import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { caseInstanceLabels, caseStatusLabels } from "../../_constants/cases.constants";
import type { CaseDetailDto } from "../../_types/cases.types";
import { formatCaseDate } from "./case-detail-format";

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

function CaseDetailsDialog({
  caseItem,
  onClose
}: {
  caseItem: CaseDetailDto;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  }

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-200 ease-out sm:p-4 ${
        isClosing || !isVisible ? "opacity-0 backdrop-blur-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Detalles del expediente"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <article
        data-admin-surface
        className={`flex max-h-[84svh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--admin-card-shadow)] transition-[opacity,transform] duration-200 ease-out ${
          isClosing || !isVisible
            ? "translate-y-2 scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/30 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
              Detalles del expediente
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
              {caseItem.caption}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">{caseItem.caseNumber}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 shrink-0 border-border/50 p-0"
            onClick={requestClose}
            aria-label="Cerrar detalles del expediente"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <section className="grid gap-4 md:grid-cols-2" aria-label="Informacion principal">
            <DetailItem label="Caratula" value={caseItem.caption} />
            <DetailItem label="Numero de expediente" value={caseItem.caseNumber} />
            <DetailItem label="Provincia" value={caseItem.province.name} />
            <DetailItem label="Fuero" value={caseItem.forum.name} />
            <DetailItem
              label="Centro judicial"
              value={caseItem.judicialCenter?.name ?? caseItem.judicialCenterText}
            />
            <DetailItem label="Juzgado / Tribunal" value={caseItem.court} />
            <DetailItem label="Instancia" value={caseInstanceLabels[caseItem.instance]} />
            <DetailItem label="Estado" value={caseStatusLabels[caseItem.status]} />
            <DetailItem label="Fecha de ingreso" value={formatCaseDate(caseItem.filingDate)} />
            <DetailItem label="Asunto" value={caseItem.subject} />
            <DetailItem
              className="md:col-span-2"
              label="Descripcion"
              value={caseItem.description}
              multiline
            />
          </section>

          <section className="mt-5 grid gap-3" aria-label="Sujetos procesales">
            <h3 className="text-sm font-semibold text-foreground">Sujetos procesales</h3>
            {caseItem.participants.length ? (
              <ul className="grid gap-2">
                {caseItem.participants.map((participant, index) => (
                  <li
                    className="grid gap-2 rounded-xl border border-border/40 bg-background/35 px-4 py-3 md:grid-cols-[1fr_auto]"
                    key={participant.id ?? `${participant.displayName}-${index}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {participant.displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {participant.document || "Documento sin cargar"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {participant.email || participant.phone || "Contacto sin cargar"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border/50 px-4 py-6 text-center text-sm text-muted-foreground">
                Todavia no hay sujetos procesales cargados.
              </p>
            )}
          </section>
        </main>
      </article>
    </section>
  );
}

function DetailItem({
  className = "",
  label,
  multiline = false,
  value
}: {
  className?: string;
  label: string;
  multiline?: boolean;
  value: string | null | undefined;
}) {
  return (
    <div className={`min-w-0 rounded-xl border border-border/40 bg-background/35 px-4 py-3 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-foreground ${
          multiline ? "whitespace-pre-wrap leading-6" : "truncate"
        }`}
      >
        {value || "Sin cargar"}
      </p>
    </div>
  );
}
