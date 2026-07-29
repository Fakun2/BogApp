import { ApiProperty } from "@nestjs/swagger";

export class CatalogPageInfoDto {
  @ApiProperty({ example: 8 })
  limit!: number;

  @ApiProperty({ example: 0 })
  offset!: number;

  @ApiProperty({ example: 25 })
  total!: number;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;
}

export function toCatalogPageInfo({
  limit,
  offset,
  total
}: {
  limit: number;
  offset: number;
  total: number;
}) {
  return {
    hasNextPage: offset + limit < total,
    hasPreviousPage: offset > 0,
    limit,
    offset,
    total
  };
}
