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

CREATE INDEX IF NOT EXISTS "users_full_name_trgm_idx"
ON "users" USING GIN ("full_name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "case_expenses_concept_trgm_idx"
ON "case_expenses" USING GIN ("concept" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "case_tasks_name_trgm_idx"
ON "case_tasks" USING GIN ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "case_hearings_description_trgm_idx"
ON "case_hearings" USING GIN ("description" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "forum_templates_name_trgm_idx"
ON "forum_templates" USING GIN ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "judicial_centers_name_trgm_idx"
ON "judicial_centers" USING GIN ("name" gin_trgm_ops);
