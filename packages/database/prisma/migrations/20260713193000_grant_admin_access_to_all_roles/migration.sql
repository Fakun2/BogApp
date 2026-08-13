INSERT INTO "permissions" ("id", "code", "resource", "action", "updated_at")
VALUES ('20000000-0000-0000-0000-000000000101', 'admin:access', 'admin', 'access', CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id")
SELECT gen_random_uuid(), roles."id", permissions."id"
FROM "roles" roles
CROSS JOIN "permissions" permissions
WHERE permissions."code" = 'admin:access'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
