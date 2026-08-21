import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const requiredTrimmedString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().min(1)
);

const maxDashboardSearchLength = 120;

export const dashboardSearchQuerySchema = z.object({
  search: requiredTrimmedString.pipe(z.string().max(maxDashboardSearchLength)),
  limit: z.coerce.number().int().min(1).max(20).default(8),
  cursor: optionalTrimmedString,
  offset: z.coerce.number().int().min(0).default(0)
});

export class DashboardSearchQueryDto extends createZodDto(dashboardSearchQuerySchema) {}

export class DashboardCurrencyDto {
  @ApiProperty({ example: "ARS" })
  code!: string;

  @ApiProperty({ example: "Peso argentino" })
  name!: string;

  @ApiProperty({ example: "$" })
  symbol!: string;
}

export class DashboardCashboxMetricDto {
  @ApiProperty({ example: "120000.00" })
  balance!: string;

  @ApiProperty({ type: DashboardCurrencyDto })
  currency!: DashboardCurrencyDto;

  @ApiProperty({ example: "2026-08-18" })
  date!: string;

  @ApiProperty({ example: "25000.00" })
  expenseToday!: string;

  @ApiProperty({ example: "50000.00" })
  incomeToday!: string;
}

export class DashboardDueTodayMetricDto {
  @ApiProperty({ example: 3 })
  paymentsCount!: number;

  @ApiProperty({ example: 5 })
  tasksCount!: number;
}

export class DashboardMetricsDto {
  @ApiProperty({ example: 24 })
  activeCasesCount!: number;

  @ApiProperty({ type: DashboardCashboxMetricDto })
  cashbox!: DashboardCashboxMetricDto;

  @ApiProperty({ type: DashboardDueTodayMetricDto })
  dueToday!: DashboardDueTodayMetricDto;
}

export class DashboardSearchPageInfoDto {
  @ApiProperty({ example: 8 })
  limit!: number;

  @ApiProperty({ deprecated: true, example: 0 })
  offset!: number;

  @ApiProperty({ nullable: true, type: String })
  nextCursor!: string | null;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ deprecated: true, example: 9 })
  total!: number;
}

export class DashboardSearchItemDto {
  @ApiProperty({
    enum: ["case", "document", "cashbox_movement", "task_due", "hearing", "payment_due"],
    example: "task_due"
  })
  type!: "case" | "document" | "cashbox_movement" | "task_due" | "hearing" | "payment_due";

  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "Tarea: Presentar escrito" })
  title!: string;

  @ApiProperty({ example: "2026-08-20" })
  date!: string;

  @ApiProperty({ example: "/admin/cases/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })
  href!: string;

  @ApiProperty({ format: "uuid", required: false })
  caseId?: string;

  @ApiProperty({ example: "EXP-123/2026", required: false })
  caseNumber?: string;

  @ApiProperty({ example: "Perez c/ Gomez s/ Danos y perjuicios", required: false })
  caseCaption?: string;

  @ApiProperty({ nullable: true, required: false, type: String })
  description?: string | null;

  @ApiProperty({ nullable: true, required: false, type: String })
  status?: string | null;

  @ApiProperty({ example: 120000, required: false })
  amount?: number;

  @ApiProperty({ example: "ARS", required: false })
  currencyCode?: string;

  @ApiProperty({ example: "09:30", required: false })
  time?: string;

  @ApiProperty({ example: "demanda.pdf", required: false })
  fileName?: string;

  @ApiProperty({ example: "application/pdf", required: false })
  fileType?: string;

  @ApiProperty({ example: 245760, required: false })
  fileSizeBytes?: number;

  @ApiProperty({ example: "Pago de honorarios", required: false })
  movementName?: string;

  @ApiProperty({
    enum: ["income", "expense", "conversion_in", "conversion_out"],
    example: "income",
    required: false
  })
  movementType?: "income" | "expense" | "conversion_in" | "conversion_out";
}

export class DashboardSearchResponseDto {
  @ApiProperty({ type: [DashboardSearchItemDto] })
  items!: DashboardSearchItemDto[];

  @ApiProperty({ type: DashboardSearchPageInfoDto })
  pageInfo!: DashboardSearchPageInfoDto;
}

export type DashboardSearchQuery = z.infer<typeof dashboardSearchQuerySchema>;
