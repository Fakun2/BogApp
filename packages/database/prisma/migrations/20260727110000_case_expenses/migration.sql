-- CreateEnum
CREATE TYPE "CaseExpenseStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateTable
CREATE TABLE "case_expenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "task_id" UUID,
    "concept" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "expense_date" DATE,
    "status" "CaseExpenseStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_expenses_pkey" PRIMARY KEY ("id")
);

-- Backfill task costs into expenses before removing the temporary task column.
INSERT INTO "case_expenses" (
    "tenant_id",
    "case_id",
    "task_id",
    "concept",
    "amount",
    "expense_date",
    "status",
    "notes",
    "created_at",
    "updated_at"
)
SELECT
    "tenant_id",
    "case_id",
    "id",
    CONCAT('Gasto asociado a tarea: ', "name"),
    "cost",
    COALESCE("start_date", "end_date"),
    'pending'::"CaseExpenseStatus",
    "notes",
    "created_at",
    "updated_at"
FROM "case_tasks"
WHERE "cost" > 0;

-- DropColumn
ALTER TABLE "case_tasks" DROP COLUMN "cost";

-- CreateIndex
CREATE INDEX "case_expenses_tenant_id_idx" ON "case_expenses"("tenant_id");

-- CreateIndex
CREATE INDEX "case_expenses_case_id_idx" ON "case_expenses"("case_id");

-- CreateIndex
CREATE INDEX "case_expenses_task_id_idx" ON "case_expenses"("task_id");

-- CreateIndex
CREATE INDEX "case_expenses_tenant_id_case_id_idx" ON "case_expenses"("tenant_id", "case_id");

-- CreateIndex
CREATE INDEX "case_expenses_tenant_id_status_idx" ON "case_expenses"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "case_expenses_tenant_id_expense_date_idx" ON "case_expenses"("tenant_id", "expense_date");

-- AddForeignKey
ALTER TABLE "case_expenses" ADD CONSTRAINT "case_expenses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_expenses" ADD CONSTRAINT "case_expenses_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_expenses" ADD CONSTRAINT "case_expenses_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "case_tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
