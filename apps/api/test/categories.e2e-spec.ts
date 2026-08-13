import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { CategoriesService } from "../src/categories/categories.service";

const now = new Date("2026-08-12T12:00:00.000Z");

type MockGlobalCategory = {
  active: boolean;
  code: string;
  createdAt: Date;
  id: string;
  kind: string;
  name: string;
  updatedAt: Date;
};

type MockTenantCategory = {
  active: boolean;
  createdAt: Date;
  id: string;
  kind: string;
  name: string;
  tenantId: string;
  updatedAt: Date;
};

describe("CategoriesService", () => {
  it("combines global categories and categories from the active tenant only", async () => {
    const service = new CategoriesService(
      createPrismaMock({
        globalItems: [
          createGlobalCategory({ code: "pago-de-cliente", kind: "income", name: "Pago de cliente" })
        ],
        tenantItems: [
          createTenantCategory({ name: "Honorarios custom", tenantId: "tenant-a" })
        ],
        tenantId: "tenant-a"
      }) as never
    );

    const result = await service.list("tenant-a", {
      limit: 12,
      sortBy: "name",
      sortDirection: "asc"
    });

    assert.deepEqual(
      result.items.map((category) => ({
        name: category.name,
        origin: category.origin
      })),
      [
        { name: "Honorarios custom", origin: "tenant" },
        { name: "Pago de cliente", origin: "global" }
      ]
    );
    assert.equal(result.metrics.global, 1);
    assert.equal(result.metrics.tenant, 1);
    assert.equal(result.metrics.active, 2);
  });

  it("rejects duplicate tenant category names case-insensitively", async () => {
    const service = new CategoriesService(
      createPrismaMock({
        duplicateTenantCategoryId: "tenant-category-1",
        tenantId: "tenant-a"
      }) as never
    );

    await assert.rejects(
      () => service.create("tenant-a", { active: true, kind: "income", name: "Honorarios" }),
      ConflictException
    );
  });

  it("rejects mutations for global categories", async () => {
    const service = new CategoriesService(
      createPrismaMock({
        globalCategoryById: createGlobalCategory({ id: "global-category-1" }),
        tenantId: "tenant-a"
      }) as never
    );

    await assert.rejects(
      () =>
        service.update("tenant-a", "global-category-1", {
          active: true,
          kind: "expense",
          name: "No permitido"
        }),
      BadRequestException
    );
  });

  it("does not allow deleting categories from another tenant", async () => {
    const service = new CategoriesService(createPrismaMock({ tenantId: "tenant-a" }) as never);

    await assert.rejects(
      () => service.delete("tenant-a", "other-tenant-category"),
      NotFoundException
    );
  });
});

function createPrismaMock({
  duplicateTenantCategoryId,
  globalCategoryById = null,
  globalItems = [],
  tenantId,
  tenantItems = []
}: {
  duplicateTenantCategoryId?: string;
  globalCategoryById?: MockGlobalCategory | null;
  globalItems?: MockGlobalCategory[];
  tenantId: string;
  tenantItems?: MockTenantCategory[];
}) {
  return {
    $queryRaw: async () =>
      [
        ...globalItems.map((category) => ({
          active: category.active,
          code: category.code,
          createdAt: category.createdAt,
          id: category.id,
          kind: category.kind,
          name: category.name,
          origin: "global",
          updatedAt: category.updatedAt
        })),
        ...tenantItems
          .filter((category) => category.tenantId === tenantId)
          .map((category) => ({
            active: category.active,
            code: null,
            createdAt: category.createdAt,
            id: category.id,
            kind: category.kind,
            name: category.name,
            origin: "tenant",
            updatedAt: category.updatedAt
          }))
      ].sort((left, right) => left.name.localeCompare(right.name, "es")),
    globalFinanceCategory: {
      count: async ({ where }: { where?: { active?: boolean } }) =>
        where?.active === true
          ? globalItems.filter((category) => category.active).length
          : globalItems.length,
      findMany: async () => globalItems,
      findUnique: async () => globalCategoryById
    },
    tenantFinanceCategory: {
      count: async ({ where }: { where?: { active?: boolean; tenantId?: string } }) =>
        tenantItems.filter(
          (category) =>
            category.tenantId === where?.tenantId &&
            (where.active === undefined || category.active === where.active)
        ).length,
      create: async ({ data }: { data: { active: boolean; kind: string; name: string } }) =>
        createTenantCategory({ ...data, tenantId }),
      findFirst: async ({ where }: { where?: { id?: unknown; tenantId?: string } }) => {
        if (duplicateTenantCategoryId) {
          return { id: duplicateTenantCategoryId };
        }

        if (typeof where?.id === "string") {
          return tenantItems.find(
            (category) => category.id === where.id && category.tenantId === where.tenantId
          );
        }

        return null;
      },
      findMany: async ({ where }: { where?: { tenantId?: string } }) =>
        tenantItems.filter((category) => category.tenantId === where?.tenantId),
      update: async ({ data, where }: { data: { active?: boolean; kind?: string; name?: string }; where: { id: string } }) => {
        const category = tenantItems.find((item) => item.id === where.id) ?? createTenantCategory({ tenantId });
        return { ...category, ...data, updatedAt: now };
      }
    }
  };
}

function createGlobalCategory(overrides: Partial<MockGlobalCategory> = {}): MockGlobalCategory {
  return {
    active: true,
    code: "sin-categoria",
    createdAt: now,
    id: "global-category",
    kind: "both",
    name: "Sin categoria",
    updatedAt: now,
    ...overrides
  };
}

function createTenantCategory(overrides: Partial<MockTenantCategory> = {}): MockTenantCategory {
  return {
    active: true,
    createdAt: now,
    id: "tenant-category",
    kind: "both",
    name: "Categoria tenant",
    tenantId: "tenant-a",
    updatedAt: now,
    ...overrides
  };
}
