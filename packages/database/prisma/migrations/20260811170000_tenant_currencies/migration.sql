CREATE TABLE "tenant_currencies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "currency_code" CHAR(3) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "tenant_currencies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenant_currencies_tenant_id_currency_code_key"
  ON "tenant_currencies"("tenant_id", "currency_code");

CREATE INDEX "tenant_currencies_tenant_id_active_idx"
  ON "tenant_currencies"("tenant_id", "active");

CREATE INDEX "tenant_currencies_currency_code_idx"
  ON "tenant_currencies"("currency_code");

ALTER TABLE "tenant_currencies"
  ADD CONSTRAINT "tenant_currencies_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant_currencies"
  ADD CONSTRAINT "tenant_currencies_currency_code_fkey"
  FOREIGN KEY ("currency_code") REFERENCES "currencies"("code")
  ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "tenant_currencies" ("id", "tenant_id", "currency_code", "active", "created_at", "updated_at")
SELECT gen_random_uuid(), "tenant_settings"."tenant_id", "tenant_settings"."default_currency_code", true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "tenant_settings"
ON CONFLICT ("tenant_id", "currency_code") DO UPDATE
SET
  "active" = true,
  "updated_at" = CURRENT_TIMESTAMP;

ALTER TABLE tenant_currencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_currencies_tenant_isolation ON tenant_currencies;
CREATE POLICY tenant_currencies_tenant_isolation
  ON tenant_currencies
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
