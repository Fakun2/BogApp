import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(3).max(60),
  description: z.string().trim().min(8).max(180),
  active: z.boolean().optional().default(true),
  hierarchyLevel: z.coerce.number().int().min(1).max(3).default(1),
  permissions: z.array(z.string().trim().min(1)).min(1)
});

export const updateRoleSchema = createRoleSchema.partial().extend({
  permissions: z.array(z.string().trim().min(1)).min(1).optional()
});

export class PermissionDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  resource!: string;

  @ApiProperty()
  action!: string;
}

export class RoleDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty({ enum: [1, 2, 3], example: 2 })
  hierarchyLevel!: 1 | 2 | 3;

  @ApiProperty({ nullable: true, format: "uuid", type: String })
  tenantId!: string | null;

  @ApiProperty({ type: [String] })
  permissions!: string[];
}

export class CreateRoleDto extends createZodDto(createRoleSchema) {
  @ApiProperty({ example: "Coordinador" })
  name!: string;

  @ApiProperty({ example: "Coordina el equipo y supervisa tareas operativas." })
  description!: string;

  @ApiProperty({ default: true, required: false })
  active!: boolean;

  @ApiProperty({ default: 1, enum: [1, 2, 3], required: false })
  hierarchyLevel!: 1 | 2 | 3;

  @ApiProperty({ type: [String], example: ["staff:read", "clients:read"] })
  permissions!: string[];
}

export class UpdateRoleDto extends createZodDto(updateRoleSchema) {
  @ApiProperty({ required: false, example: "Coordinador" })
  name?: string;

  @ApiProperty({
    required: false,
    example: "Coordina el equipo y supervisa tareas operativas."
  })
  description?: string;

  @ApiProperty({ default: true, required: false })
  active?: boolean;

  @ApiProperty({ enum: [1, 2, 3], required: false })
  hierarchyLevel?: 1 | 2 | 3;

  @ApiProperty({ required: false, type: [String], example: ["staff:read", "clients:read"] })
  permissions?: string[];
}

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
