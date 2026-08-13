import { z } from "zod";

const roleCodeSchema = z.enum(["admin", "lawyer", "paralegal", "accounting", "viewer"]);
const caseNumberingModeSchema = z.enum(["manual", "automatic"]);
const documentStorageModeSchema = z.enum(["local", "s3"]);

const optionalUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url("Ingresa una URL valida.").optional()
);
const optionalStringSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(2, "Ingresa al menos 2 caracteres.").optional()
);

export const onboardingOwnerSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa el nombre completo."),
  email: z.string().trim().toLowerCase().email("Ingresa un email valido.")
});

export const onboardingTenantSchema = z.object({
  name: z.string().min(2, "Ingresa el nombre del estudio."),
  legalName: optionalStringSchema,
  taxId: z
    .string()
    .regex(/^\d{11}$/, "El CUIT/CUIL debe tener exactamente 11 digitos numericos."),
  country: z.string().min(2, "Ingresa el pais.").default("Argentina"),
  province: z.string().min(2, "Ingresa la provincia."),
  city: z.string().min(2, "Ingresa la ciudad."),
  timezone: z.string().min(2, "Ingresa la zona horaria.").default("America/Argentina/Buenos_Aires"),
  defaultCurrency: z.string().length(3, "Ingresa una moneda ISO de 3 letras.").default("ARS"),
  address: z.string().optional(),
  website: optionalUrlSchema,
  logoUrl: optionalUrlSchema,
  size: z.string().optional(),
  mainPracticeAreas: z.array(z.string().min(2)).default([]),
  referralSource: z.string().optional()
});

export const onboardingWorkspaceSchema = z.object({
  practiceAreaCodes: z.array(z.string().trim().min(1)).default([]),
  practiceAreas: z.array(z.string().min(2)).default([]),
  defaultRoleForInvites: roleCodeSchema.default("lawyer"),
  caseNumberingMode: caseNumberingModeSchema.default("manual"),
  documentStorageMode: documentStorageModeSchema.default("local")
});

export const startOnboardingSchema = z.object({
  owner: onboardingOwnerSchema.optional(),
  tenant: onboardingTenantSchema,
  workspace: onboardingWorkspaceSchema
});

export const onboardingFormSchema = startOnboardingSchema.extend({
  owner: onboardingOwnerSchema
});

export type StartOnboardingInput = z.input<typeof startOnboardingSchema>;
export type StartOnboardingPayload = z.output<typeof startOnboardingSchema>;
export type OnboardingFormInput = z.input<typeof onboardingFormSchema>;
