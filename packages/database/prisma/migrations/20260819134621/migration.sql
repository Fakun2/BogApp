-- AlterTable
ALTER TABLE "document_folders" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "document_storage_cleanup_jobs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "updated_at" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "document_storage_cleanup_jobs_storage_provider_bucket_object_ke" RENAME TO "document_storage_cleanup_jobs_storage_provider_bucket_objec_key";
