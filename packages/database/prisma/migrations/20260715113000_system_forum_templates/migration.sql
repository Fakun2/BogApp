CREATE TABLE IF NOT EXISTS "forum_templates" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "jurisdiction_template_id" uuid NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "active" boolean NOT NULL DEFAULT true,
  "display_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "forum_templates_code_key" ON "forum_templates"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "forum_templates_jurisdiction_template_id_name_key"
  ON "forum_templates"("jurisdiction_template_id", "name");
CREATE INDEX IF NOT EXISTS "forum_templates_jurisdiction_template_id_active_display_order_idx"
  ON "forum_templates"("jurisdiction_template_id", "active", "display_order");

ALTER TABLE "forum_templates"
DROP CONSTRAINT IF EXISTS "forum_templates_jurisdiction_template_id_fkey";

ALTER TABLE "forum_templates"
ADD CONSTRAINT "forum_templates_jurisdiction_template_id_fkey"
  FOREIGN KEY ("jurisdiction_template_id") REFERENCES "jurisdiction_templates"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "forums"
ADD COLUMN IF NOT EXISTS "template_id" uuid,
ADD COLUMN IF NOT EXISTS "is_system" boolean NOT NULL DEFAULT false;

ALTER TABLE "forums"
DROP CONSTRAINT IF EXISTS "forums_template_id_fkey";

ALTER TABLE "forums"
ADD CONSTRAINT "forums_template_id_fkey"
  FOREIGN KEY ("template_id") REFERENCES "forum_templates"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS "forums_tenant_id_template_id_key"
  ON "forums"("tenant_id", "template_id");
CREATE INDEX IF NOT EXISTS "forums_template_id_idx" ON "forums"("template_id");
CREATE INDEX IF NOT EXISTS "forums_is_system_name_idx" ON "forums"("is_system", "name");
