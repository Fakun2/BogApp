import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { CaseDocumentsUseCase } from "../src/cases/use-cases/case-documents.use-case";
import { PrismaService } from "../src/database/prisma.service";
import { ObjectStorageService } from "../src/storage/object-storage.service";

const tenantA = "11111111-1111-4111-8111-111111111111";
const tenantB = "22222222-2222-4222-8222-222222222222";
const caseA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const categoryA = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const userId = "99999999-9999-4999-8999-999999999999";

describe("CaseDocumentsUseCase", () => {
  it("uploads a tenant-scoped document and stores private object metadata", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    const document = await useCase.create(
      tenantA,
      caseA,
      userId,
      { categoryId: categoryA, notes: "Demanda inicial" },
      makeFile()
    );

    assert.equal(document.caseId, caseA);
    assert.equal(document.category?.id, categoryA);
    assert.equal(document.notes, "Demanda inicial");
    assert.equal(storage.puts.length, 1);
    assert.equal(prisma.createdDocuments.length, 1);
    assert.match(
      prisma.createdDocuments[0].objectKey,
      /^tenants\/1111.*\/cases\/aaaa.*\/documents\//
    );
    assert.equal(prisma.createdDocuments[0].bucket, "bogaap-test");
    assert.equal(prisma.createdDocuments[0].storageProvider, "minio");
  });

  it("rejects unsupported document types before writing storage or metadata", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    await assert.rejects(
      () =>
        useCase.create(
          tenantA,
          caseA,
          userId,
          {},
          {
            ...makeFile(),
            mimetype: "application/x-msdownload"
          }
        ),
      BadRequestException
    );
    assert.equal(storage.puts.length, 0);
    assert.equal(prisma.createdDocuments.length, 0);
  });

  it("rejects exact duplicate active documents in the same case before writing storage", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    await useCase.create(tenantA, caseA, userId, {}, makeFile());

    await assert.rejects(
      () => useCase.create(tenantA, caseA, userId, {}, makeFile()),
      ConflictException
    );
    assert.equal(storage.puts.length, 1);
    assert.equal(prisma.createdDocuments.length, 1);
  });

  it("allows reuploading an exact duplicate after the previous document is deleted", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    const firstDocument = await useCase.create(tenantA, caseA, userId, {}, makeFile());
    await useCase.delete(tenantA, caseA, firstDocument.id);
    const secondDocument = await useCase.create(tenantA, caseA, userId, {}, makeFile());

    assert.notEqual(secondDocument.id, firstDocument.id);
    assert.equal(storage.puts.length, 2);
    assert.equal(prisma.createdDocuments.length, 2);
  });

  it("filters list and preview by active tenant and case", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    await useCase.create(tenantA, caseA, userId, {}, makeFile());
    const listed = await useCase.list(tenantA, caseA, { limit: 8 });

    assert.equal(listed.items.length, 1);
    await assert.rejects(
      () => useCase.readObject(tenantB, caseA, listed.items[0].id),
      NotFoundException
    );
  });

  it("soft deletes metadata and removes the object best-effort", async () => {
    const prisma = makePrisma();
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    const document = await useCase.create(tenantA, caseA, userId, {}, makeFile());
    const result = await useCase.delete(tenantA, caseA, document.id);

    assert.deepEqual(result, { status: "ok" });
    assert.equal(prisma.documents[0].deletedAt instanceof Date, true);
    assert.equal(storage.deletes.length, 1);
  });

  it("removes the uploaded object when metadata creation fails", async () => {
    const prisma = makePrisma({ failCreate: true });
    const storage = makeStorage();
    const useCase = new CaseDocumentsUseCase(
      prisma as unknown as PrismaService,
      storage as unknown as ObjectStorageService
    );

    await assert.rejects(() => useCase.create(tenantA, caseA, userId, {}, makeFile()));
    assert.equal(storage.puts.length, 1);
    assert.equal(storage.deletes.length, 1);
  });
});

function makePrisma({ failCreate = false }: { failCreate?: boolean } = {}) {
  const state = {
    cases: [
      { id: caseA, tenantId: tenantA },
      { id: caseA, tenantId: tenantB }
    ],
    categories: [
      {
        active: true,
        description: null,
        displayOrder: 0,
        id: categoryA,
        name: "Escritos",
        tenantId: tenantA
      }
    ],
    createdDocuments: [] as DocumentWriteData[],
    documents: [] as DocumentRecord[]
  };

  return {
    get createdDocuments() {
      return state.createdDocuments;
    },
    get documents() {
      return state.documents;
    },
    case: {
      findFirst: async ({ where }: { where: { id: string; tenantId: string } }) =>
        state.cases.find(
          (caseItem) => caseItem.id === where.id && caseItem.tenantId === where.tenantId
        ) ?? null
    },
    documentCategory: {
      findFirst: async ({ where }: { where: { active: boolean; id: string; tenantId: string } }) =>
        state.categories.find(
          (category) =>
            category.active === where.active &&
            category.id === where.id &&
            category.tenantId === where.tenantId
        ) ?? null,
      findMany: async () => state.categories
    },
    document: {
      create: async ({ data }: { data: DocumentWriteData }) => {
        state.createdDocuments.push(data);
        if (failCreate) {
          throw new Error("metadata write failed");
        }

        const record: DocumentRecord = {
          ...data,
          category: data.categoryId
            ? { description: null, id: data.categoryId, name: "Escritos" }
            : null,
          createdAt: new Date("2026-08-18T12:00:00.000Z"),
          deletedAt: null
        };
        state.documents.push(record);
        return record;
      },
      findFirst: async ({ where }: { where: DocumentWhere }) =>
        state.documents.find((document) => matchesDocument(document, where)) ?? null,
      findMany: async ({ take, where }: { take: number; where: DocumentWhere }) =>
        state.documents.filter((document) => matchesDocument(document, where)).slice(0, take),
      update: async ({ data, where }: { data: { deletedAt: Date }; where: { id: string } }) => {
        const document = state.documents.find((item) => item.id === where.id);
        if (!document) {
          throw new Error("document not found");
        }

        document.deletedAt = data.deletedAt;
        return document;
      }
    }
  };
}

function makeStorage() {
  const state = {
    deletes: [] as string[],
    puts: [] as Array<{ key: string }>
  };

  return {
    deletes: state.deletes,
    puts: state.puts,
    deleteObject: async (key: string) => {
      state.deletes.push(key);
      return undefined;
    },
    getBucket: () => "bogaap-test",
    getObject: async () => ({
      body: Buffer.from("document"),
      contentLength: 8,
      contentType: "application/pdf"
    }),
    getProvider: () => "minio",
    putObject: async (input: { key: string }) => {
      state.puts.push(input);
      return undefined;
    }
  };
}

function makeFile() {
  return {
    buffer: Buffer.from("document"),
    mimetype: "application/pdf",
    originalname: "demanda inicial.pdf",
    size: 8
  };
}

type DocumentWriteData = {
  bucket: string;
  caseId: string;
  categoryId?: string;
  checksum: string;
  id: string;
  mimeType: string;
  notes?: string;
  objectKey: string;
  originalName: string;
  sizeBytes: number;
  storageProvider: string;
  tenantId: string;
  uploadedByUserId: string;
};

type DocumentRecord = DocumentWriteData & {
  category: { description: string | null; id: string; name: string } | null;
  createdAt: Date;
  deletedAt: Date | null;
};

type DocumentWhere = {
  caseId: string;
  checksum?: string;
  deletedAt: null;
  id?: string;
  tenantId: string;
};

function matchesDocument(document: DocumentRecord, where: DocumentWhere) {
  return (
    document.caseId === where.caseId &&
    (!where.checksum || document.checksum === where.checksum) &&
    document.deletedAt === where.deletedAt &&
    (!where.id || document.id === where.id) &&
    document.tenantId === where.tenantId
  );
}
