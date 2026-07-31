"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminPrimaryActionButtonClassName } from "../../../_constants/dashboard";
import {
  caseInputClassName,
  caseSelectTriggerClassName,
  caseTextareaClassName,
  participantKindLabels,
  participantRoleLabels
} from "../../_constants/cases.constants";
import type {
  ParticipantDraft,
  ParticipantErrors,
  ParticipantKind,
  ParticipantRole
} from "../../_types/case-form.types";
import { mapRecordToOptions } from "../../_utils/case-options";
import { CaseField } from "./case-field";

const participantKindOptions = mapRecordToOptions(participantKindLabels);
const participantRoleOptions = mapRecordToOptions(participantRoleLabels);

export function CaseParticipantsSection({
  errors,
  participants,
  onAdd,
  onRemove,
  onUpdate
}: {
  errors: ParticipantErrors;
  participants: ParticipantDraft[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: <K extends keyof ParticipantDraft>(
    index: number,
    key: K,
    value: ParticipantDraft[K]
  ) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 md:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label>Sujetos procesales</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Carga clientes, partes contrarias, terceros u otros intervinientes.
          </p>
        </div>
        <Button
          type="button"
          className={`px-3 sm:px-4 ${adminPrimaryActionButtonClassName}`}
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </div>

      {participants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/50 px-4 py-6 text-sm text-muted-foreground">
          Todavia no hay sujetos procesales cargados.
        </div>
      ) : (
        <div className="grid gap-3">
          {participants.map((participant, index) => (
            <ParticipantCard
              key={index}
              errors={errors[index]}
              index={index}
              participant={participant}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ParticipantCard({
  errors,
  index,
  participant,
  onRemove,
  onUpdate
}: {
  errors?: Partial<Record<keyof ParticipantDraft, string>>;
  index: number;
  participant: ParticipantDraft;
  onRemove: (index: number) => void;
  onUpdate: <K extends keyof ParticipantDraft>(
    index: number,
    key: K,
    value: ParticipantDraft[K]
  ) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/30 bg-background/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Participante {index + 1}</p>
        <Button
          type="button"
          variant="outline"
          className="h-9 w-9 px-0"
          onClick={() => onRemove(index)}
          aria-label="Eliminar participante"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <CaseField label="Tipo">
          <Select
            value={participant.participantKind}
            onValueChange={(value) =>
              onUpdate(index, "participantKind", value as ParticipantKind)
            }
          >
            <SelectTrigger className={caseSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {participantKindOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CaseField>
        <CaseField label="Rol procesal">
          <Select value={participant.role} onValueChange={(value) => onUpdate(index, "role", value as ParticipantRole)}>
            <SelectTrigger className={caseSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {participantRoleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CaseField>
        <CaseField
          className="md:col-span-2"
          error={errors?.displayName}
          label="Nombre / Razon social"
          required
        >
          <Input
            autoComplete="off"
            className={caseInputClassName}
            placeholder="Nombre del sujeto procesal"
            value={participant.displayName}
            onChange={(event) => onUpdate(index, "displayName", event.target.value)}
            aria-invalid={Boolean(errors?.displayName)}
          />
        </CaseField>
        <CaseField error={errors?.document} label="DNI">
          <Input
            autoComplete="off"
            className={caseInputClassName}
            inputMode="numeric"
            maxLength={8}
            placeholder="DNI"
            value={participant.document ?? ""}
            onChange={(event) =>
              onUpdate(index, "document", event.target.value.replace(/\D/g, "").slice(0, 8))
            }
            aria-invalid={Boolean(errors?.document)}
          />
        </CaseField>
        <CaseField error={errors?.phone} label="Telefono">
          <Input
            autoComplete="off"
            className={caseInputClassName}
            inputMode="numeric"
            maxLength={15}
            placeholder="Telefono"
            value={participant.phone ?? ""}
            onChange={(event) =>
              onUpdate(index, "phone", event.target.value.replace(/\D/g, "").slice(0, 15))
            }
            aria-invalid={Boolean(errors?.phone)}
          />
        </CaseField>
        <CaseField label="Email">
          <Input
            autoComplete="off"
            className={caseInputClassName}
            placeholder="correo@dominio.com"
            type="email"
            value={participant.email ?? ""}
            onChange={(event) => onUpdate(index, "email", event.target.value)}
          />
        </CaseField>
        <CaseField label="Domicilio">
          <Input
            autoComplete="off"
            className={caseInputClassName}
            placeholder="Domicilio"
            value={participant.address ?? ""}
            onChange={(event) => onUpdate(index, "address", event.target.value)}
          />
        </CaseField>
        <CaseField className="md:col-span-2" label="Notas">
          <Textarea
            className={`min-h-24 ${caseTextareaClassName}`}
            placeholder="Notas del participante"
            value={participant.notes ?? ""}
            onChange={(event) => onUpdate(index, "notes", event.target.value)}
          />
        </CaseField>
      </div>
    </div>
  );
}
