import { SetMetadata } from "@nestjs/common";
import { PermissionCode } from "../rbac/rbac.constants";

export const PERMISSIONS_KEY = "permissions";
export const Permissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
