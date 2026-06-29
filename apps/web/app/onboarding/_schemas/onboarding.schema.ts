import { z } from "zod";

export const onboardingSchema = z.object({
  owner: z.object({
    fullName: z.string().min(2, "Ingresa el nombre completo."),
    email: z.string().email("Ingresa un email valido.")
  }),
  tenant: z.object({
    name: z.string().min(2, "Ingresa el nombre del estudio."),
    legalName: z.string().min(2, "Ingresa la razon social o nombre legal."),
    taxId: z
      .string()
      .regex(/^\d{11}$/, "El CUIT/CUIL debe tener exactamente 11 digitos numericos."),
    country: z.string().min(2),
    province: z.string().min(2, "Ingresa la provincia."),
    city: z.string().min(2, "Ingresa la ciudad."),
    timezone: z.string().min(2),
    defaultCurrency: z.string().length(3),
    address: z.string().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    size: z.string().optional(),
    referralSource: z.string().optional()
  }),
  workspace: z.object({
    practiceAreaCodes: z.array(z.string().min(1)),
    practiceAreas: z.array(z.string().min(2)),
    defaultRoleForInvites: z.enum(["admin", "lawyer", "paralegal", "accounting", "viewer"]),
    caseNumberingMode: z.enum(["manual", "automatic"]),
    documentStorageMode: z.enum(["local", "s3"])
  })
});

export type OnboardingPayload = z.infer<typeof onboardingSchema>;
