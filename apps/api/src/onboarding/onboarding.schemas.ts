import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const roleCodeSchema = z.enum(["admin", "lawyer", "paralegal", "accounting", "viewer"]);
const caseNumberingModeSchema = z.enum(["manual", "automatic"]);
const documentStorageModeSchema = z.enum(["local", "s3"]);
const optionalUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional()
);

export const startOnboardingSchema = z.object({
  owner: z
    .object({
      fullName: z.string().trim().min(2),
      email: z.string().trim().toLowerCase().email()
    })
    .optional(),
  tenant: z.object({
    name: z.string().min(2),
    legalName: z.string().min(2),
    taxId: z
      .string()
      .regex(/^\d{11}$/, "El CUIT/CUIL debe tener exactamente 11 dígitos numéricos."),
    country: z.string().min(2).default("Argentina"),
    province: z.string().min(2),
    city: z.string().min(2),
    timezone: z.string().min(2).default("America/Argentina/Buenos_Aires"),
    defaultCurrency: z.string().length(3).default("ARS"),
    address: z.string().optional(),
    website: optionalUrlSchema,
    logoUrl: optionalUrlSchema,
    size: z.string().optional(),
    mainPracticeAreas: z.array(z.string().min(2)).default([]),
    referralSource: z.string().optional()
  }),
  workspace: z.object({
    practiceAreaCodes: z.array(z.string().trim().min(1)).default([]),
    practiceAreas: z.array(z.string().min(2)).default([]),
    defaultRoleForInvites: roleCodeSchema.default("lawyer"),
    caseNumberingMode: caseNumberingModeSchema.default("manual"),
    documentStorageMode: documentStorageModeSchema.default("local")
  })
});

export class StartOnboardingDto extends createZodDto(startOnboardingSchema) {
  @ApiProperty({
    required: false,
    example: {
      fullName: "Mateo Alvarez",
      email: "mateo@estudio.com"
    }
  })
  owner?: z.infer<typeof startOnboardingSchema>["owner"];

  @ApiProperty({
    example: {
      name: "Estudio Alvarez",
      legalName: "Estudio Juridico Alvarez",
      taxId: "20123456789",
      country: "Argentina",
      province: "Tucuman",
      city: "San Miguel de Tucuman",
      timezone: "America/Argentina/Buenos_Aires",
      defaultCurrency: "ARS"
    }
  })
  tenant!: z.infer<typeof startOnboardingSchema>["tenant"];

  @ApiProperty({
    example: {
      practiceAreaCodes: ["laboral", "familia"],
      defaultRoleForInvites: "lawyer",
      caseNumberingMode: "manual",
      documentStorageMode: "local"
    }
  })
  workspace!: z.infer<typeof startOnboardingSchema>["workspace"];
}

export class OnboardingTokenDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: "Bearer" })
  tokenType!: "Bearer";
}

export class StartOnboardingResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty({ example: "owner" })
  role!: string;

  @ApiProperty({ type: OnboardingTokenDto })
  tokens!: OnboardingTokenDto;
}

export class OnboardingStatusDto {
  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  hasProfile!: boolean;

  @ApiProperty()
  hasSettings!: boolean;

  @ApiProperty()
  hasPracticeAreas!: boolean;

  @ApiProperty()
  hasInvitedTeam!: boolean;

  @ApiProperty()
  hasFirstClient!: boolean;

  @ApiProperty()
  hasFirstCase!: boolean;

  @ApiProperty()
  hasFirstDocument!: boolean;

  @ApiProperty({ type: [String] })
  missingSteps!: string[];
}
