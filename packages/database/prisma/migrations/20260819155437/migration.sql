-- AlterTable
ALTER TABLE "document_import_items" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "document_import_jobs" ALTER COLUMN "updated_at" DROP DEFAULT;
