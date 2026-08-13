CREATE TYPE "AiChatRunStatus" AS ENUM ('accepted', 'failed');

CREATE TABLE "ai_chat_runs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "case_id" UUID,
    "tool" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT,
    "prompt_length" INTEGER NOT NULL,
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "finish_reason" TEXT,
    "status" "AiChatRunStatus" NOT NULL,
    "error_code" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_chat_runs_tenant_id_created_at_idx" ON "ai_chat_runs"("tenant_id", "created_at");
CREATE INDEX "ai_chat_runs_tenant_id_user_id_created_at_idx" ON "ai_chat_runs"("tenant_id", "user_id", "created_at");
CREATE INDEX "ai_chat_runs_tenant_id_case_id_created_at_idx" ON "ai_chat_runs"("tenant_id", "case_id", "created_at");
CREATE INDEX "ai_chat_runs_tenant_id_status_created_at_idx" ON "ai_chat_runs"("tenant_id", "status", "created_at");

ALTER TABLE "ai_chat_runs"
  ADD CONSTRAINT "ai_chat_runs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_chat_runs"
  ADD CONSTRAINT "ai_chat_runs_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ai_chat_runs"
  ADD CONSTRAINT "ai_chat_runs_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ai_chat_runs" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_chat_runs_tenant_isolation ON "ai_chat_runs";
CREATE POLICY ai_chat_runs_tenant_isolation
  ON "ai_chat_runs"
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));
