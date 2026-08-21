CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "cases_case_number_trgm_idx"
ON "cases" USING GIN ("case_number" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "cases_caption_trgm_idx"
ON "cases" USING GIN ("caption" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "cases_subject_trgm_idx"
ON "cases" USING GIN ("subject" gin_trgm_ops)
WHERE "subject" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "cases_court_trgm_idx"
ON "cases" USING GIN ("court" gin_trgm_ops)
WHERE "court" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "cases_judicial_center_text_trgm_idx"
ON "cases" USING GIN ("judicial_center_text" gin_trgm_ops)
WHERE "judicial_center_text" IS NOT NULL;
