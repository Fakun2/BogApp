import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DocumentsService, isPreviewableDocumentMimeType, maxDocumentSizeBytes } from "../../documents/documents.service";
import type { CreateCaseDocumentInput, ListCaseDocumentsQuery, ListDocumentCategoriesQuery } from "../cases.schemas";

export type UploadedCaseDocumentFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

export const maxCaseDocumentSizeBytes = maxDocumentSizeBytes;

@Injectable()
export class CaseDocumentsUseCase {
  constructor(private readonly documentsService: DocumentsService) {}

  async list(tenantId: string, caseId: string, query: ListCaseDocumentsQuery) {
    return this.documentsService.listCaseDocuments(tenantId, caseId, query);
  }

  async listCategories(tenantId: string, query: ListDocumentCategoriesQuery) {
    return this.documentsService.listCategories(tenantId, query);
  }

  async create(
    tenantId: string,
    caseId: string,
    uploadedByUserId: string,
    metadata: CreateCaseDocumentInput,
    file?: UploadedCaseDocumentFile
  ) {
    return this.documentsService.createCaseDocument(
      tenantId,
      caseId,
      uploadedByUserId,
      metadata,
      file
    );
  }

  async readObject(tenantId: string, caseId: string, documentId: string) {
    return this.documentsService.readCaseDocumentObject(tenantId, caseId, documentId);
  }

  async delete(tenantId: string, caseId: string, documentId: string) {
    return this.documentsService.deleteCaseDocument(tenantId, caseId, documentId);
  }

  async enqueueCleanupForCaseDeletion(
    tx: Prisma.TransactionClient,
    tenantId: string,
    caseId: string
  ) {
    return this.documentsService.enqueueCleanupForCaseDeletion(tx, tenantId, caseId);
  }

  async processDueCleanupJobs(limit?: number) {
    return this.documentsService.processDueCleanupJobs(limit);
  }
}

export { isPreviewableDocumentMimeType };
