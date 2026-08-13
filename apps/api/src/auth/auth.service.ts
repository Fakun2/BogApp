import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { PrismaService } from "../database/prisma.service";
import { RbacService } from "../rbac/rbac.service";
import { CreateAccountDto, LoginDto } from "./auth.schemas";
import { JwtPayload } from "./auth.types";
import { getRequiredJwtConfig } from "./jwt-config";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly rbacService: RbacService
  ) {}

  async createAccount(input: CreateAccountDto) {
    const email = input.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException("Ya existe una cuenta con ese email.");
    }

    const user = await this.prisma.user.create({
      data: {
        fullName: input.fullName,
        email,
        passwordHash: await hash(input.password, 12),
        phone: input.phone,
        status: "active"
      }
    });

    return {
      user: this.toAuthUser(user)
    };
  }

  async login(input: LoginDto) {
    const email = input.email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException("Email o contrasena invalidos.");
    }

    if (user.status !== "active") {
      throw new ForbiddenException("Esta cuenta se encuentra suspendida.");
    }

    const passwordMatches = await compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Email o contrasena invalidos.");
    }

    const memberships = await this.prisma.tenantMembership.findMany({
      where: {
        userId: user.id,
        ...(input.tenantId ? { tenantId: input.tenantId } : {})
      },
      include: {
        role: true,
        tenant: true
      }
    });

    if (input.tenantId && memberships.length === 0) {
      throw new ForbiddenException("No tenes acceso activo a ese estudio.");
    }

    const activeTenantMemberships = memberships.filter(
      (membership) => membership.tenant.status === "active" && membership.status === "active"
    );
    const hasSuspendedMembership = memberships.some(
      (membership) => membership.tenant.status === "active" && membership.status === "suspended"
    );

    if (activeTenantMemberships.length === 0 && hasSuspendedMembership) {
      throw new ForbiddenException("Esta cuenta se encuentra suspendida para este estudio.");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return {
      user: this.toAuthUser(user),
      tokens: await this.issueTokens(await this.buildJwtPayload(user.id))
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: getRequiredJwtConfig(this.config, "JWT_REFRESH_SECRET")
    });

    await this.assertSessionIsValid(payload);

    return this.issueTokens(await this.buildJwtPayload(payload.sub));
  }

  async issueTokens(payload: JwtPayload) {
    const tokenPayload = this.toTokenPayload(payload);
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: getRequiredJwtConfig(this.config, "JWT_REFRESH_SECRET"),
      expiresIn: getRequiredJwtConfig(this.config, "JWT_REFRESH_TTL") as JwtSignOptions["expiresIn"]
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer"
    };
  }

  private toTokenPayload(payload: JwtPayload): JwtPayload {
    return {
      sub: payload.sub,
      email: payload.email,
      sessionVersion: payload.sessionVersion,
      tenantAccess: payload.tenantAccess
    };
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    status: string;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status
    };
  }

  private async buildJwtPayload(userId: string): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        id: true,
        memberships: {
          where: {
            status: "active",
            tenant: { status: "active" }
          },
          include: {
            role: true
          }
        },
        sessionVersion: true
      }
    });

    if (!user) {
      throw new UnauthorizedException("Sesion invalida.");
    }

    const tenantAccess = await Promise.all(
      user.memberships.map(async (membership) => ({
        tenantId: membership.tenantId,
        role: membership.role?.code ?? null,
        permissions: membership.role
          ? await this.rbacService.getPermissionsForRole(membership.role.code)
          : []
      }))
    );

    return {
      sub: user.id,
      email: user.email,
      sessionVersion: user.sessionVersion,
      tenantAccess
    };
  }

  private async assertSessionIsValid(payload: JwtPayload) {
    const user = await this.getUserSessionState(payload.sub);

    if (
      !user ||
      user.status !== "active" ||
      user.sessionVersion !== payload.sessionVersion
    ) {
      throw new UnauthorizedException("Sesion invalida.");
    }
  }

  private async getUserSessionVersion(userId: string) {
    const [user] = await this.prisma.$queryRaw<Array<{ sessionVersion: number }>>`
      SELECT "session_version" AS "sessionVersion"
      FROM "users"
      WHERE "id" = ${userId}::uuid
      LIMIT 1
    `;

    return user?.sessionVersion ?? 0;
  }

  private async getUserSessionState(userId: string) {
    const [user] = await this.prisma.$queryRaw<Array<{ sessionVersion: number; status: string }>>`
      SELECT "session_version" AS "sessionVersion", "status"
      FROM "users"
      WHERE "id" = ${userId}::uuid
      LIMIT 1
    `;

    return user ?? null;
  }
}
