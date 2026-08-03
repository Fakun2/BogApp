"use client";

import { ListTodo } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CaseTaskFormValues } from "@/lib/validation/cases";
import {
  caseInputClassName,
  caseSelectTriggerClassName,
  caseTextareaClassName
} from "../../../_constants/cases.constants";
import { CaseActionSheet } from "../case-action-sheet";
import { CaseDateInput } from "../../sheet/case-date-input";
import { CaseField } from "../../sheet/case-field";
import { caseTaskStatusOptions, unassignedTaskAssigneeValue } from "./constants";
import type { CaseTaskSheetProps } from "./types";
import { useCaseTaskSheet } from "./use-sheet";

export function CaseTaskSheet({
  assignees = [],
  caseId,
  defaultDate,
  onOpenChange,
  open: controlledOpen,
  task,
  trigger
}: CaseTaskSheetProps) {
  const { draft, errors, handleSubmit, mutation, open, setOpen, updateDraft } = useCaseTaskSheet({
    caseId,
    defaultDate,
    onOpenChange,
    open: controlledOpen,
    task
  });

  return (
    <CaseActionSheet
      description="Formulario para cargar o actualizar una tarea del expediente."
      errorMessage={mutation.error?.message}
      icon={ListTodo}
      isSubmitting={mutation.isPending}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      open={open}
      title={task ? "Editar tarea" : "Nueva tarea"}
      trigger={trigger}
    >
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
            updateDraft("assignedMembershipId", value === unassignedTaskAssigneeValue ? "" : value)
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
          <CaseDateInput
            autoComplete="off"
            value={draft.startDate ?? ""}
            onChange={(event) => updateDraft("startDate", event.target.value)}
          />
        </CaseField>
        <CaseField error={errors.endDate} label="Fecha de finalizacion">
          <CaseDateInput
            autoComplete="off"
            value={draft.endDate ?? ""}
            onChange={(event) => updateDraft("endDate", event.target.value)}
          />
        </CaseField>
      </div>

      <CaseField label="Estado">
        <Select
          value={draft.status}
          onValueChange={(value) => updateDraft("status", value as CaseTaskFormValues["status"])}
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
    </CaseActionSheet>
  );
}
