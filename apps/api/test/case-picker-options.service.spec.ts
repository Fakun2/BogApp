import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PrismaService } from "../src/database/prisma.service";
import { CasesService } from "../src/cases/cases.service";

const tenantId = "11111111-1111-4111-8111-111111111111";

describe("CasesService listPickerOptions", () => {
  it("returns a lightweight case option page with a minimal select", async () => {
    const findManyCalls: unknown[] = [];
    const service = makeService({
      findManyCalls,
      rows: [
        makeCaseOption("00000000-0000-4000-8000-000000000003", "EXP-003/2026", "Diaz c/ Paz"),
        makeCaseOption(
          "00000000-0000-4000-8000-000000000002",
          "EXP-002/2026",
          "Perez c/ Gomez",
          "Danos"
        ),
        makeCaseOption("00000000-0000-4000-8000-000000000001", "EXP-001/2026", "Acme SA")
      ]
    });

    const response = await service.listPickerOptions(tenantId, {
      limit: 2,
      offset: 0,
      search: "danos"
    });

    assert.equal(response.items.length, 2);
    assert.deepEqual(Object.keys(response.items[0] ?? {}).sort(), [
      "caption",
      "caseNumber",
      "id",
      "subject"
    ]);
    assert.equal(response.items[1]?.subject, "Danos");
    assert.equal(response.pageInfo.hasNextPage, true);
    assert.ok(response.pageInfo.nextCursor);

    const call = findManyCalls[0] as {
      select: Record<string, boolean>;
      take: number;
      where: { AND: Array<{ OR: unknown[] }>; tenantId: string };
    };
    assert.equal(call.take, 3);
    assert.equal(call.where.tenantId, tenantId);
    assert.deepEqual(Object.keys(call.select).sort(), [
      "caption",
      "caseNumber",
      "createdAt",
      "id",
      "subject"
    ]);
    assert.equal(call.where.AND[0]?.OR.length, 3);
  });

  it("uses the lightweight cursor on the next page", async () => {
    const findManyCalls: unknown[] = [];
    const service = makeService({
      findManyCalls,
      rows: [
        makeCaseOption("00000000-0000-4000-8000-000000000003", "EXP-003/2026", "Diaz c/ Paz"),
        makeCaseOption("00000000-0000-4000-8000-000000000002", "EXP-002/2026", "Perez c/ Gomez"),
        makeCaseOption("00000000-0000-4000-8000-000000000001", "EXP-001/2026", "Acme SA")
      ]
    });

    const firstPage = await service.listPickerOptions(tenantId, { limit: 2, offset: 0 });
    assert.ok(firstPage.pageInfo.nextCursor);

    await service.listPickerOptions(tenantId, {
      cursor: firstPage.pageInfo.nextCursor ?? undefined,
      limit: 2,
      offset: 2
    });

    const secondCall = findManyCalls[1] as {
      where: { AND: Array<{ OR: unknown[] }>; tenantId: string };
    };
    assert.equal(secondCall.where.tenantId, tenantId);
    assert.equal(secondCall.where.AND[0]?.OR.length, 2);
  });
});

function makeCaseOption(
  id: string,
  caseNumber: string,
  caption: string,
  subject: string | null = null
) {
  return {
    caption,
    caseNumber,
    createdAt: new Date(
      `2026-08-${id.endsWith("3") ? "03" : id.endsWith("2") ? "02" : "01"}T00:00:00.000Z`
    ),
    id,
    subject
  };
}

function makeService({ findManyCalls, rows }: { findManyCalls: unknown[]; rows: unknown[] }) {
  const prisma = {
    case: {
      findMany: async (args: unknown) => {
        findManyCalls.push(args);
        return rows;
      }
    }
  } as unknown as PrismaService;

  return new CasesService(
    prisma,
    undefined as never,
    undefined as never,
    undefined as never,
    undefined as never,
    undefined as never,
    undefined as never
  );
}
