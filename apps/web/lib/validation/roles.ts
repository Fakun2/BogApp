import { z } from "zod";

export const createRoleFormSchema = z.object({
  name: z.string().trim().min(3, "Minimo 3 caracteres.").max(60, "Maximo 60 caracteres."),
  description: z
    .string()
    .trim()
    .min(8, "Minimo 8 caracteres.")
    .max(180, "Maximo 180 caracteres."),
  active: z.boolean().default(true),
  hierarchyLevel: z.coerce.number().int().min(1).max(3).default(1),
  permissions: z.array(z.string()).min(1, "Selecciona al menos un permiso.")
});

export const updateRoleFormSchema = createRoleFormSchema.partial().extend({
  permissions: z.array(z.string()).min(1, "Selecciona al menos un permiso.").optional()
});

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;
