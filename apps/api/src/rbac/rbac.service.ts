import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import { createRoleCode } from "./role-code";
import { ADMIN_ACCESS_PERMISSION, RBAC_PERMISSIONS, RBAC_ROLES } from "./rbac.constants";
import { RoleEventsService, roleEvents } from "./role-events";
import type { CreateRoleInput, UpdateRoleInput } from "./rbac.schemas";

@Injectable()
export class RbacService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleEventsService: RoleEventsService
  ) {}

  onModuleInit() {
    this.roleEventsService.onCleanup(roleEvents.deactivated, (payload) => {
      void this.cleanupMembershipRoles(payload.tenantId, payload.roleId);
    });
    this.roleEventsService.onCleanup(roleEvents.deleted, (payload) => {
      void this.cleanupMembershipRoles(payload.tenantId, payload.roleId);
    });
  }

  async listPermissions() {
    return this.prisma.permission.findMany({
      select: {
        action: true,
        code: true,
        resource: true
      },
      orderBy: [{ resource: "asc" }, { action: "asc" }]
    });
  }

  async listRoles(tenantId: string) {
    const roles = await this.prisma.role.findMany({
      where: {
        OR: [{ isSystem: true, tenantId: null }, { tenantId }]
      },
      select: roleSelect,
      orderBy: [{ isSystem: "desc" }, { name: "asc" }]
    });
    return roles.map(toRoleDto);
  }

  async createRole(tenantId: string, input: CreateRoleInput) {
    await this.assertUniqueRoleName(tenantId, input.name);
    const permissions = await this.resolvePermissions(
      normalizePermissionsForHierarchy(input.permissions, input.hierarchyLevel)
    );
    const code = await this.createUniqueRoleCode(tenantId, input.name);

    try {
      const role = await this.prisma.role.create({
        data: {
          active: input.active,
          code,
          description: input.description,
          hierarchyLevel: input.hierarchyLevel,
          isSystem: false,
          name: input.name,
          tenantId,
          rolePermissions: {
            createMany: {
              data: permissions.map((permission) => ({
                id: randomUUID(),
                permissionId: permission.id
              })),
              skipDuplicates: true
            }
          }
        },
        select: roleSelect
      });

      await this.ensureAdminAccessForRole(role.id);

      return toRoleDto(role);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException("Ya existe un rol con ese nombre.");
      }

      throw error;
    }
  }

  async updateRole(tenantId: string, roleId: string, input: UpdateRoleInput) {
    const currentRole = await this.findTenantRoleOrThrow(tenantId, roleId);

    if (input.name) {
      await this.assertUniqueRoleName(tenantId, input.name, roleId);
    }

    const nextHierarchyLevel = input.hierarchyLevel ?? currentRole.hierarchyLevel;
    const permissions = input.permissions
      ? await this.resolvePermissions(
          normalizePermissionsForHierarchy(input.permissions, nextHierarchyLevel)
        )
      : undefined;

    const role = await this.prisma.$transaction(async (tx) => {
      if (permissions) {
        await tx.rolePermission.deleteMany({ where: { roleId } });
        await tx.rolePermission.createMany({
          data: permissions.map((permission) => ({
            id: randomUUID(),
            permissionId: permission.id,
            roleId
          })),
          skipDuplicates: true
        });
      }

      return tx.role.update({
        where: { id: roleId },
        data: {
          ...(input.active === undefined ? {} : { active: input.active }),
          ...(input.description === undefined ? {} : { description: input.description }),
          ...(input.hierarchyLevel === undefined ? {} : { hierarchyLevel: input.hierarchyLevel }),
          ...(input.name === undefined ? {} : { name: input.name })
        },
        select: roleSelect
      });
    });

    if (currentRole.active && input.active === false) {
      this.roleEventsService.emitCleanup(roleEvents.deactivated, { roleId, tenantId });
    }

    await this.ensureAdminAccessForRole(roleId);

    return toRoleDto(role);
  }

  async deleteRole(tenantId: string, roleId: string) {
    await this.findTenantRoleOrThrow(tenantId, roleId);
    await this.prisma.role.delete({ where: { id: roleId } });
    this.roleEventsService.emitCleanup(roleEvents.deleted, { roleId, tenantId });

    return { deleted: true };
  }

  async cleanupMembershipRoles(tenantId: string, roleId: string) {
    await this.prisma.tenantMembership.updateMany({
      where: { roleId, tenantId },
      data: { roleId: null }
    });
  }

  async getPermissionsForRole(roleCode: string) {
    if (roleCode === "owner") {
      return RBAC_PERMISSIONS.map((permission) => permission.code);
    }

    if (!canFindRoleByCode(this.prisma)) {
      return normalizePermissionsForHierarchy(
        [...(RBAC_ROLES.find((role) => role.code === roleCode)?.permissions ?? [])],
        roleCode === "admin" ? 2 : 1
      );
    }

    const role = await this.prisma.role.findUnique({
      where: { code: roleCode },
      select: {
        rolePermissions: {
          select: {
            permission: {
              select: { code: true }
            }
          }
        }
      }
    });

    return role
      ? normalizePermissionsForHierarchy(
          role.rolePermissions.map(({ permission }) => permission.code),
          await this.getRoleHierarchyLevelByCode(roleCode)
        )
      : [];
  }

  private async ensureAdminAccessForRole(roleId: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { code: ADMIN_ACCESS_PERMISSION },
      select: { id: true }
    });

    if (!permission) {
      throw new BadRequestException("No existe el permiso base de acceso al panel.");
    }

    await this.prisma.rolePermission.createMany({
      data: [{ id: randomUUID(), permissionId: permission.id, roleId }],
      skipDuplicates: true
    });
  }

  private async assertUniqueRoleName(tenantId: string, name: string, excludeRoleId?: string) {
    const existingRole = await this.prisma.role.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: "insensitive" },
        ...(excludeRoleId ? { id: { not: excludeRoleId } } : {})
      },
      select: { id: true }
    });

    if (existingRole) {
      throw new ConflictException("Ya existe un rol con ese nombre en este estudio.");
    }
  }

  private async resolvePermissions(permissionCodes: string[]) {
    const uniquePermissionCodes = [...new Set(permissionCodes)];
    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: uniquePermissionCodes } },
      select: { id: true }
    });

    if (permissions.length !== uniquePermissionCodes.length) {
      throw new BadRequestException("Uno o mas permisos seleccionados no existen.");
    }

    return permissions;
  }

  private async findTenantRoleOrThrow(tenantId: string, roleId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, tenantId },
      select: { active: true, hierarchyLevel: true, id: true, isSystem: true }
    });

    if (!role) {
      throw new NotFoundException("No se encontro el rol.");
    }

    if (role.isSystem) {
      throw new BadRequestException("Los roles del sistema no se pueden modificar.");
    }

    return role;
  }

  private async createUniqueRoleCode(tenantId: string, name: string) {
    const baseCode = createRoleCode(tenantId, name);
    let candidate = baseCode;
    let suffix = 2;

    while (
      await this.prisma.role.findUnique({ where: { code: candidate }, select: { id: true } })
    ) {
      candidate = `${baseCode}_${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  private async getRoleHierarchyLevelByCode(roleCode: string) {
    const role = await this.prisma.role.findUnique({
      where: { code: roleCode },
      select: { hierarchyLevel: true }
    });

    return role?.hierarchyLevel ?? 1;
  }
}

const roleSelect = {
  active: true,
  code: true,
  description: true,
  hierarchyLevel: true,
  id: true,
  isSystem: true,
  name: true,
  tenantId: true,
  rolePermissions: {
    select: {
      permission: {
        select: { code: true }
      }
    }
  }
};

type RoleWithPermissions = {
  active: boolean;
  code: string;
  description: string | null;
  hierarchyLevel: number;
  id: string;
  isSystem: boolean;
  name: string;
  tenantId: string | null;
  rolePermissions: Array<{ permission: { code: string } }>;
};

function toRoleDto(role: RoleWithPermissions) {
  return {
    active: role.active,
    code: role.code,
    description: role.description ?? getSystemRoleDescription(role.code),
    hierarchyLevel: role.hierarchyLevel,
    id: role.id,
    isSystem: role.isSystem,
    name: role.name,
    tenantId: role.tenantId,
    permissions: normalizePermissionsForHierarchy(
      role.rolePermissions.map(({ permission }) => permission.code),
      role.hierarchyLevel
    ).sort((left, right) => left.localeCompare(right, "es"))
  };
}

function getSystemRoleDescription(roleCode: string) {
  return RBAC_ROLES.find((role) => role.code === roleCode)?.description ?? null;
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function canFindRoleByCode(prisma: PrismaService) {
  return typeof prisma.role.findUnique === "function";
}

function withAdminAccess(permissionCodes: string[]) {
  return [...new Set([ADMIN_ACCESS_PERMISSION, ...permissionCodes])];
}

function normalizePermissionsForHierarchy(permissionCodes: string[], hierarchyLevel: number) {
  if (hierarchyLevel === 3) {
    return withoutOwnerOnlyPermissions(
      withAdminAccess(RBAC_PERMISSIONS.map((permission) => permission.code))
    );
  }

  const basePermissions = withoutOwnerOnlyPermissions(withAdminAccess(permissionCodes));

  if (hierarchyLevel === 2) {
    return uniquePermissionCodes([
      ...basePermissions.filter((permissionCode) => !isBlockedModeratePermission(permissionCode)),
      "staff:read",
      "staff:update",
      "finance:read",
      "finance:update"
    ]);
  }

  return uniquePermissionCodes(
    basePermissions.filter(
      (permissionCode) =>
        permissionCode === ADMIN_ACCESS_PERMISSION || isAllowedOperationalPermission(permissionCode)
    )
  );
}

function isAllowedOperationalPermission(permissionCode: string) {
  return (
    permissionCode === "clients:read" ||
    permissionCode === "clients:create" ||
    permissionCode === "clients:update" ||
    permissionCode === "cases:read" ||
    permissionCode === "cases:create" ||
    permissionCode === "cases:update" ||
    permissionCode === "cases:delete" ||
    permissionCode === "forums:read" ||
    permissionCode === "provinces:read" ||
    permissionCode === "tasks:read" ||
    permissionCode === "tasks:create" ||
    permissionCode === "tasks:update" ||
    permissionCode === "tasks:delete" ||
    permissionCode === "expenses:read" ||
    permissionCode === "expenses:create" ||
    permissionCode === "expenses:update" ||
    permissionCode === "expenses:delete" ||
    permissionCode === "hearings:read" ||
    permissionCode === "hearings:create" ||
    permissionCode === "hearings:update" ||
    permissionCode === "hearings:delete" ||
    permissionCode === "documents:read" ||
    permissionCode === "documents:write"
  );
}

function isBlockedModeratePermission(permissionCode: string) {
  return (
    permissionCode === "staff:create" ||
    permissionCode === "staff:delete" ||
    permissionCode === "staff:manage" ||
    permissionCode === "finance:create" ||
    permissionCode === "finance:delete"
  );
}

function withoutOwnerOnlyPermissions(permissionCodes: string[]) {
  return permissionCodes.filter((permissionCode) => !permissionCode.startsWith("roles:"));
}

function uniquePermissionCodes(permissionCodes: string[]) {
  return [...new Set(permissionCodes)];
}
