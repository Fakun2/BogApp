import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const optionalUuid = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().uuid().optional()
);
const requiredDateString = z.string().trim().min(1);

const caseInstanceSchema = z.enum(["first", "second", "third"]);
const caseStatusSchema = z.enum(["open", "paused", "closed"]);
const caseTaskStatusSchema = z.enum(["pending", "in_progress", "completed", "cancelled"]);
const caseExpenseEditableStatusSchema = z.enum(["pending", "paid", "cancelled"]);
const caseExpenseStatusSchema = z.enum(["pending", "paid", "cancelled", "overdue"]);
const participantRoleSchema = z.enum([
  "claimant",
  "defendant",
  "complainant",
  "accused",
  "third_party",
  "client",
  "opposing_party",
  "other"
]);
const participantKindSchema = z.enum(["client", "opposing_party", "third_party", "other"]);

const caseParticipantInputSchema = z.object({
  participantKind: participantKindSchema.default("other"),
  role: participantRoleSchema.default("other"),
  displayName: z.string().trim().min(2).max(160),
  document: optionalTrimmedString,
  address: optionalTrimmedString,
  email: optionalTrimmedString.pipe(z.string().email().optional()),
  phone: optionalTrimmedString,
  notes: optionalTrimmedString,
  clientId: optionalUuid
});

const caseInputSchema = z.object({
  caseNumber: z.string().trim().min(1).max(80),
  caption: z.string().trim().min(3).max(240),
  subject: optionalTrimmedString,
  description: optionalTrimmedString,
  provinceId: z.string().uuid(),
  forumTemplateId: z.string().uuid(),
  judicialCenterForumId: optionalUuid,
  judicialCenterText: optionalTrimmedString,
  court: optionalTrimmedString,
  instance: caseInstanceSchema.default("first"),
  status: caseStatusSchema.default("open"),
  filingDate: optionalTrimmedString,
  primaryClientId: optionalUuid,
  practiceAreaId: optionalUuid,
  responsibleMembershipId: optionalUuid,
  participants: z.array(caseParticipantInputSchema).max(20).default([])
});

export const createCaseSchema = caseInputSchema;
export const updateCaseSchema = caseInputSchema;

const caseTaskInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  startDate: optionalTrimmedString,
  endDate: optionalTrimmedString,
  status: caseTaskStatusSchema.default("pending"),
  notes: optionalTrimmedString
});

const alertTimeSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional()
);
const caseExpenseInputSchema = z
  .object({
    concept: z.string().trim().min(3).max(160),
    amount: z.coerce.number().min(0.01).max(9999999999.99),
    expenseDate: requiredDateString,
    paymentDate: requiredDateString,
    status: caseExpenseEditableStatusSchema,
    notes: optionalTrimmedString.pipe(z.string().max(100).optional()),
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
        message: "La fecha de alerta es obligatoria.",
        path: ["alertDate"]
      });
    }

    if (!input.alertTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La hora de alerta es obligatoria.",
        path: ["alertTime"]
      });
    }
  });

export const listCasesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(8),
  cursor: optionalTrimmedString,
  offset: z.coerce.number().int().min(0).default(0),
  search: optionalTrimmedString,
  filingDate: optionalTrimmedString,
  status: caseStatusSchema.optional(),
  instance: caseInstanceSchema.optional(),
  provinceId: optionalUuid,
  forumTemplateId: optionalUuid,
  judicialCenter: optionalTrimmedString,
  court: optionalTrimmedString,
  sortBy: z
    .enum(["caseNumber", "caption", "filingDate", "createdAt", "status"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc")
});

export const listCaseExpensesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(8).default(8),
  cursor: optionalTrimmedString,
  taskId: optionalUuid
});

export const listCaseTasksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(8).default(8),
  cursor: optionalTrimmedString
});

export class ListCasesQueryDto extends createZodDto(listCasesQuerySchema) {}
export class ListCaseExpensesQueryDto extends createZodDto(listCaseExpensesQuerySchema) {}
export class ListCaseTasksQueryDto extends createZodDto(listCaseTasksQuerySchema) {}
export class CreateCaseDto extends createZodDto(createCaseSchema) {}
export class UpdateCaseDto extends createZodDto(updateCaseSchema) {}
export class CreateCaseTaskDto extends createZodDto(caseTaskInputSchema) {}
export class UpdateCaseTaskDto extends createZodDto(caseTaskInputSchema) {}
export class CreateCaseExpenseDto extends createZodDto(caseExpenseInputSchema) {}
export class UpdateCaseExpenseDto extends createZodDto(caseExpenseInputSchema) {}

export class CaseProvinceDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-tucuman" })
  code!: string;

  @ApiProperty({ example: "Tucuman" })
  name!: string;
}

export class CaseForumDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-tucuman-civil-comercial-comun" })
  code!: string;

  @ApiProperty({ example: "Civil y comercial comun" })
  name!: string;
}

export class CaseJudicialCenterDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-tucuman-centro-judicial-capital" })
  code!: string;

  @ApiProperty({ example: "Centro Judicial Capital" })
  name!: string;
}

export class CaseParticipantDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: participantKindSchema.options })
  participantKind!: z.infer<typeof participantKindSchema>;

  @ApiProperty({ enum: participantRoleSchema.options })
  role!: z.infer<typeof participantRoleSchema>;

  @ApiProperty({ example: "Juan Perez" })
  displayName!: string;

  @ApiProperty({ nullable: true, type: String })
  document!: string | null;

  @ApiProperty({ nullable: true, type: String })
  address!: string | null;

  @ApiProperty({ nullable: true, type: String })
  email!: string | null;

  @ApiProperty({ nullable: true, type: String })
  phone!: string | null;

  @ApiProperty({ nullable: true, type: String })
  notes!: string | null;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  clientId!: string | null;
}

export class CaseDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "EXP-1234/2026" })
  caseNumber!: string;

  @ApiProperty({ example: "Perez c/ Gomez s/ Danos y perjuicios" })
  caption!: string;

  @ApiProperty({ nullable: true, type: String })
  subject!: string | null;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;

  @ApiProperty({ type: CaseProvinceDto })
  province!: CaseProvinceDto;

  @ApiProperty({ type: CaseForumDto })
  forum!: CaseForumDto;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  judicialCenterForumId!: string | null;

  @ApiProperty({ nullable: true, type: CaseJudicialCenterDto })
  judicialCenter!: CaseJudicialCenterDto | null;

  @ApiProperty({ nullable: true, type: String })
  judicialCenterText!: string | null;

  @ApiProperty({ nullable: true, type: String })
  court!: string | null;

  @ApiProperty({ enum: caseInstanceSchema.options })
  instance!: z.infer<typeof caseInstanceSchema>;

  @ApiProperty({ enum: caseStatusSchema.options })
  status!: z.infer<typeof caseStatusSchema>;

  @ApiProperty({ nullable: true, type: String, format: "date" })
  filingDate!: string | null;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  primaryClientId!: string | null;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  practiceAreaId!: string | null;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  responsibleMembershipId!: string | null;

  @ApiProperty({ type: [CaseParticipantDto] })
  participants!: CaseParticipantDto[];

  @ApiProperty({ format: "date-time" })
  createdAt!: string;

  @ApiProperty({ format: "date-time" })
  updatedAt!: string;
}

export class CaseTaskDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  caseId!: string;

  @ApiProperty({ example: "Presentar escrito inicial" })
  name!: string;

  @ApiProperty({ nullable: true, type: String, format: "date" })
  startDate!: string | null;

  @ApiProperty({ nullable: true, type: String, format: "date" })
  endDate!: string | null;

  @ApiProperty({ enum: caseTaskStatusSchema.options })
  status!: z.infer<typeof caseTaskStatusSchema>;

  @ApiProperty({ nullable: true, type: String })
  notes!: string | null;

  @ApiProperty({ format: "date-time" })
  createdAt!: string;

  @ApiProperty({ format: "date-time" })
  updatedAt!: string;
}

export class CaseExpenseTaskDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "Presentar escrito inicial" })
  name!: string;
}

export class CaseExpenseAttachmentDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "comprobante.pdf" })
  originalName!: string;

  @ApiProperty({ example: "application/pdf" })
  mimeType!: string;

  @ApiProperty({ example: 245760 })
  sizeBytes!: number;

  @ApiProperty({ format: "date-time" })
  createdAt!: string;
}

export class CaseExpenseDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  caseId!: string;

  @ApiProperty({ nullable: true, type: String, format: "uuid" })
  taskId!: string | null;

  @ApiProperty({ nullable: true, type: CaseExpenseTaskDto })
  task!: CaseExpenseTaskDto | null;

  @ApiProperty({ example: "Tasa judicial" })
  concept!: string;

  @ApiProperty({ example: 15000 })
  amount!: number;

  @ApiProperty({ type: String, format: "date" })
  expenseDate!: string;

  @ApiProperty({ type: String, format: "date" })
  paymentDate!: string;

  @ApiProperty({ enum: caseExpenseStatusSchema.options })
  status!: z.infer<typeof caseExpenseStatusSchema>;

  @ApiProperty({ nullable: true, type: String })
  notes!: string | null;

  @ApiProperty({ example: false })
  alertEnabled!: boolean;

  @ApiProperty({ nullable: true, type: String, format: "date-time" })
  alertAt!: string | null;

  @ApiProperty({ type: [CaseExpenseAttachmentDto] })
  attachments!: CaseExpenseAttachmentDto[];

  @ApiProperty({ format: "date-time" })
  createdAt!: string;

  @ApiProperty({ format: "date-time" })
  updatedAt!: string;
}

export class CaseMetricsDto {
  @ApiProperty({ example: 15000 })
  totalExpenses!: number;

  @ApiProperty({ example: 8500 })
  pendingPayments!: number;

  @ApiProperty({ example: 12 })
  totalTasks!: number;

  @ApiProperty({ example: 5 })
  pendingTasks!: number;
}

export class CaseDetailDto extends CaseDto {
  @ApiProperty({ type: CaseMetricsDto })
  metrics!: CaseMetricsDto;
}

export class CasesPageInfoDto {
  @ApiProperty({ example: 8 })
  limit!: number;

  @ApiProperty({ deprecated: true, example: 0 })
  offset!: number;

  @ApiProperty({ nullable: true, type: String })
  nextCursor!: string | null;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ deprecated: true, example: 42 })
  total!: number;
}

export class CaseTasksListResponseDto {
  @ApiProperty({ type: [CaseTaskDto] })
  items!: CaseTaskDto[];

  @ApiProperty({ type: CasesPageInfoDto })
  pageInfo!: CasesPageInfoDto;
}

export class CaseExpensesListResponseDto {
  @ApiProperty({ type: [CaseExpenseDto] })
  items!: CaseExpenseDto[];

  @ApiProperty({ type: CasesPageInfoDto })
  pageInfo!: CasesPageInfoDto;
}

export class CaseExpenseAttachmentsListResponseDto {
  @ApiProperty({ type: [CaseExpenseAttachmentDto] })
  items!: CaseExpenseAttachmentDto[];
}

export class CasesListResponseDto {
  @ApiProperty({ type: [CaseDto] })
  items!: CaseDto[];

  @ApiProperty({ type: CasesPageInfoDto })
  pageInfo!: CasesPageInfoDto;
}

export class CaseDeleteResponseDto {
  @ApiProperty({ example: "ok" })
  status!: "ok";
}

export type ListCasesQuery = z.infer<typeof listCasesQuerySchema>;
export type ListCaseExpensesQuery = z.infer<typeof listCaseExpensesQuerySchema>;
export type ListCaseTasksQuery = z.infer<typeof listCaseTasksQuerySchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type CreateCaseTaskInput = z.infer<typeof caseTaskInputSchema>;
export type UpdateCaseTaskInput = z.infer<typeof caseTaskInputSchema>;
export type CreateCaseExpenseInput = z.infer<typeof caseExpenseInputSchema>;
export type UpdateCaseExpenseInput = z.infer<typeof caseExpenseInputSchema>;
