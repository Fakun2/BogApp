import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(emptyStringToUndefined, z.string().trim().max(max).optional());
const optionalEmail = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().toLowerCase().email().max(160).optional()
);
const optionalDni = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : emptyStringToUndefined(value)),
  z.string().trim().regex(/^\d{7,8}$/).optional()
);
const optionalTaxId = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : emptyStringToUndefined(value)),
  z.string().trim().regex(/^\d{11}$/).optional()
);
const optionalCbu = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : emptyStringToUndefined(value)),
  z.string().trim().regex(/^\d{22}$/).optional()
);

export const listClientsQuerySchema = z.object({
  cursor: optionalText(100),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: optionalText(120),
  sortBy: z.enum(["name", "createdAt", "status", "type"]).default("name"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  type: z.enum(["human", "legal_entity"]).optional()
});

const clientFieldsSchema = z.object({
  type: z.enum(["human", "legal_entity"]),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  firstName: optionalText(80),
  lastName: optionalText(80),
  age: z.coerce.number().int().min(0).max(120).optional(),
  dni: optionalDni,
  cuil: optionalTaxId,
  cuit: optionalTaxId,
  businessName: optionalText(160),
  email: optionalEmail,
  phone: optionalText(40),
  address: optionalText(240),
  notes: optionalText(4000),
  statute: optionalText(500),
  salaryReceiptRef: optionalText(500),
  cbu: optionalCbu
});

export const createClientSchema = clientFieldsSchema;
export const updateClientSchema = clientFieldsSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, "Debe enviar al menos un campo.");

export class ListClientsQueryDto extends createZodDto(listClientsQuerySchema) {}
export class CreateClientDto extends createZodDto(createClientSchema) {}
export class UpdateClientDto extends createZodDto(updateClientSchema) {}

export class ClientDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: ["human", "legal_entity"] })
  type!: "human" | "legal_entity";

  @ApiProperty({ enum: ["active", "inactive", "archived"] })
  status!: "active" | "inactive" | "archived";

  @ApiProperty({ example: "Ana Pérez" })
  displayName!: string;

  @ApiProperty({ nullable: true, type: String })
  firstName!: string | null;

  @ApiProperty({ nullable: true, type: String })
  lastName!: string | null;

  @ApiProperty({ nullable: true, type: Number })
  age!: number | null;

  @ApiProperty({ nullable: true, type: String })
  dni!: string | null;

  @ApiProperty({ nullable: true, type: String })
  cuil!: string | null;

  @ApiProperty({ nullable: true, type: String })
  cuit!: string | null;

  @ApiProperty({ nullable: true, type: String })
  businessName!: string | null;

  @ApiProperty({ nullable: true, type: String })
  email!: string | null;

  @ApiProperty({ nullable: true, type: String })
  phone!: string | null;

  @ApiProperty({ nullable: true, type: String })
  address!: string | null;

  @ApiProperty({ nullable: true, type: String })
  notes!: string | null;

  @ApiProperty({ nullable: true, type: String })
  statute!: string | null;

  @ApiProperty({ nullable: true, type: String })
  salaryReceiptRef!: string | null;

  @ApiProperty({ nullable: true, type: String })
  cbu!: string | null;

  @ApiProperty({ example: 3 })
  casesCount!: number;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: Date;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: Date;
}

export class ClientDetailMetricsDto {
  @ApiProperty({ example: 2 })
  primaryCases!: number;

  @ApiProperty({ example: 1 })
  caseParticipations!: number;

  @ApiProperty({ example: 3 })
  totalCases!: number;
}

export class ClientDetailDto extends ClientDto {
  @ApiProperty({ type: ClientDetailMetricsDto })
  metrics!: ClientDetailMetricsDto;
}

export class ClientsMetricsDto {
  @ApiProperty({ example: 20 })
  totalClients!: number;

  @ApiProperty({ example: 17 })
  activeClients!: number;

  @ApiProperty({ example: 14 })
  humanClients!: number;

  @ApiProperty({ example: 6 })
  legalEntityClients!: number;
}

export class ClientsPageInfoDto {
  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ nullable: true, type: String })
  nextCursor!: string | null;

  @ApiProperty({ example: false })
  hasNextPage!: boolean;
}

export class ClientsListResponseDto {
  @ApiProperty({ type: [ClientDto] })
  items!: ClientDto[];

  @ApiProperty({ type: ClientsMetricsDto })
  metrics!: ClientsMetricsDto;

  @ApiProperty({ type: ClientsPageInfoDto })
  pageInfo!: ClientsPageInfoDto;
}

export class ClientDeleteResponseDto {
  @ApiProperty({ example: "ok" })
  status!: "ok";

  @ApiProperty({ example: "archived" })
  clientStatus!: "archived";
}

export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
