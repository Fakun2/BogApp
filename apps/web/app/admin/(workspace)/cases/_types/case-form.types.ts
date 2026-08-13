import type { CaseFormValues } from "@/lib/validation/cases";

export type CaseFormErrors = Partial<Record<keyof CaseFormValues, string>>;
export type ParticipantDraft = CaseFormValues["participants"][number];
export type ParticipantErrors = Record<number, Partial<Record<keyof ParticipantDraft, string>>>;
export type ParticipantKind = ParticipantDraft["participantKind"];
export type ParticipantRole = ParticipantDraft["role"];
