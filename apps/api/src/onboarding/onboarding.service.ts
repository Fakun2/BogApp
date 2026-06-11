import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { hash } from "bcryptjs";
import { PrismaService } from "../database/prisma.service";
import { AuthService } from "../auth/auth.service";
import { JwtPayload } from "../auth/auth.types";
import { RBAC_PERMISSIONS, RBAC_ROLES } from "../rbac/rbac.constants";
import { RbacService } from "../rbac/rbac.service";
import { StartOnboardingDto } from "./onboarding.schemas";

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly rbacService: RbacService
  ) {}

  async start(input: StartOnboardingDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.owner.email.toLowerCase() }
    });

    if (existingUser) {
      throw new ConflictException("Ya existe un usuario con ese email.");
    }

    const passwordHash = await hash(input.owner.password, 12);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.currency.upsert({
        where: { code: input.tenant.defaultCurrency },
        update: { active: true },
        create: {
          code: input.tenant.defaultCurrency,
          symbol: input.tenant.defaultCurrency === "ARS" ? "$" : input.tenant.defaultCurrency,
          active: true
        }
      });

      for (const permission of RBAC_PERMISSIONS) {
        await tx.permission.upsert({
          where: { code: permission.code },
          update: {
            resource: permission.resource,
            action: permission.action
          },
          create: {
            code: permission.code,
            resource: permission.resource,
            action: permission.action
          }
        });
      }

      for (const role of RBAC_ROLES) {
        const savedRole = await tx.role.upsert({
          where: { code: role.code },
          update: {
            name: role.name,
            isSystem: true
          },
          create: {
            code: role.code,
            name: role.name,
            isSystem: true
          }
        });

        for (const permissionCode of role.permissions) {
          const savedPermission = await tx.permission.findUniqueOrThrow({
            where: { code: permissionCode }
          });

          await tx.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: savedRole.id,
                permissionId: savedPermission.id
              }
            },
            update: {},
            create: {
              roleId: savedRole.id,
              permissionId: savedPermission.id
            }
          });
        }
      }

      const ownerRole = await tx.role.findUniqueOrThrow({
        where: { code: "owner" }
      });

      const user = await tx.user.create({
        data: {
          fullName: input.owner.fullName,
          email: input.owner.email.toLowerCase(),
          passwordHash,
          phone: input.owner.phone,
          status: "active"
        }
      });

      const tenant = await tx.tenant.create({
        data: {
          name: input.tenant.name,
          legalName: input.tenant.legalName,
          taxId: input.tenant.taxId,
          status: "active"
        }
      });

      await tx.tenantProfile.create({
        data: {
          tenantId: tenant.id,
          country: input.tenant.country,
          province: input.tenant.province,
          city: input.tenant.city,
          address: input.tenant.address,
          website: input.tenant.website,
          logoUrl: input.tenant.logoUrl,
          size: input.tenant.size,
          mainPracticeAreas: input.tenant.mainPracticeAreas,
          referralSource: input.tenant.referralSource
        }
      });

      await tx.tenantSettings.create({
        data: {
          tenantId: tenant.id,
          timezone: input.tenant.timezone,
          defaultCurrencyCode: input.tenant.defaultCurrency,
          defaultRoleForInvites: input.workspace.defaultRoleForInvites,
          caseNumberingMode: input.workspace.caseNumberingMode,
          documentStorageMode: input.workspace.documentStorageMode
        }
      });

      await tx.practiceArea.createMany({
        data: input.workspace.practiceAreas.map((name) => ({
          tenantId: tenant.id,
          name
        })),
        skipDuplicates: true
      });

      await tx.tenantMembership.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          roleId: ownerRole.id,
          status: "active",
          joinedAt: new Date()
        }
      });

      return { user, tenant };
    });

    const payload: JwtPayload = {
      sub: result.user.id,
      email: result.user.email,
      tenantAccess: [
        {
          tenantId: result.tenant.id,
          role: "owner",
          permissions: this.rbacService.getPermissionsForRole("owner")
        }
      ]
    };

    return {
      userId: result.user.id,
      tenantId: result.tenant.id,
      role: "owner",
      tokens: await this.authService.issueTokens(payload)
    };
  }

  async status(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        profile: true,
        settings: true,
        practiceAreas: true,
        memberships: true
      }
    });

    if (!tenant) {
      throw new NotFoundException("Tenant no encontrado.");
    }

    const hasProfile = Boolean(tenant.profile);
    const hasSettings = Boolean(tenant.settings);
    const hasPracticeAreas = tenant.practiceAreas.length > 0;
    const hasInvitedTeam = tenant.memberships.some((membership) => membership.status === "invited");
    const missingSteps = [
      !hasProfile && "profile",
      !hasSettings && "settings",
      !hasPracticeAreas && "practice_areas",
      !hasInvitedTeam && "team_invites",
      "first_client",
      "first_case",
      "first_document"
    ].filter(Boolean) as string[];

    return {
      tenantId,
      hasProfile,
      hasSettings,
      hasPracticeAreas,
      hasInvitedTeam,
      hasFirstClient: false,
      hasFirstCase: false,
      hasFirstDocument: false,
      missingSteps
    };
  }
}
