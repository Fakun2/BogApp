ALTER TABLE "currencies" ADD COLUMN "name" TEXT;

UPDATE "currencies"
SET "name" = CASE "code"
  WHEN 'ARS' THEN 'Peso argentino'
  WHEN 'USD' THEN 'Dolar estadounidense'
  WHEN 'BRL' THEN 'Real brasileno'
  ELSE "code"
END
WHERE "name" IS NULL;

INSERT INTO "currencies" ("id", "code", "name", "symbol", "active")
VALUES
  (gen_random_uuid(), 'ARS', 'Peso argentino', '$', true),
  (gen_random_uuid(), 'USD', 'Dolar estadounidense', 'US$', true),
  (gen_random_uuid(), 'BRL', 'Real brasileno', 'R$', true)
ON CONFLICT ("code") DO UPDATE
SET
  "active" = true,
  "name" = EXCLUDED."name",
  "symbol" = EXCLUDED."symbol";

ALTER TABLE "currencies" ALTER COLUMN "name" SET NOT NULL;

CREATE INDEX "currencies_active_name_idx" ON "currencies"("active", "name");

INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'currencies:read', 'currencies', 'read', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'currencies:create', 'currencies', 'create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'currencies:update', 'currencies', 'update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'currencies:delete', 'currencies', 'delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE
SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), "roles"."id", "permissions"."id", CURRENT_TIMESTAMP
FROM "roles"
JOIN "permissions" ON "permissions"."code" = 'currencies:read'
WHERE "roles"."code" IN ('owner', 'admin', 'lawyer', 'paralegal', 'accounting', 'viewer')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
