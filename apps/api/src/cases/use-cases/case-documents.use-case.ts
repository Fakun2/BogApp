import { createHash, randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { DocumentStorageCleanupJobStatus, Prisma } from "@prisma/client";
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ObjectStorageService } from "../../storage/object-storage.service";
import type { ListCaseDocumentsQuery, ListDocumentCategoriesQuery } from "../cases.schemas";

export type UploadedCaseDocumentFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

export type CreateCaseDocumentMetadata = {
  categoryId?: string;
  notes?: string;
};

const allowedDocumentMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

const previewableDocumentMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

const duplicateDocumentMessage = "Este archivo ya fue cargado en el expediente.";
const activeDocumentChecksumIndexName = "documents_tenant_case_checksum_active_key";
const cleanupIntervalMs = 30_000;
const maxCleanupAttempts = 5;

export const maxCaseDocumentSizeBytes = 25 * 1024 * 1024;

@Injectable()
export class CaseDocumentsUseCase implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CaseDocumentsUseCase.name);
  private isCleanupRunning = false;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorageService
  ) {}

  onModuleInit() {
    this.scheduleNextCleanupRun(1_000);
  }

  onModuleDestroy() {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  async list(tenantId: string, caseId: string, query: ListCaseDocumentsQuery) {
    await this.findTenantCaseOrThrow(tenantId, caseId);
    const cursor = decodeDocumentsCursor(query.cursor);
    const documents = await this.prisma.document.findMany({
      where: {
        caseId,
        deletedAt: null,
        tenantId,
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(cursor ? { OR: getDocumentsCursorWhere(cursor) } : {})
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: query.limit + 1,
      select: caseDocumentSelect
    });
    const pageItems = documents.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = documents.length > query.limit;

    return {
      items: pageItems.map(toCaseDocumentDto),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeDocumentsCursor({ createdAt: lastItem.createdAt, id: lastItem.id })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  async listCategories(tenantId: string, query: ListDocumentCategoriesQuery) {
    const cursor = decodeCategoriesCursor(query.cursor);
    const categories = await this.prisma.documentCategory.findMany({
      where: {
        tenantId,
        ...(query.active === undefined ? {} : { active: query.active }),
        ...(cursor ? { OR: getCategoriesCursorWhere(cursor) } : {})
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { id: "asc" }],
      take: query.limit + 1,
      select: documentCategorySelect
    });
    const pageItems = categories.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = categories.length > query.limit;

    return {
      items: pageItems.map(toDocumentCategoryDto),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeCategoriesCursor({
                displayOrder: lastItem.displayOrder,
                id: lastItem.id,
                name: lastItem.name
              })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  async create(
    tenantId: string,
    caseId: string,
    uploadedByUserId: string,
    metadata: CreateCaseDocumentMetadata,
    file?: UploadedCaseDocumentFile
  ) {
    if (!file) {
      throw new BadRequestException("Selecciona un documento para subir.");
    }

    validateDocumentFile(file);
    const normalizedMetadata = await this.validateUploadContext(
      tenantId,
      caseId,
      uploadedByUserId,
      metadata
    );
    const documentId = randomUUID();
    const objectKey = buildDocumentObjectKey({
      caseId,
      documentId,
      originalName: file.originalname,
      tenantId
    });
    const checksum = createHash("sha256").update(file.buffer).digest("hex");
    const existingDocument = await this.prisma.document.findFirst({
      where: { caseId, checksum, deletedAt: null, tenantId },
      select: { id: true }
    });

    if (existingDocument) {
      throw new ConflictException(duplicateDocumentMessage);
    }

    try {
      await this.storage.putObject({
        body: file.buffer,
        contentLength: file.size,
        contentType: file.mimetype,
        key: objectKey
      });

      const document = await this.prisma.document.create({
        data: {
          bucket: this.storage.getBucket(),
          caseId,
          categoryId: normalizedMetadata.categoryId,
          checksum,
          id: documentId,
          mimeType: file.mimetype,
          notes: normalizedMetadata.notes,
          objectKey,
          originalName: file.originalname,
          sizeBytes: file.size,
          storageProvider: this.storage.getProvider(),
          tenantId,
          uploadedByUserId
        },
        select: caseDocumentSelect
      });

      return toCaseDocumentDto(document);
    } catch (error) {
      await this.deleteUploadedObjectOrEnqueueCleanup({
        bucket: this.storage.getBucket(),
        objectKey,
        reason: "metadata_create_failed",
        storageProvider: this.storage.getProvider(),
        tenantId
      });
      if (isUniqueDocumentChecksumError(error)) {
        throw new ConflictException(duplicateDocumentMessage);
      }
      throw error;
    }
  }

  async readObject(tenantId: string, caseId: string, documentId: string) {
    const document = await this.findTenantDocumentOrThrow(tenantId, caseId, documentId);
    const object = await this.storage.getObject(document.objectKey);

    return {
      document: toCaseDocumentDto(document),
      object
    };
  }

  async delete(tenantId: string, caseId: string, documentId: string) {
    const document = await this.findTenantDocumentOrThrow(tenantId, caseId, documentId);

    await this.prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id: document.id },
        data: { deletedAt: new Date() }
      });
      await enqueueDocumentStorageCleanupJob(tx, {
        bucket: document.bucket,
        documentId: document.id,
        objectKey: document.objectKey,
        reason: "document_deleted",
        storageProvider: document.storageProvider,
        tenantId
      });
    });
    await this.processDueCleanupJobs(1);

    return { status: "ok" as const };
  }

  async processDueCleanupJobs(limit = 10) {
    if (this.isCleanupRunning) {
      return { processed: 0 };
    }

    this.isCleanupRunning = true;

    try {
      const jobs = await this.prisma.documentStorageCleanupJob.findMany({
        where: {
          nextRunAt: { lte: new Date() },
          status: {
            in: [DocumentStorageCleanupJobStatus.pending, DocumentStorageCleanupJobStatus.failed]
          }
        },
        orderBy: [{ nextRunAt: "asc" }, { createdAt: "asc" }],
        take: limit
      });

      for (const job of jobs) {
        await this.processCleanupJob(job.id);
      }

      return { processed: jobs.length };
    } finally {
      this.isCleanupRunning = false;
    }
  }

  private async validateUploadContext(
    tenantId: string,
    caseId: string,
    uploadedByUserId: string,
    metadata: CreateCaseDocumentMetadata
  ) {
    const categoryId = normalizeOptionalUuid(
      metadata.categoryId,
      "La categoria seleccionada no es valida."
    );
    const notes = normalizeOptionalString(
      metadata.notes,
      500,
      "Las notas no pueden superar 500 caracteres."
    );

    await this.prisma.$transaction(async (tx) => {
      const [caseItem, membership, category] = await Promise.all([
        tx.case.findFirst({
          where: { id: caseId, tenantId },
          select: { id: true }
        }),
        tx.tenantMembership.findFirst({
          where: { status: "active", tenantId, userId: uploadedByUserId },
          select: { id: true }
        }),
        categoryId
          ? tx.documentCategory.findFirst({
              where: { active: true, id: categoryId, tenantId },
              select: { id: true }
            })
          : Promise.resolve(null)
      ]);

      if (!caseItem) {
        throw new NotFoundException("El expediente no existe en el estudio activo.");
      }

      if (!membership) {
        throw new BadRequestException("El usuario no tiene una membresia activa en el estudio.");
      }

      if (categoryId && !category) {
        throw new BadRequestException("La categoria seleccionada no pertenece al estudio activo.");
      }
    });

    return { categoryId, notes };
  }

  private async findTenantCaseOrThrow(tenantId: string, caseId: string) {
    const caseItem = await this.prisma.case.findFirst({
      where: { id: caseId, tenantId },
      select: { id: true }
    });

    if (!caseItem) {
      throw new NotFoundException("El expediente no existe en el estudio activo.");
    }

    return caseItem;
  }

  private async findTenantDocumentOrThrow(tenantId: string, caseId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { caseId, deletedAt: null, id: documentId, tenantId },
      select: caseDocumentWithObjectKeySelect
    });

    if (!document) {
      throw new NotFoundException("El documento no existe en el expediente activo.");
    }

    return document;
  }

  private scheduleNextCleanupRun(delayMs = cleanupIntervalMs) {
    this.cleanupTimer = setTimeout(() => {
      void this.runCleanupSoon();
    }, delayMs);
    this.cleanupTimer.unref?.();
  }

  private async runCleanupSoon() {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    try {
      await this.processDueCleanupJobs();
    } catch (error) {
      this.logger.error("Document storage cleanup failed.", error);
    } finally {
      this.scheduleNextCleanupRun();
    }
  }

  private async processCleanupJob(jobId: string) {
    const job = await this.prisma.documentStorageCleanupJob.findUnique({
      where: { id: jobId }
    });

    if (
      !job ||
      (job.status !== DocumentStorageCleanupJobStatus.pending &&
        job.status !== DocumentStorageCleanupJobStatus.failed)
    ) {
      return;
    }

    await this.prisma.documentStorageCleanupJob.update({
      where: { id: job.id },
      data: { status: DocumentStorageCleanupJobStatus.processing }
    });

    try {
      await this.storage.deleteObject(job.objectKey);
      await this.prisma.documentStorageCleanupJob.update({
        where: { id: job.id },
        data: {
          completedAt: new Date(),
          lastError: null,
          status: DocumentStorageCleanupJobStatus.completed
        }
      });
    } catch (error) {
      const attempts = job.attempts + 1;
      const retryDelayMinutes = Math.min(60, 2 ** attempts);

      await this.prisma.documentStorageCleanupJob.update({
        where: { id: job.id },
        data: {
          attempts,
          lastError: getStorageCleanupErrorMessage(error),
          nextRunAt: addMinutes(new Date(), retryDelayMinutes),
          status:
            attempts >= maxCleanupAttempts
              ? DocumentStorageCleanupJobStatus.failed
              : DocumentStorageCleanupJobStatus.pending
        }
      });
    }
  }

  private async deleteUploadedObjectOrEnqueueCleanup(input: DocumentStorageCleanupJobInput) {
    try {
      await this.storage.deleteObject(input.objectKey);
    } catch (error) {
      await enqueueDocumentStorageCleanupJob(this.prisma, {
        ...input,
        lastError: getStorageCleanupErrorMessage(error)
      });
      await this.processDueCleanupJobs(1);
    }
  }
}

const documentCategorySelect = {
  description: true,
  displayOrder: true,
  id: true,
  name: true
} satisfies Prisma.DocumentCategorySelect;

const caseDocumentSelect = {
  caseId: true,
  category: {
    select: {
      description: true,
      id: true,
      name: true
    }
  },
  createdAt: true,
  id: true,
  mimeType: true,
  notes: true,
  originalName: true,
  sizeBytes: true
} satisfies Prisma.DocumentSelect;

const caseDocumentWithObjectKeySelect = {
  ...caseDocumentSelect,
  bucket: true,
  objectKey: true,
  storageProvider: true
} satisfies Prisma.DocumentSelect;

type DocumentStorageCleanupJobInput = {
  bucket: string;
  documentId?: string;
  lastError?: string;
  objectKey: string;
  reason: "document_deleted" | "metadata_create_failed";
  storageProvider: string;
  tenantId: string;
};

async function enqueueDocumentStorageCleanupJob(
  prisma: PrismaService | Prisma.TransactionClient,
  input: DocumentStorageCleanupJobInput
) {
  await prisma.documentStorageCleanupJob.upsert({
    where: {
      storageProvider_bucket_objectKey: {
        bucket: input.bucket,
        objectKey: input.objectKey,
        storageProvider: input.storageProvider
      }
    },
    update: {
      attempts: 0,
      completedAt: null,
      documentId: input.documentId,
      lastError: input.lastError ?? null,
      nextRunAt: new Date(),
      reason: input.reason,
      status: DocumentStorageCleanupJobStatus.pending,
      tenantId: input.tenantId
    },
    create: {
      bucket: input.bucket,
      documentId: input.documentId,
      lastError: input.lastError,
      objectKey: input.objectKey,
      reason: input.reason,
      storageProvider: input.storageProvider,
      tenantId: input.tenantId
    }
  });
}

function getStorageCleanupErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Error desconocido";
  return message.slice(0, 500);
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

type CaseDocumentWithSelect = Prisma.DocumentGetPayload<{
  select: typeof caseDocumentSelect;
}>;

type DocumentCategoryWithSelect = Prisma.DocumentCategoryGetPayload<{
  select: typeof documentCategorySelect;
}>;

type DocumentsCursor = {
  createdAt: Date;
  id: string;
};

type CategoriesCursor = {
  displayOrder: number;
  id: string;
  name: string;
};

export function toCaseDocumentDto(item: CaseDocumentWithSelect) {
  return {
    id: item.id,
    caseId: item.caseId,
    category: item.category ? toDocumentCategoryDto(item.category) : null,
    originalName: item.originalName,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    notes: item.notes,
    createdAt: item.createdAt.toISOString()
  };
}

export function toDocumentCategoryDto(
  item: Pick<DocumentCategoryWithSelect, "description" | "id" | "name">
) {
  return {
    id: item.id,
    name: item.name,
    description: item.description
  };
}

export function isPreviewableDocumentMimeType(mimeType: string) {
  return previewableDocumentMimeTypes.has(mimeType);
}

function validateDocumentFile(file: UploadedCaseDocumentFile) {
  if (!allowedDocumentMimeTypes.has(file.mimetype)) {
    throw new BadRequestException("El documento debe ser PDF, imagen, Word, Excel o TXT.");
  }

  if (file.size > maxCaseDocumentSizeBytes) {
    throw new BadRequestException("El documento no puede superar 25 MB.");
  }
}

function isUniqueDocumentChecksumError(error: unknown) {
  const target = error instanceof Prisma.PrismaClientKnownRequestError ? error.meta?.target : null;

  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    ((typeof target === "string" && target === activeDocumentChecksumIndexName) ||
      (Array.isArray(target) &&
        (target.includes(activeDocumentChecksumIndexName) ||
          ["tenant_id", "case_id", "checksum"].every((field) => target.includes(field)))))
  );
}

function normalizeOptionalUuid(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)) {
    throw new BadRequestException(message);
  }

  return trimmed;
}

function normalizeOptionalString(value: unknown, maxLength: number, message: string) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length > maxLength) {
    throw new BadRequestException(message);
  }

  return trimmed;
}

function encodeDocumentsCursor(cursor: DocumentsCursor) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id
    })
  ).toString("base64url");
}

function decodeDocumentsCursor(cursor?: string): DocumentsCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      createdAt?: string;
      id?: string;
    };

    if (!parsed.createdAt || !parsed.id) {
      return null;
    }

    const createdAt = new Date(parsed.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return { createdAt, id: parsed.id };
  } catch {
    throw new BadRequestException("El cursor de documentos es invalido.");
  }
}

function getDocumentsCursorWhere(cursor: DocumentsCursor): Prisma.DocumentWhereInput[] {
  return [
    { createdAt: { lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, id: { lt: cursor.id } }
  ];
}

function encodeCategoriesCursor(cursor: CategoriesCursor) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeCategoriesCursor(cursor?: string): CategoriesCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      displayOrder?: number;
      id?: string;
      name?: string;
    };

    if (
      typeof parsed.displayOrder !== "number" ||
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return {
      displayOrder: parsed.displayOrder,
      id: parsed.id,
      name: parsed.name
    };
  } catch {
    throw new BadRequestException("El cursor de categorias es invalido.");
  }
}

function getCategoriesCursorWhere(cursor: CategoriesCursor): Prisma.DocumentCategoryWhereInput[] {
  return [
    { displayOrder: { gt: cursor.displayOrder } },
    { displayOrder: cursor.displayOrder, name: { gt: cursor.name } },
    { displayOrder: cursor.displayOrder, name: cursor.name, id: { gt: cursor.id } }
  ];
}

function buildDocumentObjectKey({
  caseId,
  documentId,
  originalName,
  tenantId
}: {
  caseId: string;
  documentId: string;
  originalName: string;
  tenantId: string;
}) {
  return [
    "tenants",
    tenantId,
    "cases",
    caseId,
    "documents",
    documentId,
    toSafeFilename(originalName)
  ].join("/");
}

function toSafeFilename(filename: string) {
  const normalized = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return normalized || "documento";
}
