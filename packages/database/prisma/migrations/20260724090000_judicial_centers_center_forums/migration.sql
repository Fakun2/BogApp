CREATE TABLE IF NOT EXISTS "judicial_centers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "province_id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "judicial_centers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "judicial_center_forums" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "judicial_center_id" UUID NOT NULL,
  "forum_template_id" UUID NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "judicial_center_forums_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cases"
ADD COLUMN IF NOT EXISTS "judicial_center_forum_id" UUID;

ALTER TABLE "cases"
DROP COLUMN IF EXISTS "judicial_center",
DROP COLUMN IF EXISTS "judicial_body";

CREATE UNIQUE INDEX IF NOT EXISTS "judicial_centers_code_key"
ON "judicial_centers"("code");

CREATE UNIQUE INDEX IF NOT EXISTS "judicial_centers_province_id_name_key"
ON "judicial_centers"("province_id", "name");

CREATE INDEX IF NOT EXISTS "judicial_centers_province_id_active_display_order_idx"
ON "judicial_centers"("province_id", "active", "display_order");

CREATE UNIQUE INDEX IF NOT EXISTS "judicial_center_forums_judicial_center_id_forum_template_id_key"
ON "judicial_center_forums"("judicial_center_id", "forum_template_id");

CREATE INDEX IF NOT EXISTS "judicial_center_forums_judicial_center_id_active_display_order_idx"
ON "judicial_center_forums"("judicial_center_id", "active", "display_order");

CREATE INDEX IF NOT EXISTS "judicial_center_forums_forum_template_id_active_idx"
ON "judicial_center_forums"("forum_template_id", "active");

CREATE INDEX IF NOT EXISTS "cases_judicial_center_forum_id_idx"
ON "cases"("judicial_center_forum_id");

ALTER TABLE "judicial_centers"
DROP CONSTRAINT IF EXISTS "judicial_centers_province_id_fkey";

ALTER TABLE "judicial_centers"
ADD CONSTRAINT "judicial_centers_province_id_fkey"
FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "judicial_center_forums"
DROP CONSTRAINT IF EXISTS "judicial_center_forums_judicial_center_id_fkey";

ALTER TABLE "judicial_center_forums"
ADD CONSTRAINT "judicial_center_forums_judicial_center_id_fkey"
FOREIGN KEY ("judicial_center_id") REFERENCES "judicial_centers"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "judicial_center_forums"
DROP CONSTRAINT IF EXISTS "judicial_center_forums_forum_template_id_fkey";

ALTER TABLE "judicial_center_forums"
ADD CONSTRAINT "judicial_center_forums_forum_template_id_fkey"
FOREIGN KEY ("forum_template_id") REFERENCES "forum_templates"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cases"
DROP CONSTRAINT IF EXISTS "cases_judicial_center_forum_id_fkey";

ALTER TABLE "cases"
ADD CONSTRAINT "cases_judicial_center_forum_id_fkey"
FOREIGN KEY ("judicial_center_forum_id") REFERENCES "judicial_center_forums"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
