CREATE TYPE "CaseHearingType" AS ENUM (
  'preliminary',
  'trial_view',
  'conciliation',
  'mediation',
  'testimonial',
  'confessional',
  'debate',
  'investigative_statement',
  'other'
);

CREATE TABLE "case_hearings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "case_id" UUID NOT NULL,
  "type" "CaseHearingType" NOT NULL,
  "date" DATE NOT NULL,
  "time" VARCHAR(5) NOT NULL,
  "description" TEXT NOT NULL,
  "notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "case_hearings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "case_hearings"
ADD CONSTRAINT "case_hearings_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_hearings"
ADD CONSTRAINT "case_hearings_case_id_fkey"
FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "case_hearings_tenant_id_idx" ON "case_hearings"("tenant_id");
CREATE INDEX "case_hearings_case_id_idx" ON "case_hearings"("case_id");
CREATE INDEX "case_hearings_tenant_id_case_id_idx" ON "case_hearings"("tenant_id", "case_id");
CREATE INDEX "case_hearings_tenant_id_date_idx" ON "case_hearings"("tenant_id", "date");
CREATE INDEX "case_hearings_tenant_id_type_idx" ON "case_hearings"("tenant_id", "type");

INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'hearings:read', 'hearings', 'read', now(), now()),
  (gen_random_uuid(), 'hearings:create', 'hearings', 'create', now(), now()),
  (gen_random_uuid(), 'hearings:update', 'hearings', 'update', now(), now()),
  (gen_random_uuid(), 'hearings:delete', 'hearings', 'delete', now(), now())
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), roles."id", permissions."id", now()
FROM "roles"
CROSS JOIN "permissions"
WHERE roles."code" IN ('owner', 'admin', 'lawyer')
  AND permissions."code" IN (
    'hearings:read',
    'hearings:create',
    'hearings:update',
    'hearings:delete'
  )
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), roles."id", permissions."id", now()
FROM "roles"
CROSS JOIN "permissions"
WHERE roles."code" = 'paralegal'
  AND permissions."code" IN (
    'hearings:read',
    'hearings:create',
    'hearings:update'
  )
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
