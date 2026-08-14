import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createStaffFormSchema = z.object({
  firstName: z.string().trim().min(3, "Minimo 3 caracteres.").max(50, "Maximo 50 caracteres."),
  lastName: z.string().trim().min(3, "Minimo 3 caracteres.").max(50, "Maximo 50 caracteres."),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 digitos.")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().toLowerCase().regex(emailRegex, "Ingresa un email valido."),
  password: z
    .string()
    .min(8, "Minimo 8 caracteres.")
    .max(72, "Maximo 72 caracteres.")
    .regex(/[A-Z]/, "Debe incluir una mayuscula.")
    .regex(/[a-z]/, "Debe incluir una minuscula.")
    .regex(/[0-9]/, "Debe incluir un numero.")
    .regex(/[@#$\-_%]/, "Debe incluir un caracter especial: @ # $ - _ %."),
  role: z.string().trim().min(1, "Selecciona un rol."),
  status: z.enum(["active", "suspended"]).default("active"),
  practiceAreaIds: z.array(z.string().uuid()).default([]),
  phone: z
    .string()
    .trim()
    .regex(/^\d{0,15}$/, "El telefono debe tener solo numeros y maximo 15 digitos.")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().trim().url("La URL del avatar no es valida.").optional().or(z.literal(""))
});

export const updateStaffFormSchema = createStaffFormSchema.omit({ password: true }).extend({
  password: createStaffFormSchema.shape.password.optional().or(z.literal(""))
});

export type CreateStaffFormValues = z.infer<typeof createStaffFormSchema>;
export type UpdateStaffFormValues = z.infer<typeof updateStaffFormSchema>;
