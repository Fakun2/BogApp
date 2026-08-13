import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZodValidationPipe } from "nestjs-zod";
import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { AuthModule } from "../src/auth/auth.module";
import { PrismaService } from "../src/database/prisma.service";

type StoredUser = {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  phone: string | null;
  status: "active" | "inactive";
  lastLoginAt: Date | null;
};

class InMemoryPrismaService {
  private users = new Map<string, StoredUser>();
  private userSequence = 1;

  readonly user = {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) {
        return this.users.get(where.email) ?? null;
      }

      return [...this.users.values()].find((user) => user.id === where.id) ?? null;
    },
    create: async ({
      data
    }: {
      data: {
        fullName: string;
        email: string;
        passwordHash: string;
        phone?: string;
        status: "active" | "inactive";
      };
    }) => {
      const user: StoredUser = {
        id: `00000000-0000-0000-0000-${String(this.userSequence++).padStart(12, "0")}`,
        email: data.email,
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        phone: data.phone ?? null,
        status: data.status,
        lastLoginAt: null
      };

      this.users.set(user.email, user);
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: { lastLoginAt: Date } }) => {
      const user = [...this.users.values()].find((candidate) => candidate.id === where.id);
      assert.ok(user, "Expected stored user to exist before update.");

      user.lastLoginAt = data.lastLoginAt;
      return user;
    }
  };

  readonly tenantMembership = {
    findMany: async () => []
  };

  reset() {
    this.users.clear();
    this.userSequence = 1;
  }
}

describe("Auth endpoints (e2e)", () => {
  let app: INestApplication;
  let prisma: InMemoryPrismaService;

  before(async () => {
    prisma = new InMemoryPrismaService();

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule]
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ZodValidationPipe());

    await app.init();
  });

  beforeEach(() => {
    prisma.reset();
  });

  after(async () => {
    await app.close();
  });

  it("creates a global user account without exposing the password hash", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/create-account")
      .send({
        fullName: "Mateo Alvarez",
        email: "MATEO@ESTUDIO.COM",
        password: "password123",
        phone: "+54 9 11 5555-5555"
      })
      .expect(201);

    assert.equal(response.body.user.email, "mateo@estudio.com");
    assert.equal(response.body.user.fullName, "Mateo Alvarez");
    assert.equal(response.body.user.status, "active");
    assert.equal(response.body.user.passwordHash, undefined);
  });

  it("rejects invalid create-account email and password with Zod validation", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/create-account")
      .send({
        fullName: "M",
        email: "no-es-email",
        password: "short"
      })
      .expect(400);
  });

  it("logs in a valid account and returns JWT tokens", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/create-account")
      .send({
        fullName: "Mateo Alvarez",
        email: "mateo@estudio.com",
        password: "password123"
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({
        email: "mateo@estudio.com",
        password: "password123"
      })
      .expect(200);

    assert.equal(response.body.user.email, "mateo@estudio.com");
    assert.equal(response.body.tokens.tokenType, "Bearer");
    assert.equal(typeof response.body.tokens.accessToken, "string");
    assert.equal(typeof response.body.tokens.refreshToken, "string");
  });

  it("rejects invalid login email and password with Zod validation", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({
        email: "wrong",
        password: "sin-numero"
      })
      .expect(400);
  });

  it("rejects wrong credentials", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/create-account")
      .send({
        fullName: "Mateo Alvarez",
        email: "mateo@estudio.com",
        password: "password123"
      })
      .expect(201);

    await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({
        email: "mateo@estudio.com",
        password: "password999"
      })
      .expect(401);
  });
});
