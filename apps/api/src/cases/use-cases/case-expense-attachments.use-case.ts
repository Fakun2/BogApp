import { createHash, randomUUID } from "node:crypto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { ObjectStorageService } from "../../storage/object-storage.service";
import type { ListCaseExpenseAttachmentsQuery } from "../cases.schemas";

export type UploadedCaseExpenseAttachmentFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

const allowedAttachmentMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export const maxCaseExpenseAttachmentSizeBytes = 10 * 1024 * 1024;

@Injectable()
export class CaseExpenseAttachmentsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorageService
  ) {}

  async list(
    tenantId: string,
    caseId: string,
    expenseId: string,
    query: ListCaseExpenseAttachmentsQuery
  ) {
    await this.findTenantExpenseOrThrow(tenantId, caseId, expenseId);
    const cursor = decodeExpenseAttachmentsCursor(query.cursor);
    const attachments = await this.prisma.caseExpenseAttachment.findMany({
      where: {
        deletedAt: null,
        expenseId,
        caseId,
        tenantId,
        ...(cursor ? { OR: getExpenseAttachmentsCursorWhere(cursor) } : {})
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: query.limit + 1,
      select: caseExpenseAttachmentSelect
    });
    const pageItems = attachments.slice(0, query.limit);
    const lastItem = pageItems.at(-1);
    const hasNextPage = attachments.length > query.limit;

    return {
      items: pageItems.map(toCaseExpenseAttachmentDto),
      pageInfo: {
        limit: query.limit,
        offset: 0,
        nextCursor:
          hasNextPage && lastItem
            ? encodeExpenseAttachmentsCursor({ createdAt: lastItem.createdAt, id: lastItem.id })
            : null,
        hasNextPage,
        total: pageItems.length + (hasNextPage ? 1 : 0)
      }
    };
  }

  async create(
    tenantId: string,
    caseId: string,
    expenseId: string,
    uploadedByUserId: string,
    file?: UploadedCaseExpenseAttachmentFile
  ) {
    if (!file) {
      throw new BadRequestException("Selecciona un comprobante para subir.");
    }

    validateAttachmentFile(file);
    await this.findTenantExpenseOrThrow(tenantId, caseId, expenseId);

    const attachmentId = randomUUID();
    const objectKey = buildAttachmentObjectKey({
      attachmentId,
      caseId,
      expenseId,
      originalName: file.originalname,
      tenantId
    });
    const checksum = createHash("sha256").update(file.buffer).digest("hex");

    try {
      await this.storage.putObject({
        body: file.buffer,
        contentLength: file.size,
        contentType: file.mimetype,
        key: objectKey
      });

      const attachment = await this.prisma.caseExpenseAttachment.create({
        data: {
          bucket: this.storage.getBucket(),
          caseId,
          checksum,
          expenseId,
          id: attachmentId,
          mimeType: file.mimetype,
          objectKey,
          originalName: file.originalname,
          sizeBytes: file.size,
          storageProvider: this.storage.getProvider(),
          tenantId,
          uploadedByUserId
        },
        select: caseExpenseAttachmentSelect
      });

      return toCaseExpenseAttachmentDto(attachment);
    } catch (error) {
      await this.storage.deleteObject(objectKey).catch(() => undefined);
      throw error;
    }
  }

  async download(tenantId: string, caseId: string, expenseId: string, attachmentId: string) {
    const attachment = await this.findTenantAttachmentOrThrow(
      tenantId,
      caseId,
      expenseId,
      attachmentId
    );
    const object = await this.storage.getObject(attachment.objectKey);

    return {
      attachment: toCaseExpenseAttachmentDto(attachment),
      object
    };
  }

  async delete(tenantId: string, caseId: string, expenseId: string, attachmentId: string) {
    const attachment = await this.findTenantAttachmentOrThrow(
      tenantId,
      caseId,
      expenseId,
      attachmentId
    );

    await this.prisma.caseExpenseAttachment.update({
      where: { id: attachment.id },
      data: { deletedAt: new Date() }
    });
    await this.storage.deleteObject(attachment.objectKey).catch(() => undefined);

    return { status: "ok" as const };
  }

  private async findTenantExpenseOrThrow(tenantId: string, caseId: string, expenseId: string) {
    const expense = await this.prisma.caseExpense.findFirst({
      where: { caseId, id: expenseId, tenantId },
      select: { id: true }
    });

    if (!expense) {
      throw new NotFoundException("El gasto no existe en el expediente activo.");
    }

    return expense;
  }

  private async findTenantAttachmentOrThrow(
    tenantId: string,
    caseId: string,
    expenseId: string,
    attachmentId: string
  ) {
    const attachment = await this.prisma.caseExpenseAttachment.findFirst({
      where: { caseId, deletedAt: null, expenseId, id: attachmentId, tenantId },
      select: caseExpenseAttachmentWithObjectKeySelect
    });

    if (!attachment) {
      throw new NotFoundException("El comprobante no existe en el gasto activo.");
    }

    return attachment;
  }
}

const caseExpenseAttachmentSelect = {
  createdAt: true,
  id: true,
  mimeType: true,
  originalName: true,
  sizeBytes: true
} satisfies Prisma.CaseExpenseAttachmentSelect;

const caseExpenseAttachmentWithObjectKeySelect = {
  ...caseExpenseAttachmentSelect,
  objectKey: true
} satisfies Prisma.CaseExpenseAttachmentSelect;

type CaseExpenseAttachmentWithSelect = Prisma.CaseExpenseAttachmentGetPayload<{
  select: typeof caseExpenseAttachmentSelect;
}>;

type ExpenseAttachmentsCursor = {
  createdAt: Date;
  id: string;
};

export function toCaseExpenseAttachmentDto(item: CaseExpenseAttachmentWithSelect) {
  return {
    id: item.id,
    originalName: item.originalName,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    createdAt: item.createdAt.toISOString()
  };
}

function validateAttachmentFile(file: UploadedCaseExpenseAttachmentFile) {
  if (!allowedAttachmentMimeTypes.has(file.mimetype)) {
    throw new BadRequestException("El comprobante debe ser PDF, JPG, PNG o WebP.");
  }

  if (file.size > maxCaseExpenseAttachmentSizeBytes) {
    throw new BadRequestException("El comprobante no puede superar 10 MB.");
  }
}

function encodeExpenseAttachmentsCursor(cursor: ExpenseAttachmentsCursor) {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id
    })
  ).toString("base64url");
}

function decodeExpenseAttachmentsCursor(cursor?: string): ExpenseAttachmentsCursor | null {
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
    throw new BadRequestException("El cursor de comprobantes es invalido.");
  }
}

function getExpenseAttachmentsCursorWhere(
  cursor: ExpenseAttachmentsCursor
): Prisma.CaseExpenseAttachmentWhereInput[] {
  return [
    { createdAt: { lt: cursor.createdAt } },
    { createdAt: cursor.createdAt, id: { lt: cursor.id } }
  ];
}

function buildAttachmentObjectKey({
  attachmentId,
  caseId,
  expenseId,
  originalName,
  tenantId
}: {
  attachmentId: string;
  caseId: string;
  expenseId: string;
  originalName: string;
  tenantId: string;
}) {
  return [
    "tenants",
    tenantId,
    "cases",
    caseId,
    "expenses",
    expenseId,
    "attachments",
    attachmentId,
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

  return normalized || "comprobante";
}
