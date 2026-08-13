import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const currencyCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/)
  .transform((value) => value.toUpperCase());

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/);

const optionalDateSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  dateSchema.optional()
);

const localDecimalStringSchema = z
  .string()
  .trim()
  .regex(/^(?:0|[1-9]\d{0,2}(?:\.\d{3})*|\d+)(?:,\d+)?$/);

const positiveLocalDecimalStringSchema = localDecimalStringSchema.refine(
  (value) => parseLocalDecimalParts(value).some((digit) => digit !== "0")
);

const optionalDateTimeSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce.date().optional()
);

const categoryRefSchema = z.object({
  id: z.string().uuid(),
  origin: z.enum(["global", "tenant"])
});

export const cashboxMovementTypeSchema = z.enum([
  "income",
  "expense",
  "conversion_in",
  "conversion_out"
]);

export const listCashboxMovementsQuerySchema = z.object({
  currencyCode: currencyCodeSchema.optional(),
  cursor: optionalTrimmedString,
  date: optionalDateSchema,
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

export const cashboxSummaryQuerySchema = z.object({
  currencyCode: currencyCodeSchema.optional(),
  date: optionalDateSchema
});

export const createCashboxMovementSchema = z.object({
  amount: positiveLocalDecimalStringSchema.refine((value) => getLocalDecimalScale(value) <= 2),
  category: categoryRefSchema.optional(),
  currencyCode: currencyCodeSchema,
  description: z.string().trim().max(240).optional(),
  occurredAt: optionalDateTimeSchema,
  type: z.enum(["income", "expense"])
});

export const createCashboxConversionSchema = z.object({
  description: z.string().trim().max(240).optional(),
  exchangeRate: positiveLocalDecimalStringSchema.refine((value) => getLocalDecimalScale(value) <= 8),
  fromAmount: positiveLocalDecimalStringSchema.refine((value) => getLocalDecimalScale(value) <= 2),
  fromCurrencyCode: currencyCodeSchema,
  occurredAt: optionalDateTimeSchema,
  toCurrencyCode: currencyCodeSchema
});

export const updateCashboxMovementSchema = z.object({
  amount: positiveLocalDecimalStringSchema.refine((value) => getLocalDecimalScale(value) <= 2).optional(),
  category: categoryRefSchema.nullable().optional(),
  description: z.string().trim().max(240).optional(),
  occurredAt: optionalDateTimeSchema
});

export class ListCashboxMovementsQueryDto extends createZodDto(
  listCashboxMovementsQuerySchema
) {}
export class CashboxSummaryQueryDto extends createZodDto(cashboxSummaryQuerySchema) {}
export class CreateCashboxMovementDto extends createZodDto(createCashboxMovementSchema) {
  @ApiProperty({ enum: ["income", "expense"], example: "income" })
  type!: "income" | "expense";

  @ApiProperty({ example: "ARS" })
  currencyCode!: string;

  @ApiProperty({ example: "150.000,00" })
  amount!: string;
}

export class CreateCashboxConversionDto extends createZodDto(createCashboxConversionSchema) {
  @ApiProperty({ example: "ARS" })
  fromCurrencyCode!: string;

  @ApiProperty({ example: "USD" })
  toCurrencyCode!: string;

  @ApiProperty({ example: "100.000,00" })
  fromAmount!: string;

  @ApiProperty({ example: "1.000,00000000" })
  exchangeRate!: string;
}

export class UpdateCashboxMovementDto extends createZodDto(updateCashboxMovementSchema) {
  @ApiProperty({ example: "150.000,00", required: false })
  amount?: string;
}

export class CashboxCurrencyDto {
  @ApiProperty({ example: "Peso argentino" })
  name!: string;

  @ApiProperty({ example: "ARS" })
  code!: string;

  @ApiProperty({ example: "$" })
  symbol!: string;
}

export class CashboxHourlySummaryDto {
  @ApiProperty({ example: "09" })
  hour!: string;

  @ApiProperty({ example: "150000.00" })
  income!: string;

  @ApiProperty({ example: "50000.00" })
  expense!: string;
}

export class CashboxSummaryDto {
  @ApiProperty({ type: CashboxCurrencyDto })
  currency!: CashboxCurrencyDto;

  @ApiProperty({ example: "2026-08-12" })
  date!: string;

  @ApiProperty({ example: "250000.00" })
  balance!: string;

  @ApiProperty({ example: "150000.00" })
  incomeToday!: string;

  @ApiProperty({ example: "50000.00" })
  expenseToday!: string;

  @ApiProperty({ type: [CashboxHourlySummaryDto] })
  hourly!: CashboxHourlySummaryDto[];
}

export class CashboxMovementDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: ["income", "expense", "conversion_in", "conversion_out"] })
  type!: CashboxMovementTypeDto;

  @ApiProperty({ example: "ARS" })
  currencyCode!: string;

  @ApiProperty({ example: "$" })
  currencySymbol!: string;

  @ApiProperty({ example: "10000.00" })
  amount!: string;

  @ApiProperty({ format: "date-time" })
  occurredAt!: Date;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  categoryName?: string;

  @ApiProperty({ required: false, format: "uuid" })
  categoryId?: string;

  @ApiProperty({ required: false, enum: ["global", "tenant"] })
  categoryOrigin?: "global" | "tenant";

  @ApiProperty({ required: false, format: "uuid" })
  conversionGroupId?: string;

  @ApiProperty({ required: false, example: "1000.00000000" })
  exchangeRate?: string;

  @ApiProperty({ example: "Mateo" })
  createdByName!: string;
}

export class CashboxMovementsPageInfoDto {
  @ApiProperty({ example: 12 })
  limit!: number;

  @ApiProperty({ nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: false })
  hasNextPage!: boolean;
}

export class CashboxMovementsListResponseDto {
  @ApiProperty({ type: [CashboxMovementDto] })
  items!: CashboxMovementDto[];

  @ApiProperty({ type: CashboxMovementsPageInfoDto })
  pageInfo!: CashboxMovementsPageInfoDto;
}

export class CreateCashboxConversionResponseDto {
  @ApiProperty({ type: [CashboxMovementDto] })
  items!: CashboxMovementDto[];
}

export type CashboxMovementTypeDto = z.infer<typeof cashboxMovementTypeSchema>;
export type ListCashboxMovementsQuery = z.infer<typeof listCashboxMovementsQuerySchema>;
export type CashboxSummaryQuery = z.infer<typeof cashboxSummaryQuerySchema>;
export type CreateCashboxMovementInput = z.infer<typeof createCashboxMovementSchema>;
export type CreateCashboxConversionInput = z.infer<typeof createCashboxConversionSchema>;
export type UpdateCashboxMovementInput = z.infer<typeof updateCashboxMovementSchema>;

function parseLocalDecimalParts(value: string) {
  return value.replace(/\./g, "").replace(",", "").split("");
}

function getLocalDecimalScale(value: string) {
  return value.includes(",") ? value.split(",")[1]?.length ?? 0 : 0;
}
