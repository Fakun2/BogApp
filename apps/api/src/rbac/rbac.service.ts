import { Injectable } from "@nestjs/common";
import { RBAC_PERMISSIONS, RBAC_ROLES } from "./rbac.constants";

@Injectable()
export class RbacService {
  listPermissions() {
    return RBAC_PERMISSIONS;
  }

  listRoles() {
    return RBAC_ROLES.map((role) => ({
      ...role,
      permissions: [...role.permissions]
    }));
  }

  getPermissionsForRole(roleCode: string) {
    return [...(RBAC_ROLES.find((role) => role.code === roleCode)?.permissions ?? [])];
  }
}
