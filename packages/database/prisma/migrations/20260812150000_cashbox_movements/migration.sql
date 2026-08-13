CREATE TYPE "CashboxMovementType" AS ENUM (
  'income',
  'expense',
  'conversion_in',
  'conversion_out'
);

CREATE TABLE "cashbox_movements" (
  "id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "type" "CashboxMovementType" NOT NULL,
  "currency_code" CHAR(3) NOT NULL,
  "amount" DECIMAL(18, 2) NOT NULL,
  "occurred_at" TIMESTAMPTZ(6) NOT NULL,
  "description" TEXT,
  "category_origin" TEXT,
  "category_id" UUID,
  "conversion_group_id" UUID,
  "exchange_rate" DECIMAL(18, 8),
  "created_by_user_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "cashbox_movements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cashbox_movements_tenant_id_currency_code_occurred_at_id_idx"
  ON "cashbox_movements"("tenant_id", "currency_code", "occurred_at", "id");

CREATE INDEX "cashbox_movements_tenant_id_occurred_at_id_idx"
  ON "cashbox_movements"("tenant_id", "occurred_at", "id");

CREATE INDEX "cashbox_movements_tenant_id_conversion_group_id_idx"
  ON "cashbox_movements"("tenant_id", "conversion_group_id");

CREATE INDEX "cashbox_movements_created_by_user_id_idx"
  ON "cashbox_movements"("created_by_user_id");

ALTER TABLE "cashbox_movements"
  ADD CONSTRAINT "cashbox_movements_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cashbox_movements"
  ADD CONSTRAINT "cashbox_movements_currency_code_fkey"
  FOREIGN KEY ("currency_code") REFERENCES "currencies"("code")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cashbox_movements"
  ADD CONSTRAINT "cashbox_movements_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE cashbox_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cashbox_movements_tenant_isolation ON cashbox_movements;
CREATE POLICY cashbox_movements_tenant_isolation
  ON cashbox_movements
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
