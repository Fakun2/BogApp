DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'JudicialInstance') THEN
    CREATE TYPE "JudicialInstance" AS ENUM ('first', 'second', 'third');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "judicial_centers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "province_id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "city" TEXT,
  "address" TEXT,
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "judicial_centers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "judicial_bodies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "judicial_center_id" UUID NOT NULL,
  "forum_template_id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "kind" TEXT,
  "instance" "JudicialInstance",
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "judicial_bodies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "judicial_centers_code_key" ON "judicial_centers"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "judicial_centers_province_id_name_key"
  ON "judicial_centers"("province_id", "name");
CREATE INDEX IF NOT EXISTS "judicial_centers_province_id_active_display_order_idx"
  ON "judicial_centers"("province_id", "active", "display_order");

CREATE UNIQUE INDEX IF NOT EXISTS "judicial_bodies_code_key" ON "judicial_bodies"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "judicial_bodies_judicial_center_id_forum_template_id_name_key"
  ON "judicial_bodies"("judicial_center_id", "forum_template_id", "name");
CREATE INDEX IF NOT EXISTS "judicial_bodies_judicial_center_id_active_display_order_idx"
  ON "judicial_bodies"("judicial_center_id", "active", "display_order");
CREATE INDEX IF NOT EXISTS "judicial_bodies_forum_template_id_active_display_order_idx"
  ON "judicial_bodies"("forum_template_id", "active", "display_order");

ALTER TABLE "judicial_centers"
DROP CONSTRAINT IF EXISTS "judicial_centers_province_id_fkey";

ALTER TABLE "judicial_centers"
ADD CONSTRAINT "judicial_centers_province_id_fkey"
  FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "judicial_bodies"
DROP CONSTRAINT IF EXISTS "judicial_bodies_judicial_center_id_fkey";

ALTER TABLE "judicial_bodies"
ADD CONSTRAINT "judicial_bodies_judicial_center_id_fkey"
  FOREIGN KEY ("judicial_center_id") REFERENCES "judicial_centers"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "judicial_bodies"
DROP CONSTRAINT IF EXISTS "judicial_bodies_forum_template_id_fkey";

ALTER TABLE "judicial_bodies"
ADD CONSTRAINT "judicial_bodies_forum_template_id_fkey"
  FOREIGN KEY ("forum_template_id") REFERENCES "forum_templates"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
