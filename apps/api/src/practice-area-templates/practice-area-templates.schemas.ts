import { ApiProperty } from "@nestjs/swagger";

export class PracticeAreaTemplateDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "laboral" })
  code!: string;

  @ApiProperty({ example: "Laboral" })
  name!: string;

  @ApiProperty({ required: false, nullable: true })
  description!: string | null;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: 10 })
  displayOrder!: number;
}
