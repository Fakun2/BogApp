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
import { LoginDto, CreateAccountDto } from "./auth.schemas";
import { JwtPayload } from "./auth.types";
import { RbacService } from "../rbac/rbac.service";

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

    if (!user || user.status !== "active") {
      throw new UnauthorizedException("Email o contraseña inválidos.");
    }

    const passwordMatches = await compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Email o contraseña inválidos.");
    }

    const memberships = await this.prisma.tenantMembership.findMany({
      where: {
        userId: user.id,
        status: "active",
        tenantId: input.tenantId
      },
      include: {
        role: true,
        tenant: true
      }
    });

    if (input.tenantId && memberships.length === 0) {
      throw new ForbiddenException("No tenés acceso activo a ese estudio.");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantAccess: memberships
        .filter((membership) => membership.tenant.status === "active")
        .map((membership) => ({
          tenantId: membership.tenantId,
          role: membership.role.code,
          permissions: this.rbacService.getPermissionsForRole(membership.role.code)
        }))
    };

    return {
      user: this.toAuthUser(user),
      tokens: await this.issueTokens(payload)
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET") ?? "dev-refresh-secret-change-me"
    });

    return this.issueTokens(payload);
  }

  async issueTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET") ?? "dev-refresh-secret-change-me",
      expiresIn: (this.config.get<string>("JWT_REFRESH_TTL") ?? "7d") as JwtSignOptions["expiresIn"]
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer"
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
}
