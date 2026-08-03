import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);
const optionalDniSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, "El DNI debe tener solo numeros, minimo 7 y maximo 8 digitos.")
    .optional()
);
const optionalPhoneSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d{13,15}$/, "El telefono debe tener solo numeros, minimo 13 y maximo 15 digitos.")
    .optional()
);

const optionalUuid = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().uuid().optional()
);
const requiredDateString = z.string().trim().min(1, "Selecciona una fecha.");
const alertTimeSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Selecciona una hora valida.")
    .optional()
);

export const caseParticipantFormSchema = z.object({
  participantKind: z.enum(["client", "opposing_party", "third_party", "other"]).default("other"),
  role: z
    .enum([
      "claimant",
      "defendant",
      "complainant",
      "accused",
      "third_party",
      "client",
      "opposing_party",
      "other"
    ])
    .default("other"),
  displayName: z.string().trim().min(2, "Minimo 2 caracteres.").max(160, "Maximo 160 caracteres."),
  document: optionalDniSchema,
  address: optionalTrimmedString,
  email: optionalTrimmedString.pipe(z.string().email("Email invalido.").optional()),
  phone: optionalPhoneSchema,
  notes: optionalTrimmedString,
  clientId: optionalUuid
});

export const caseFormSchema = z.object({
  caseNumber: z.string().trim().min(1, "Ingresa el nro. de expediente.").max(80),
  caption: z.string().trim().min(3, "Ingresa la caratula.").max(240),
  subject: optionalTrimmedString,
  description: optionalTrimmedString,
  provinceId: z.string().uuid("Selecciona una provincia."),
  forumTemplateId: z.string().uuid("Selecciona un fuero."),
  judicialCenterForumId: optionalUuid,
  judicialCenterText: optionalTrimmedString,
  court: optionalTrimmedString,
  instance: z.enum(["first", "second", "third"]).default("first"),
  status: z.enum(["open", "paused", "closed"]).default("open"),
  filingDate: optionalTrimmedString,
  primaryClientId: optionalUuid,
  practiceAreaId: optionalUuid,
  responsibleMembershipId: optionalUuid,
  participants: z.array(caseParticipantFormSchema).max(20).default([])
});

export const caseTaskFormSchema = z.object({
  name: z.string().trim().min(2, "Minimo 2 caracteres.").max(160, "Maximo 160 caracteres."),
  assignedMembershipId: optionalUuid,
  startDate: optionalTrimmedString,
  endDate: optionalTrimmedString,
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  notes: optionalTrimmedString
});

export const caseExpenseFormSchema = z
  .object({
    concept: z.string().trim().min(3, "Minimo 3 caracteres.").max(160, "Maximo 160 caracteres."),
    amount: z.coerce.number().min(0.01, "Ingresa un monto mayor a cero."),
    expenseDate: requiredDateString,
    paymentDate: requiredDateString,
    status: z.enum(["pending", "paid", "cancelled"]),
    notes: optionalTrimmedString.pipe(z.string().max(100, "Maximo 100 caracteres.").optional()),
    alertEnabled: z.coerce.boolean().default(false),
    alertDate: optionalTrimmedString,
    alertTime: alertTimeSchema,
    taskId: optionalUuid
  })
  .superRefine((input, context) => {
    if (!input.alertEnabled) {
      return;
    }

    if (!input.alertDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona la fecha de alerta.",
        path: ["alertDate"]
      });
    }

    if (!input.alertTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona la hora de alerta.",
        path: ["alertTime"]
      });
    }
  });

export const caseHearingTypeSchema = z.enum([
  "preliminary",
  "trial_view",
  "conciliation",
  "mediation",
  "testimonial",
  "confessional",
  "debate",
  "investigative_statement",
  "other"
]);

export const caseHearingFormSchema = z.object({
  type: caseHearingTypeSchema,
  date: requiredDateString,
  time: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Selecciona una hora valida."),
  description: z.string().trim().min(3, "Minimo 3 caracteres.").max(500, "Maximo 500 caracteres."),
  notificationsEnabled: z.coerce.boolean().default(false)
});

export type CaseFormValues = z.infer<typeof caseFormSchema>;
export type CaseTaskFormValues = z.infer<typeof caseTaskFormSchema>;
export type CaseExpenseFormValues = z.infer<typeof caseExpenseFormSchema>;
export type CaseHearingFormValues = z.infer<typeof caseHearingFormSchema>;
