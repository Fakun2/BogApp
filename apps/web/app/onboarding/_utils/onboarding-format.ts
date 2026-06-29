import { z } from "zod";
import type { StepIndex } from "../_types/onboarding.types";

export function makeStudyName(fullName: string) {
  return fullName.trim() ? `Estudio ${fullName.trim()}` : "";
}

export function normalizeTaxId(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatTaxId(value: string) {
  const digits = normalizeTaxId(value);
  const first = digits.slice(0, 2);
  const middle = digits.slice(2, 10);
  const last = digits.slice(10, 11);

  if (digits.length <= 2) {
    return first;
  }

  if (digits.length <= 10) {
    return `${first}-${middle}`;
  }

  return `${first}-${middle}-${last}`;
}

export function getStepFromIssue(issue: z.ZodIssue | undefined): StepIndex | null {
  const root = issue?.path[0];

  if (root === "owner") {
    return 0;
  }

  if (root === "tenant") {
    return 1;
  }

  if (root === "workspace") {
    return 2;
  }

  return null;
}
