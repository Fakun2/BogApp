-- AlterTable
ALTER TABLE "document_categories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
