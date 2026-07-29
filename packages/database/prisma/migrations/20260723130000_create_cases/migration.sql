CREATE TYPE "CaseInstance" AS ENUM ('first', 'second', 'third');
CREATE TYPE "CaseStatus" AS ENUM ('open', 'paused', 'closed');
CREATE TYPE "CaseParticipantRole" AS ENUM (
  'claimant',
  'defendant',
  'complainant',
  'accused',
  'third_party',
  'client',
  'opposing_party',
  'other'
);

CREATE TABLE "cases" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "case_number" TEXT NOT NULL,
  "caption" TEXT NOT NULL,
  "subject" TEXT,
  "description" TEXT,
  "province_id" UUID NOT NULL,
  "forum_template_id" UUID NOT NULL,
  "judicial_center" TEXT,
  "judicial_body" TEXT,
  "court" TEXT,
  "instance" "CaseInstance" NOT NULL DEFAULT 'first',
  "status" "CaseStatus" NOT NULL DEFAULT 'open',
  "filing_date" DATE,
  "primary_client_id" UUID,
  "practice_area_id" UUID,
  "responsible_membership_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "case_participants" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "case_id" UUID NOT NULL,
  "role" "CaseParticipantRole" NOT NULL DEFAULT 'other',
  "name" TEXT NOT NULL,
  "document" TEXT,
  "address" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "client_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "case_participants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cases_tenant_id_case_number_key" ON "cases"("tenant_id", "case_number");
CREATE INDEX "cases_tenant_id_idx" ON "cases"("tenant_id");
CREATE INDEX "cases_tenant_id_status_idx" ON "cases"("tenant_id", "status");
CREATE INDEX "cases_tenant_id_caption_idx" ON "cases"("tenant_id", "caption");
CREATE INDEX "cases_tenant_id_filing_date_idx" ON "cases"("tenant_id", "filing_date");
CREATE INDEX "cases_province_id_idx" ON "cases"("province_id");
CREATE INDEX "cases_forum_template_id_idx" ON "cases"("forum_template_id");
CREATE INDEX "cases_primary_client_id_idx" ON "cases"("primary_client_id");
CREATE INDEX "cases_practice_area_id_idx" ON "cases"("practice_area_id");
CREATE INDEX "cases_responsible_membership_id_idx" ON "cases"("responsible_membership_id");
CREATE INDEX "case_participants_case_id_idx" ON "case_participants"("case_id");
CREATE INDEX "case_participants_client_id_idx" ON "case_participants"("client_id");

ALTER TABLE "cases"
ADD CONSTRAINT "cases_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cases"
ADD CONSTRAINT "cases_province_id_fkey"
  FOREIGN KEY ("province_id") REFERENCES "provinces"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cases"
ADD CONSTRAINT "cases_forum_template_id_fkey"
  FOREIGN KEY ("forum_template_id") REFERENCES "forum_templates"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cases"
ADD CONSTRAINT "cases_primary_client_id_fkey"
  FOREIGN KEY ("primary_client_id") REFERENCES "clients"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "cases"
ADD CONSTRAINT "cases_practice_area_id_fkey"
  FOREIGN KEY ("practice_area_id") REFERENCES "practice_areas"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "cases"
ADD CONSTRAINT "cases_responsible_membership_id_fkey"
  FOREIGN KEY ("responsible_membership_id") REFERENCES "tenant_memberships"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "case_participants"
ADD CONSTRAINT "case_participants_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "cases"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_participants"
ADD CONSTRAINT "case_participants_client_id_fkey"
  FOREIGN KEY ("client_id") REFERENCES "clients"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
