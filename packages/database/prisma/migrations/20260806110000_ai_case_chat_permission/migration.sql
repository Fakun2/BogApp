INSERT INTO "permissions" ("id", "code", "resource", "action", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'ai:case_chat', 'ai', 'case_chat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "created_at")
SELECT gen_random_uuid(), "roles"."id", "permissions"."id", CURRENT_TIMESTAMP
FROM "roles"
CROSS JOIN "permissions"
WHERE "roles"."code" = 'owner'
  AND "permissions"."code" = 'ai:case_chat'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
