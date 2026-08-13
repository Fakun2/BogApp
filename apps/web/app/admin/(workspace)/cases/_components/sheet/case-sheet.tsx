"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BriefcaseBusiness, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { CaseFormValues } from "@/lib/validation/cases";
import {
  caseInputClassName,
  caseInstanceLabels,
  caseSelectTriggerClassName,
  caseStatusLabels,
  caseTextareaClassName
} from "../../_constants/cases.constants";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";
import { useCaseSheetController } from "../../_hooks/use-case-sheet-controller";
import type { CaseDto } from "../../_types/cases.types";
import {
  getForumPlaceholder,
  getJudicialCenterPlaceholder,
  mapRecordToOptions
} from "../../_utils/case-options";
import { CaseDateInput } from "./case-date-input";
import { CaseField } from "./case-field";
import { CaseParticipantsSection } from "./case-participants-section";

const caseInstanceOptions = mapRecordToOptions(caseInstanceLabels);
const caseStatusOptions = mapRecordToOptions(caseStatusLabels);

export function CaseSheet({ caseItem, trigger }: { caseItem?: CaseDto; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const {
    addParticipant,
    draft,
    errors,
    forumDisabled,
    forums,
    handleSubmit,
    judicialCenterId,
    judicialCenters,
    judicialCentersLoading,
    mutation,
    participantErrors,
    prepareDraft,
    provinces,
    removeParticipant,
    strategyConfig,
    updateDraft,
    updateForum,
    updateJudicialCenter,
    updateParticipant
  } = useCaseSheetController({
    caseItem,
    onSuccess: () => {
      setOpen(false);
    }
  });
  const needsJudicialCenter = strategyConfig.forumScope === "judicialCenter";

  useEffect(() => {
    if (open) {
      prepareDraft();
    }
  }, [open, prepareDraft]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-[760px] max-w-[94vw] overflow-hidden border-border bg-card sm:max-w-[760px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-btn-primary text-btn-primary-foreground">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
            </span>
            {caseItem ? "Editar expediente" : "Nuevo expediente"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Formulario para cargar o actualizar los datos principales de un expediente.
          </SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 pb-1 md:grid-cols-2">
            <CaseMainFields
              draft={draft}
              errors={errors}
              forumDisabled={forumDisabled}
              forums={forums}
              hasJudicialCenter={Boolean(judicialCenterId)}
              judicialCenterId={judicialCenterId}
              judicialCenters={judicialCenters}
              judicialCentersLoading={judicialCentersLoading}
              needsJudicialCenter={needsJudicialCenter}
              provinces={provinces}
              strategyCenterControl={strategyConfig.centerControl}
              onDraftChange={updateDraft}
              onForumChange={updateForum}
              onJudicialCenterChange={updateJudicialCenter}
            />

            <CaseParticipantsSection
              errors={participantErrors}
              participants={draft.participants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
              onUpdate={updateParticipant}
            />

            {mutation.error ? (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive md:col-span-2">
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

function CaseMainFields({
  draft,
  errors,
  forumDisabled,
  forums,
  hasJudicialCenter,
  judicialCenterId,
  judicialCenters,
  judicialCentersLoading,
  needsJudicialCenter,
  provinces,
  strategyCenterControl,
  onDraftChange,
  onForumChange,
  onJudicialCenterChange
}: {
  draft: CaseFormValues;
  errors: Partial<Record<keyof CaseFormValues, string>>;
  forumDisabled: boolean;
  forums: Array<{ id: string; name: string }>;
  hasJudicialCenter: boolean;
  judicialCenterId: string;
  judicialCenters: Array<{ id: string; name: string }>;
  judicialCentersLoading: boolean;
  needsJudicialCenter: boolean;
  provinces: Array<{ id: string; name: string }>;
  strategyCenterControl: "input" | "select";
  onDraftChange: <K extends keyof CaseFormValues>(key: K, value: CaseFormValues[K]) => void;
  onForumChange: (value: string) => void;
  onJudicialCenterChange: (value: string) => void;
}) {
  return (
    <>
      <CaseField error={errors.caseNumber} label="Nro. de expediente" required>
        <Input
          autoComplete="off"
          className={caseInputClassName}
          placeholder="EXP. 00035-2016"
          value={draft.caseNumber}
          onChange={(event) => onDraftChange("caseNumber", event.target.value)}
          aria-invalid={Boolean(errors.caseNumber)}
        />
      </CaseField>
      <CaseField error={errors.filingDate} label="Fecha de ingreso">
        <CaseDateInput
          autoComplete="off"
          value={draft.filingDate ?? ""}
          onChange={(event) => onDraftChange("filingDate", event.target.value)}
          aria-invalid={Boolean(errors.filingDate)}
        />
      </CaseField>
      <CaseField className="md:col-span-2" error={errors.caption} label="Caratula" required>
        <Input
          autoComplete="off"
          className={caseInputClassName}
          placeholder="Actor c/ Demandado s/ Materia"
          value={draft.caption}
          onChange={(event) => onDraftChange("caption", event.target.value)}
          aria-invalid={Boolean(errors.caption)}
        />
      </CaseField>
      <CaseField error={errors.provinceId} label="Provincia" required>
        <Select
          value={draft.provinceId || undefined}
          onValueChange={(value) => onDraftChange("provinceId", value)}
        >
          <SelectTrigger
            className={caseSelectTriggerClassName}
            aria-invalid={Boolean(errors.provinceId)}
          >
            <SelectValue placeholder="Seleccionar provincia" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.id} value={province.id}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CaseField>
      <CaseField label="Centro judicial">
        {strategyCenterControl === "select" ? (
          <Select
            disabled={!draft.provinceId || judicialCentersLoading}
            value={judicialCenterId || undefined}
            onValueChange={onJudicialCenterChange}
          >
            <SelectTrigger className={caseSelectTriggerClassName}>
              <SelectValue placeholder={getJudicialCenterPlaceholder(Boolean(draft.provinceId))} />
            </SelectTrigger>
            <SelectContent>
              {judicialCenters.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            autoComplete="off"
            className={caseInputClassName}
            disabled={!draft.provinceId}
            placeholder={draft.provinceId ? "Centro judicial" : "Selecciona una provincia primero"}
            value={draft.judicialCenterText ?? ""}
            onChange={(event) => onDraftChange("judicialCenterText", event.target.value)}
          />
        )}
      </CaseField>
      <CaseField error={errors.forumTemplateId} label="Fuero" required>
        <Select
          disabled={forumDisabled}
          value={draft.forumTemplateId || undefined}
          onValueChange={onForumChange}
        >
          <SelectTrigger
            className={caseSelectTriggerClassName}
            aria-invalid={Boolean(errors.forumTemplateId)}
          >
            <SelectValue
              placeholder={getForumPlaceholder({
                hasJudicialCenter,
                hasProvince: Boolean(draft.provinceId),
                needsJudicialCenter
              })}
            />
          </SelectTrigger>
          <SelectContent>
            {forums.map((forum) => (
              <SelectItem key={forum.id} value={forum.id}>
                {forum.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CaseField>
      <CaseField label="Juzgado / Tribunal">
        <Input
          autoComplete="off"
          className={caseInputClassName}
          placeholder="Juzgado o tribunal"
          value={draft.court ?? ""}
          onChange={(event) => onDraftChange("court", event.target.value)}
        />
      </CaseField>
      <CaseField label="Instancia">
        <Select
          value={draft.instance}
          onValueChange={(value) => onDraftChange("instance", value as CaseFormValues["instance"])}
        >
          <SelectTrigger className={caseSelectTriggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {caseInstanceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CaseField>
      <CaseField label="Estado">
        <Select
          value={draft.status}
          onValueChange={(value) => onDraftChange("status", value as CaseFormValues["status"])}
        >
          <SelectTrigger className={caseSelectTriggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {caseStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CaseField>
      <CaseField className="md:col-span-2" label="Asunto">
        <Input
          autoComplete="off"
          className={caseInputClassName}
          placeholder="Asunto del expediente"
          value={draft.subject ?? ""}
          onChange={(event) => onDraftChange("subject", event.target.value)}
        />
      </CaseField>
      <CaseField className="md:col-span-2" label="Descripcion">
        <Textarea
          className={`min-h-28 resize-none ${caseTextareaClassName}`}
          placeholder="Notas internas o descripcion breve"
          value={draft.description ?? ""}
          onChange={(event) => onDraftChange("description", event.target.value)}
        />
      </CaseField>
    </>
  );
}
