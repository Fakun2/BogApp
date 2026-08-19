CREATE TYPE "DocumentStorageCleanupJobStatus" AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TYPE "DocumentStorageCleanupJobReason" AS ENUM (
  'document_deleted',
  'metadata_create_failed'
);

CREATE TABLE "document_storage_cleanup_jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "document_id" UUID,
  "storage_provider" TEXT NOT NULL,
  "bucket" TEXT NOT NULL,
  "object_key" TEXT NOT NULL,
  "reason" "DocumentStorageCleanupJobReason" NOT NULL,
  "status" "DocumentStorageCleanupJobStatus" NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "next_run_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_error" TEXT,
  "completed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "document_storage_cleanup_jobs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_storage_cleanup_jobs_storage_provider_bucket_object_key_key"
  ON "document_storage_cleanup_jobs"("storage_provider", "bucket", "object_key");

CREATE INDEX "document_storage_cleanup_jobs_status_next_run_at_idx"
  ON "document_storage_cleanup_jobs"("status", "next_run_at");

CREATE INDEX "document_storage_cleanup_jobs_tenant_id_status_idx"
  ON "document_storage_cleanup_jobs"("tenant_id", "status");

CREATE INDEX "document_storage_cleanup_jobs_document_id_idx"
  ON "document_storage_cleanup_jobs"("document_id");

ALTER TABLE "document_storage_cleanup_jobs"
  ADD CONSTRAINT "document_storage_cleanup_jobs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_storage_cleanup_jobs"
  ADD CONSTRAINT "document_storage_cleanup_jobs_document_id_fkey"
  FOREIGN KEY ("document_id") REFERENCES "documents"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
