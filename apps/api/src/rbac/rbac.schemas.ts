import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  resource!: string;

  @ApiProperty()
  action!: string;
}

export class RoleDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [String] })
  permissions!: string[];
}
