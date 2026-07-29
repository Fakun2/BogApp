-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('human', 'legal_entity');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('active', 'inactive', 'archived');

-- AlterTable
ALTER TABLE "forums" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "jurisdiction_templates" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "jurisdictions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" "ClientType" NOT NULL DEFAULT 'human',
    "status" "ClientStatus" NOT NULL DEFAULT 'active',
    "first_name" TEXT,
    "last_name" TEXT,
    "age" INTEGER,
    "dni" TEXT,
    "cuil" TEXT,
    "cuit" TEXT,
    "business_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "statute" TEXT,
    "salary_receipt_ref" TEXT,
    "cbu" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_tenant_id_idx" ON "clients"("tenant_id");

-- CreateIndex
CREATE INDEX "clients_tenant_id_status_idx" ON "clients"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "clients_tenant_id_type_idx" ON "clients"("tenant_id", "type");

-- CreateIndex
CREATE INDEX "clients_tenant_id_dni_idx" ON "clients"("tenant_id", "dni");

-- CreateIndex
CREATE INDEX "clients_tenant_id_cuil_idx" ON "clients"("tenant_id", "cuil");

-- CreateIndex
CREATE INDEX "clients_tenant_id_cuit_idx" ON "clients"("tenant_id", "cuit");

-- CreateIndex
CREATE INDEX "clients_tenant_id_business_name_idx" ON "clients"("tenant_id", "business_name");

-- CreateIndex
CREATE INDEX "clients_tenant_id_last_name_first_name_idx" ON "clients"("tenant_id", "last_name", "first_name");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "tenant_membership_practice_areas_practice_area_id_tenant_member" RENAME TO "tenant_membership_practice_areas_practice_area_id_tenant_me_idx";
