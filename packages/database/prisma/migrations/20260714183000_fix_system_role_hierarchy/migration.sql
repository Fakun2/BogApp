UPDATE "roles"
SET
  "hierarchy_level" = CASE
    WHEN "code" = 'owner' THEN 3
    WHEN "code" = 'admin' THEN 2
    WHEN "code" IN ('lawyer', 'paralegal', 'accounting', 'viewer') THEN 1
    ELSE "hierarchy_level"
  END,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "code" IN ('owner', 'admin', 'lawyer', 'paralegal', 'accounting', 'viewer');
