import type { OnboardingFormState } from "../_types/onboarding.types";

export const initialOnboardingState: OnboardingFormState = {
  owner: {
    fullName: "",
    email: ""
  },
  tenant: {
    name: "",
    legalName: "",
    taxId: "",
    country: "Argentina",
    province: "",
    city: "",
    timezone: "America/Argentina/Buenos_Aires",
    defaultCurrency: "ARS",
    address: "",
    website: "",
    logoUrl: "",
    size: "",
    mainPracticeAreas: [],
    referralSource: ""
  },
  workspace: {
    practiceAreaCodes: [],
    practiceAreas: [],
    defaultRoleForInvites: "lawyer",
    caseNumberingMode: "manual",
    documentStorageMode: "local"
  }
};
