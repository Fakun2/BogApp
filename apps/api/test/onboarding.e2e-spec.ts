import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { ZodValidationPipe } from "nestjs-zod";
import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { OnboardingModule } from "../src/onboarding/onboarding.module";
import { PrismaService } from "../src/database/prisma.service";

type StoredUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: "active" | "inactive";
};

type StoredTenant = {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  status: "active";
};

type StoredRole = {
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
};

type StoredPracticeAreaTemplate = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  displayOrder: number;
};

class InMemoryPrismaService {
  private users = new Map<string, StoredUser>();
  private tenants = new Map<string, StoredTenant>();
  private roles = new Map<string, StoredRole>();
  private currencies = new Map<string, { code: string; symbol: string; active: boolean }>();
  private practiceAreaTemplates = new Map<string, StoredPracticeAreaTemplate>();
  private permissions = new Map<
    string,
    { id: string; code: string; resource: string; action: string }
  >();
  private rolePermissions = new Set<string>();
  private tenantProfiles: unknown[] = [];
  private tenantSettingsRecords: unknown[] = [];
  private practiceAreas: unknown[] = [];
  private tenantMemberships: unknown[] = [];
  private sequence = 1;

  readonly user = {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      if (where.id) {
        return this.users.get(where.id) ?? null;
      }

      return [...this.users.values()].find((user) => user.email === where.email) ?? null;
    },
    update: async ({
      where,
      data
    }: {
      where: { id: string };
      data: { fullName: string; email: string };
    }) => {
      const user = this.users.get(where.id);
      assert.ok(user, "Expected stored user to exist before update.");

      const updated = { ...user, ...data };
      this.users.delete(user.id);
      this.users.set(updated.id, updated);
      return updated;
    }
  };

  readonly currency = {
    upsert: async ({
      where,
      update,
      create
    }: {
      where: { code: string };
      update: { active: boolean };
      create: { code: string; symbol: string; active: boolean };
    }) => {
      const existing = this.currencies.get(where.code);
      const saved = existing ? { ...existing, ...update } : create;
      this.currencies.set(where.code, saved);
      return saved;
    }
  };

  readonly permission = {
    upsert: async ({
      where,
      update,
      create
    }: {
      where: { code: string };
      update: { resource: string; action: string };
      create: { code: string; resource: string; action: string };
    }) => {
      const existing = this.permissions.get(where.code);
      const saved = existing ? { ...existing, ...update } : { id: this.nextId(), ...create };
      this.permissions.set(where.code, saved);
      return saved;
    },
    findUniqueOrThrow: async ({ where }: { where: { code: string } }) => {
      const permission = this.permissions.get(where.code);
      assert.ok(permission, `Expected permission ${where.code} to exist.`);
      return permission;
    }
  };

  readonly role = {
    upsert: async ({
      where,
      update,
      create
    }: {
      where: { code: string };
      update: { name: string; isSystem: boolean };
      create: { code: string; name: string; isSystem: boolean };
    }) => {
      const existing = this.roles.get(where.code);
      const saved = existing ? { ...existing, ...update } : { id: this.nextId(), ...create };
      this.roles.set(where.code, saved);
      return saved;
    },
    findUniqueOrThrow: async ({ where }: { where: { code: string } }) => {
      const role = this.roles.get(where.code);
      assert.ok(role, `Expected role ${where.code} to exist.`);
      return role;
    }
  };

  readonly rolePermission = {
    upsert: async ({
      where,
      create
    }: {
      where: { roleId_permissionId: { roleId: string; permissionId: string } };
      update: Record<string, never>;
      create: { roleId: string; permissionId: string };
    }) => {
      const key = `${where.roleId_permissionId.roleId}:${where.roleId_permissionId.permissionId}`;
      this.rolePermissions.add(key);
      return create;
    }
  };

  readonly tenant = {
    create: async ({ data }: { data: Omit<StoredTenant, "id"> }) => {
      const tenant = { id: this.nextId(), ...data };
      this.tenants.set(tenant.id, tenant);
      return tenant;
    }
  };

  readonly tenantProfile = {
    create: async ({ data }: { data: unknown }) => {
      this.tenantProfiles.push(data);
      return data;
    }
  };

  readonly tenantSettings = {
    create: async ({ data }: { data: unknown }) => {
      this.tenantSettingsRecords.push(data);
      return data;
    }
  };

  readonly practiceArea = {
    createMany: async ({ data }: { data: unknown[]; skipDuplicates: boolean }) => {
      this.practiceAreas.push(...data);
      return { count: data.length };
    }
  };

  readonly practiceAreaTemplate = {
    findMany: async ({ where }: { where: { active: boolean; code: { in: string[] } } }) => {
      return [...this.practiceAreaTemplates.values()].filter(
        (template) => template.active === where.active && where.code.in.includes(template.code)
      );
    }
  };

  readonly tenantMembership = {
    create: async ({ data }: { data: unknown }) => {
      this.tenantMemberships.push(data);
      return data;
    }
  };

  async $transaction<T>(callback: (tx: this) => Promise<T>) {
    return callback(this);
  }

  seedUser(user: StoredUser) {
    this.users.set(user.id, user);
  }

  countUsers() {
    return this.users.size;
  }

  countMemberships() {
    return this.tenantMemberships.length;
  }

  countPracticeAreas() {
    return this.practiceAreas.length;
  }

  getPracticeAreas() {
    return this.practiceAreas;
  }

  reset() {
    this.users.clear();
    this.tenants.clear();
    this.roles.clear();
    this.currencies.clear();
    this.practiceAreaTemplates.clear();
    this.permissions.clear();
    this.rolePermissions.clear();
    this.tenantProfiles = [];
    this.tenantSettingsRecords = [];
    this.practiceAreas = [];
    this.tenantMemberships = [];
    this.sequence = 1;
  }

  seedPracticeAreaTemplates() {
    this.practiceAreaTemplates.set("laboral", {
      id: "10000000-0000-0000-0000-000000000001",
      code: "laboral",
      name: "Laboral",
      description: null,
      active: true,
      displayOrder: 10
    });
    this.practiceAreaTemplates.set("familia", {
      id: "10000000-0000-0000-0000-000000000002",
      code: "familia",
      name: "Familia",
      description: null,
      active: true,
      displayOrder: 20
    });
  }

  private nextId() {
    return `00000000-0000-0000-0000-${String(this.sequence++).padStart(12, "0")}`;
  }
}

describe("Onboarding endpoints (e2e)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: InMemoryPrismaService;

  const user: StoredUser = {
    id: "00000000-0000-0000-0000-000000000999",
    email: "mateo@estudio.com",
    fullName: "Mateo Alvarez",
    phone: null,
    status: "active"
  };

  before(async () => {
    prisma = new InMemoryPrismaService();

    const moduleRef = await Test.createTestingModule({
      imports: [OnboardingModule]
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ZodValidationPipe());
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  beforeEach(() => {
    prisma.reset();
    prisma.seedUser(user);
    prisma.seedPracticeAreaTemplates();
  });

  after(async () => {
    await app.close();
  });

  it("requires an authenticated account before starting onboarding", async () => {
    await request(app.getHttpServer())
      .post("/api/onboarding/start")
      .send(makePayload())
      .expect(401);
  });

  it("creates a tenant and owner membership for the authenticated user", async () => {
    const accessToken = jwt.sign({
      sub: user.id,
      email: user.email,
      tenantAccess: []
    });

    const response = await request(app.getHttpServer())
      .post("/api/onboarding/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(makePayload())
      .expect(201);

    assert.equal(response.body.userId, user.id);
    assert.equal(response.body.role, "owner");
    assert.equal(typeof response.body.tenantId, "string");
    assert.equal(typeof response.body.tokens.accessToken, "string");
    assert.equal(typeof response.body.tokens.refreshToken, "string");
    assert.equal(prisma.countUsers(), 1);
    assert.equal(prisma.countMemberships(), 1);
    assert.equal(prisma.countPracticeAreas(), 2);
    assert.deepEqual(prisma.getPracticeAreas(), [
      {
        tenantId: response.body.tenantId,
        templateId: "10000000-0000-0000-0000-000000000001",
        name: "Laboral",
        description: null
      },
      {
        tenantId: response.body.tenantId,
        templateId: "10000000-0000-0000-0000-000000000002",
        name: "Familia",
        description: null
      }
    ]);
  });

  it("updates owner account fields when they are sent with onboarding", async () => {
    const accessToken = jwt.sign({
      sub: user.id,
      email: user.email,
      tenantAccess: []
    });

    const response = await request(app.getHttpServer())
      .post("/api/onboarding/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        ...makePayload(),
        owner: {
          fullName: "Mateo Legal",
          email: "legal@estudio.com"
        }
      })
      .expect(201);

    assert.equal(response.body.userId, user.id);
    assert.equal(prisma.countUsers(), 1);
  });

  it("allows onboarding without practice areas", async () => {
    const accessToken = jwt.sign({
      sub: user.id,
      email: user.email,
      tenantAccess: []
    });

    const response = await request(app.getHttpServer())
      .post("/api/onboarding/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        ...makePayload(),
        workspace: {
          ...makePayload().workspace,
          practiceAreaCodes: []
        }
      })
      .expect(201);

    assert.equal(response.body.userId, user.id);
    assert.equal(prisma.countMemberships(), 1);
    assert.equal(prisma.countPracticeAreas(), 0);
  });

  it("rejects invalid practice area template codes", async () => {
    const accessToken = jwt.sign({
      sub: user.id,
      email: user.email,
      tenantAccess: []
    });

    await request(app.getHttpServer())
      .post("/api/onboarding/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        ...makePayload(),
        workspace: {
          ...makePayload().workspace,
          practiceAreaCodes: ["laboral", "fantasma"]
        }
      })
      .expect(400);
  });
});

function makePayload() {
  return {
    tenant: {
      name: "Estudio Mateo Alvarez",
      legalName: "Estudio Mateo Alvarez",
      taxId: "20123456789",
      country: "Argentina",
      province: "Tucuman",
      city: "San Miguel de Tucuman",
      timezone: "America/Argentina/Buenos_Aires",
      defaultCurrency: "ARS"
    },
    workspace: {
      practiceAreaCodes: ["laboral", "familia"],
      practiceAreas: [],
      defaultRoleForInvites: "lawyer",
      caseNumberingMode: "manual",
      documentStorageMode: "local"
    }
  };
}
