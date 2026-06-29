import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email("Ingresá un email válido.");

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(72, "La contraseña no puede superar 72 caracteres.")
  .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
  .regex(/[0-9]/, "La contraseña debe incluir al menos un número.");

export const createAccountFormSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresá tu nombre completo."),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().trim().min(6, "Ingresá un teléfono válido.").optional().or(z.literal(""))
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  tenantId: z.string().uuid().optional()
});

export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
