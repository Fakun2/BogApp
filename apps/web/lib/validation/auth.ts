import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email("Ingresa un email valido.");

const passwordSchema = z
  .string()
  .min(8, "La contrasena debe tener al menos 8 caracteres.")
  .max(72, "La contrasena no puede superar 72 caracteres.")
  .regex(/[A-Za-z]/, "La contrasena debe incluir al menos una letra.")
  .regex(/[0-9]/, "La contrasena debe incluir al menos un numero.");

const loginPasswordSchema = z
  .string()
  .min(1, "Ingresa tu contrasena.")
  .max(72, "La contrasena no puede superar 72 caracteres.");

const optionalPhoneSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(6, "Ingresa un telefono valido.").optional()
);

export const createAccountFormSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre completo."),
  email: emailSchema,
  password: passwordSchema,
  phone: optionalPhoneSchema
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  tenantId: z.string().uuid("Tenant invalido.").optional()
});

export type CreateAccountFormValues = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};
export type CreateAccountPayload = z.output<typeof createAccountFormSchema>;
export type LoginFormValues = z.input<typeof loginFormSchema>;
export type LoginPayload = z.output<typeof loginFormSchema>;
