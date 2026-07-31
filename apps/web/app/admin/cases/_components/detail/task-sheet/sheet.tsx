"use client";

import { Loader2, ListTodo, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminPrimaryActionButtonClassName } from "../../../../_constants/dashboard";
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
import type { CaseTaskFormValues } from "@/lib/validation/cases";
import {
  caseInputClassName,
  caseSelectTriggerClassName,
  caseTextareaClassName
} from "../../../_constants/cases.constants";
import { CaseField } from "../../sheet/case-field";
import { caseTaskStatusOptions, unassignedTaskAssigneeValue } from "./constants";
import type { CaseTaskSheetProps } from "./types";
import { useCaseTaskSheet } from "./use-sheet";

export function CaseTaskSheet({
  assignees = [],
  caseId,
  onOpenChange,
  open: controlledOpen,
  task,
  trigger
}: CaseTaskSheetProps) {
  const { draft, errors, handleSubmit, mutation, open, setOpen, updateDraft } = useCaseTaskSheet({
    caseId,
    onOpenChange,
    open: controlledOpen,
    task
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent className="w-[560px] max-w-[94vw] overflow-hidden border-border bg-card sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-btn-primary text-btn-primary-foreground">
              <ListTodo className="h-4 w-4" aria-hidden="true" />
            </span>
            {task ? "Editar tarea" : "Nueva tarea"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Formulario para cargar o actualizar una tarea del expediente.
          </SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 pb-1">
            <CaseField error={errors.name} label="Nombre" required>
              <Input
                autoComplete="off"
                className={caseInputClassName}
                placeholder="Presentar escrito"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
              />
            </CaseField>

            <CaseField error={errors.assignedMembershipId} label="Asignado a">
              <Select
                value={draft.assignedMembershipId || unassignedTaskAssigneeValue}
                onValueChange={(value) =>
                  updateDraft(
                    "assignedMembershipId",
                    value === unassignedTaskAssigneeValue ? "" : value
                  )
                }
              >
                <SelectTrigger className={caseSelectTriggerClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={unassignedTaskAssigneeValue}>Sin asignar</SelectItem>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id}>
                      {assignee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CaseField>

            <div className="grid gap-4 md:grid-cols-2">
              <CaseField error={errors.startDate} label="Fecha de inicio">
                <Input
                  className={caseInputClassName}
                  type="date"
                  value={draft.startDate ?? ""}
                  onChange={(event) => updateDraft("startDate", event.target.value)}
                />
              </CaseField>
              <CaseField error={errors.endDate} label="Fecha de finalizacion">
                <Input
                  className={caseInputClassName}
                  type="date"
                  value={draft.endDate ?? ""}
                  onChange={(event) => updateDraft("endDate", event.target.value)}
                />
              </CaseField>
            </div>

            <CaseField label="Estado">
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  updateDraft("status", value as CaseTaskFormValues["status"])
                }
              >
                <SelectTrigger className={caseSelectTriggerClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {caseTaskStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CaseField>

            <CaseField label="Observaciones">
              <Textarea
                className={`min-h-32 ${caseTextareaClassName}`}
                placeholder="Notas de seguimiento"
                value={draft.notes ?? ""}
                onChange={(event) => updateDraft("notes", event.target.value)}
              />
            </CaseField>

            {mutation.error ? (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {mutation.error.message}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-border/30 p-4">
            <Button
              type="button"
              variant="outline"
              className="px-3 sm:px-4"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
            <Button
              type="submit"
              className={`px-3 sm:px-4 ${adminPrimaryActionButtonClassName}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">Guardar</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
