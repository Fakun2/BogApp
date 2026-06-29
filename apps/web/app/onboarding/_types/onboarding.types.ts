import type { BogaapSession } from "@/lib/auth/session";
import type { OnboardingPayload } from "../_schemas/onboarding.schema";

export type StepIndex = 0 | 1 | 2;

export type StepErrors = Partial<Record<StepIndex, string>>;

export type OnboardingFormState = OnboardingPayload & {
  owner: {
    fullName: string;
    email: string;
  };
};

export type PracticeAreaTemplate = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  displayOrder: number;
};

export type StartOnboardingResponse = {
  userId: string;
  tenantId: string;
  role: string;
  tokens: BogaapSession["tokens"];
};

export type OnboardingResult = {
  tenantId: string;
  userId: string;
};

export type UpdateOwner = <K extends keyof OnboardingFormState["owner"]>(
  key: K,
  value: OnboardingFormState["owner"][K]
) => void;

export type UpdateTenant = <K extends keyof OnboardingFormState["tenant"]>(
  key: K,
  value: OnboardingFormState["tenant"][K]
) => void;

export type UpdateWorkspace = <K extends keyof OnboardingFormState["workspace"]>(
  key: K,
  value: OnboardingFormState["workspace"][K]
) => void;
