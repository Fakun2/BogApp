-- DropIndex
DROP INDEX "case_expenses_concept_trgm_idx";

-- DropIndex
DROP INDEX "case_hearings_description_trgm_idx";

-- DropIndex
DROP INDEX "case_tasks_name_trgm_idx";

-- DropIndex
DROP INDEX "cases_caption_trgm_idx";

-- DropIndex
DROP INDEX "cases_case_number_trgm_idx";

-- DropIndex
DROP INDEX "forum_templates_name_trgm_idx";

-- DropIndex
DROP INDEX "judicial_centers_name_trgm_idx";

-- DropIndex
DROP INDEX "users_full_name_trgm_idx";

-- AlterTable
ALTER TABLE "ai_chat_runs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ai_legal_document_versions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ai_legal_documents" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ai_legal_norm_chunks" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ai_legal_norm_units" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "case_hearings" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "role_permissions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tenant_currencies" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;
