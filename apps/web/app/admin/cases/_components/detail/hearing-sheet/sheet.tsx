"use client";

import { Bell, CalendarPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CaseHearingFormValues } from "@/lib/validation/cases";
import {
  caseNativeDateTimeInputClassName,
  caseSelectTriggerClassName,
  caseTextareaClassName
} from "../../../_constants/cases.constants";
import { CaseActionSheet } from "../case-action-sheet";
import { CaseDateInput } from "../../sheet/case-date-input";
import { CaseField } from "../../sheet/case-field";
import { caseHearingTypeOptions } from "./constants";
import type { CaseHearingSheetProps } from "./types";
import { useCaseHearingSheet } from "./use-sheet";

export function CaseHearingSheet({
  caseId,
  defaultDate,
  hearing,
  onOpenChange,
  open: controlledOpen,
  trigger
}: CaseHearingSheetProps) {
  const { draft, errors, handleSubmit, mutation, open, setOpen, updateDraft } = useCaseHearingSheet(
    {
      caseId,
      defaultDate,
      hearing,
      onOpenChange,
      open: controlledOpen
    }
  );

  return (
    <CaseActionSheet
      description="Formulario para cargar o actualizar una audiencia del expediente."
      errorMessage={mutation.error?.message}
      icon={CalendarPlus}
      isSubmitting={mutation.isPending}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      open={open}
      title={hearing ? "Editar audiencia" : "Nueva audiencia"}
      trigger={trigger}
      widthClassName="w-[760px] max-w-[94vw] sm:max-w-[760px]"
    >
      <CaseField error={errors.type} label="Tipo de audiencia" required>
        <Select
          value={draft.type}
          onValueChange={(value) => updateDraft("type", value as CaseHearingFormValues["type"])}
        >
          <SelectTrigger className={caseSelectTriggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {caseHearingTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CaseField>

      <div className="grid gap-4 md:grid-cols-2">
        <CaseField error={errors.date} label="Fecha" required>
          <CaseDateInput
            autoComplete="off"
            value={draft.date}
            onChange={(event) => updateDraft("date", event.target.value)}
          />
        </CaseField>
        <CaseField error={errors.time} label="Hora" required>
          <Input
            autoComplete="off"
            className={caseNativeDateTimeInputClassName}
            type="time"
            value={draft.time}
            onChange={(event) => updateDraft("time", event.target.value)}
          />
        </CaseField>
      </div>

      <CaseField error={errors.description} label="Descripcion" required>
        <Textarea
          className={`min-h-32 ${caseTextareaClassName}`}
          placeholder="Detalle breve de la audiencia"
          value={draft.description}
          onChange={(event) => updateDraft("description", event.target.value)}
        />
      </CaseField>

      <label className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card px-4 py-3 text-sm">
        <Checkbox
          checked={draft.notificationsEnabled}
          onCheckedChange={(checked) => updateDraft("notificationsEnabled", checked === true)}
        />
        <span className="flex items-center gap-2 text-foreground">
          <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Activar notificaciones
        </span>
      </label>
    </CaseActionSheet>
  );
}
