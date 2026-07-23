CREATE TABLE "forums" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forums_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "jurisdiction_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "name" text NOT NULL,
  "province" text,
  "country" text NOT NULL,
  "active" boolean NOT NULL DEFAULT true,
  "display_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "jurisdictions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid NOT NULL,
  "template_id" uuid,
  "name" text NOT NULL,
  "province" text,
  "country" text NOT NULL,
  "description" text,
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "jurisdictions_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "jurisdictions_template_id_fkey"
    FOREIGN KEY ("template_id") REFERENCES "jurisdiction_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "forums_tenant_id_name_key" ON "forums"("tenant_id", "name");
CREATE INDEX "forums_tenant_id_idx" ON "forums"("tenant_id");
CREATE INDEX "forums_tenant_id_active_name_idx" ON "forums"("tenant_id", "active", "name");

CREATE UNIQUE INDEX "jurisdiction_templates_code_key" ON "jurisdiction_templates"("code");
CREATE INDEX "jurisdiction_templates_active_display_order_idx"
  ON "jurisdiction_templates"("active", "display_order");

CREATE UNIQUE INDEX "jurisdictions_tenant_id_name_key" ON "jurisdictions"("tenant_id", "name");
CREATE UNIQUE INDEX "jurisdictions_tenant_id_template_id_key"
  ON "jurisdictions"("tenant_id", "template_id");
CREATE INDEX "jurisdictions_tenant_id_idx" ON "jurisdictions"("tenant_id");
CREATE INDEX "jurisdictions_tenant_id_active_name_idx"
  ON "jurisdictions"("tenant_id", "active", "name");
CREATE INDEX "jurisdictions_template_id_idx" ON "jurisdictions"("template_id");
