DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CaseCatalogStrategy') THEN
    CREATE TYPE "CaseCatalogStrategy" AS ENUM ('manual', 'center_forum');
  END IF;
END $$;

ALTER TABLE "provinces"
ADD COLUMN IF NOT EXISTS "case_catalog_strategy" "CaseCatalogStrategy" NOT NULL DEFAULT 'manual';

UPDATE "provinces"
SET "case_catalog_strategy" = 'center_forum'
WHERE "code" = 'ar-tucuman';

UPDATE "provinces"
SET "case_catalog_strategy" = 'manual'
WHERE "code" <> 'ar-tucuman';

ALTER TABLE "cases"
ADD COLUMN IF NOT EXISTS "judicial_center_text" TEXT;
