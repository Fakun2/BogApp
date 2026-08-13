import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CatalogPageInfoDto } from "../legal-catalogs/pagination.schemas";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

export const listJudicialCentersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  provinceId: optionalTrimmedString.pipe(z.string().uuid().optional()),
  sort: z.enum(["name:asc", "name:desc"]).default("name:asc")
});

export class ListJudicialCentersQueryDto extends createZodDto(listJudicialCentersQuerySchema) {}

export class JudicialCenterProvinceDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-tucuman" })
  code!: string;

  @ApiProperty({ example: "Tucuman" })
  name!: string;
}

export class JudicialCenterDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-tucuman-centro-judicial-capital" })
  code!: string;

  @ApiProperty({ example: "Centro Judicial Capital" })
  name!: string;

  @ApiProperty({ format: "uuid" })
  provinceId!: string;

  @ApiProperty({ type: JudicialCenterProvinceDto })
  province!: JudicialCenterProvinceDto;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: 10 })
  displayOrder!: number;
}

export class JudicialCentersListResponseDto {
  @ApiProperty({ type: [JudicialCenterDto] })
  items!: JudicialCenterDto[];

  @ApiProperty({ type: CatalogPageInfoDto })
  pageInfo!: CatalogPageInfoDto;
}

export type ListJudicialCentersQuery = z.infer<typeof listJudicialCentersQuerySchema>;
