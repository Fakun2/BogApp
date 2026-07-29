-- CreateEnum
CREATE TYPE "CaseTaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "case_tasks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "status" "CaseTaskStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "case_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "case_tasks_tenant_id_idx" ON "case_tasks"("tenant_id");

-- CreateIndex
CREATE INDEX "case_tasks_case_id_idx" ON "case_tasks"("case_id");

-- CreateIndex
CREATE INDEX "case_tasks_tenant_id_case_id_idx" ON "case_tasks"("tenant_id", "case_id");

-- CreateIndex
CREATE INDEX "case_tasks_tenant_id_status_idx" ON "case_tasks"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "case_tasks_tenant_id_start_date_idx" ON "case_tasks"("tenant_id", "start_date");

-- CreateIndex
CREATE INDEX "case_tasks_tenant_id_end_date_idx" ON "case_tasks"("tenant_id", "end_date");

-- AddForeignKey
ALTER TABLE "case_tasks" ADD CONSTRAINT "case_tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_tasks" ADD CONSTRAINT "case_tasks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
