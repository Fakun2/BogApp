"use client";

import { useState } from "react";
import { Banknote, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { CaseExpenseFormValues } from "@/lib/validation/cases";
import {
  caseInputClassName,
  caseSelectTriggerClassName,
  caseTextareaClassName
} from "../../../_constants/cases.constants";
import { CaseField } from "../../sheet/case-field";
import { CaseExpenseAttachmentsPopup } from "../case-expense-attachments-popup";
import { caseExpenseStatusOptions, noCaseExpenseTaskValue } from "./case-expense-sheet.constants";
import type { CaseExpenseSheetProps } from "./case-expense-sheet.types";
import { useCaseExpenseSheet } from "./use-case-expense-sheet";

export function CaseExpenseSheet({
  caseId,
  defaultTaskId,
  expense,
  hideTaskSelect = false,
  onOpenChange,
  open: controlledOpen,
  tasks,
  trigger
}: CaseExpenseSheetProps) {
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const {
    amountText,
    draft,
    errors,
    handleSubmit,
    mutation,
    open,
    setOpen,
    updateAmount,
    updateDraft
  } = useCaseExpenseSheet({
    caseId,
    defaultTaskId,
    expense,
    hideTaskSelect,
    onOpenChange,
    open: controlledOpen
  });

  return (
    <>
      <Sheet modal={!attachmentsOpen} open={open} onOpenChange={setOpen}>
        {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
        <SheetContent className="w-[560px] max-w-[94vw] overflow-hidden border-border bg-card sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-lg">
              <span className="flex size-9 items-center justify-center rounded-xl bg-btn-primary text-btn-primary-foreground">
                <Banknote className="h-4 w-4" aria-hidden="true" />
              </span>
              {expense ? "Editar gasto" : "Nuevo gasto"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Formulario para cargar o actualizar un gasto asociado al expediente.
            </SheetDescription>
          </SheetHeader>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 pb-1">
            <CaseField error={errors.concept} label="Concepto" required>
              <Input
                autoComplete="off"
                className={caseInputClassName}
                placeholder="Tasa judicial"
                value={draft.concept}
                onChange={(event) => updateDraft("concept", event.target.value)}
              />
            </CaseField>

            <div className="grid gap-4 md:grid-cols-2">
              <CaseField error={errors.amount} label="Monto" required>
                <Input
                  autoComplete="off"
                  className={caseInputClassName}
                  inputMode="decimal"
                  placeholder="12.500,50"
                  type="text"
                  value={amountText}
                  onChange={(event) => updateAmount(event.target.value)}
                />
              </CaseField>
              <CaseField error={errors.expenseDate} label="Fecha de emision" required>
                <Input
                  className={caseInputClassName}
                  type="date"
                  value={draft.expenseDate}
                  onChange={(event) => updateDraft("expenseDate", event.target.value)}
                />
              </CaseField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <CaseField error={errors.paymentDate} label="Fecha de pago" required>
                <Input
                  className={caseInputClassName}
                  type="date"
                  value={draft.paymentDate}
                  onChange={(event) => updateDraft("paymentDate", event.target.value)}
                />
              </CaseField>
              <CaseField label="Estado" required>
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    updateDraft("status", value as CaseExpenseFormValues["status"])
                  }
                >
                  <SelectTrigger className={caseSelectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {caseExpenseStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CaseField>
            </div>

            {!hideTaskSelect ? (
              <div className="grid gap-4 md:grid-cols-2">
                <CaseField label="Tarea asociada">
                  <Select
                    value={draft.taskId || noCaseExpenseTaskValue}
                    onValueChange={(value) =>
                      updateDraft("taskId", value === noCaseExpenseTaskValue ? "" : value)
                    }
                  >
                    <SelectTrigger className={caseSelectTriggerClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={noCaseExpenseTaskValue}>Sin tarea asociada</SelectItem>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CaseField>
              </div>
            ) : null}

            <div className="rounded-2xl border border-border/40 bg-background/35 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={draft.alertEnabled}
                  className="mt-0.5"
                  onCheckedChange={(checked) => {
                    const enabled = checked === true;
                    updateDraft("alertEnabled", enabled);
                    if (!enabled) {
                      updateDraft("alertDate", "");
                      updateDraft("alertTime", "");
                    }
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Alerta</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Programa un recordatorio interno para revisar este gasto antes o cerca de su
                    pago.
                  </p>
                </div>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  draft.alertEnabled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid gap-4 pt-4 md:grid-cols-2">
                    <CaseField error={errors.alertDate} label="Fecha de alerta" required>
                      <Input
                        className={caseInputClassName}
                        type="date"
                        value={draft.alertDate ?? ""}
                        onChange={(event) => updateDraft("alertDate", event.target.value)}
                      />
                    </CaseField>
                    <CaseField error={errors.alertTime} label="Hora de alerta" required>
                      <Input
                        className={caseInputClassName}
                        type="time"
                        value={draft.alertTime ?? ""}
                        onChange={(event) => updateDraft("alertTime", event.target.value)}
                      />
                    </CaseField>
                  </div>
                </div>
              </div>
            </div>

            <CaseField error={errors.notes} label="Observaciones">
              <Textarea
                className={`min-h-32 ${caseTextareaClassName}`}
                maxLength={100}
                placeholder="Notas del gasto"
                value={draft.notes ?? ""}
                onChange={(event) => updateDraft("notes", event.target.value)}
              />
            </CaseField>

            <div className="rounded-2xl border border-border/40 bg-background/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Comprobantes</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {expense
                      ? "Adjunta comprobantes PDF o imagenes asociados a este gasto."
                      : "Guarda el gasto para poder adjuntar comprobantes."}
                  </p>
                </div>
                {expense ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 shrink-0 gap-2 rounded-xl border-border/50"
                    onClick={() => setAttachmentsOpen(true)}
                  >
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                    Ver
                  </Button>
                ) : null}
              </div>
            </div>

            {mutation.error ? (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {mutation.error.message}
              </p>
            ) : null}
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-border/30 p-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      {expense && attachmentsOpen ? (
        <CaseExpenseAttachmentsPopup
          canUpdate
          caseId={caseId}
          expense={expense}
          onClose={() => setAttachmentsOpen(false)}
        />
      ) : null}
    </>
  );
}
