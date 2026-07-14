-- Seed admin/staff permissions and grant them to the Admin role.
INSERT INTO "permissions" ("id", "code", "resource", "action", "updated_at")
VALUES
  ('20000000-0000-0000-0000-000000000101', 'admin:access', 'admin', 'access', CURRENT_TIMESTAMP),
  ('20000000-0000-0000-0000-000000000102', 'staff:read', 'staff', 'read', CURRENT_TIMESTAMP),
  ('20000000-0000-0000-0000-000000000103', 'staff:manage', 'staff', 'manage', CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "resource" = EXCLUDED."resource",
  "action" = EXCLUDED."action",
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "roles" ("id", "code", "name", "is_system", "updated_at")
VALUES ('20000000-0000-0000-0000-000000000201', 'admin', 'Admin', true, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "is_system" = true,
  "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "role_permissions" ("id", "role_id", "permission_id")
SELECT grants.id, roles.id, permissions.id
FROM (
  VALUES
    ('20000000-0000-0000-0000-000000000301'::uuid, 'admin:access'),
    ('20000000-0000-0000-0000-000000000302'::uuid, 'staff:read'),
    ('20000000-0000-0000-0000-000000000303'::uuid, 'staff:manage')
) AS grants(id, permission_code)
JOIN "roles" roles ON roles."code" = 'admin'
JOIN "permissions" permissions ON permissions."code" = grants.permission_code
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
