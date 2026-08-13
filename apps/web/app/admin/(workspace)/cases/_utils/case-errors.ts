import type { ZodIssue } from "zod";
import type { CaseFormValues } from "@/lib/validation/cases";
import type { CaseFormErrors, ParticipantErrors } from "../_types/case-form.types";

export function toCaseFormErrors(
  fieldErrors: Partial<Record<keyof CaseFormValues, string[]>>
): CaseFormErrors {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  ) as CaseFormErrors;
}

export function toParticipantErrors(issues: ZodIssue[]): ParticipantErrors {
  return issues.reduce<ParticipantErrors>((errorsByIndex, issue) => {
    const [collection, index, field] = issue.path;

    if (collection !== "participants" || typeof index !== "number" || typeof field !== "string") {
      return errorsByIndex;
    }

    return {
      ...errorsByIndex,
      [index]: {
        ...errorsByIndex[index],
        [field]: issue.message
      }
    };
  }, {});
}
