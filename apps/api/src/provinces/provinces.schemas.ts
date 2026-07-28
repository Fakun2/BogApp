import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CatalogPageInfoDto } from "../legal-catalogs/pagination.schemas";

export const listProvincesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(8),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(["name:asc", "name:desc"]).default("name:asc")
});

export class ListProvincesQueryDto extends createZodDto(listProvincesQuerySchema) {}

export class ProvinceDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "ar-jujuy" })
  code!: string;

  @ApiProperty({ example: "Jujuy" })
  name!: string;

  @ApiProperty({ nullable: true, type: String, example: "Jujuy" })
  province!: string | null;

  @ApiProperty({ example: "Argentina" })
  country!: string;

  @ApiProperty({ enum: ["manual", "center_forum"], example: "manual" })
  caseCatalogStrategy!: "manual" | "center_forum";

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: 100 })
  displayOrder!: number;
}

export class ProvincesListResponseDto {
  @ApiProperty({ type: [ProvinceDto] })
  items!: ProvinceDto[];

  @ApiProperty({ type: CatalogPageInfoDto })
  pageInfo!: CatalogPageInfoDto;
}

export type ListProvincesQuery = z.infer<typeof listProvincesQuerySchema>;
