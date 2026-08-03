CREATE OR REPLACE FUNCTION tenant_scoped(row_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT row_tenant_id::text = current_setting('app.tenant_id', true)
$$;

CREATE OR REPLACE FUNCTION recalculate_overdue_expenses_for_active_tenants(today_date date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE case_expenses
  SET status = 'overdue'
  FROM tenants
  WHERE case_expenses.tenant_id = tenants.id
    AND tenants.status = 'active'
    AND case_expenses.status = 'pending'
    AND (
      case_expenses.payment_date < today_date
      OR case_expenses.expense_date > case_expenses.payment_date
    );

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS clients_tenant_isolation ON clients;
CREATE POLICY clients_tenant_isolation
  ON clients
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cases_tenant_isolation ON cases;
CREATE POLICY cases_tenant_isolation
  ON cases
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE case_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS case_tasks_tenant_isolation ON case_tasks;
CREATE POLICY case_tasks_tenant_isolation
  ON case_tasks
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE case_expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS case_expenses_tenant_isolation ON case_expenses;
CREATE POLICY case_expenses_tenant_isolation
  ON case_expenses
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE case_hearings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS case_hearings_tenant_isolation ON case_hearings;
CREATE POLICY case_hearings_tenant_isolation
  ON case_hearings
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE case_expense_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS case_expense_attachments_tenant_isolation ON case_expense_attachments;
CREATE POLICY case_expense_attachments_tenant_isolation
  ON case_expense_attachments
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE practice_areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS practice_areas_tenant_isolation ON practice_areas;
CREATE POLICY practice_areas_tenant_isolation
  ON practice_areas
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_memberships_tenant_isolation ON tenant_memberships;
CREATE POLICY tenant_memberships_tenant_isolation
  ON tenant_memberships
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_profiles_tenant_isolation ON tenant_profiles;
CREATE POLICY tenant_profiles_tenant_isolation
  ON tenant_profiles
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_settings_tenant_isolation ON tenant_settings;
CREATE POLICY tenant_settings_tenant_isolation
  ON tenant_settings
  USING (tenant_scoped(tenant_id))
  WITH CHECK (tenant_scoped(tenant_id));

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS roles_tenant_isolation ON roles;
CREATE POLICY roles_tenant_isolation
  ON roles
  USING (tenant_id IS NULL OR tenant_scoped(tenant_id))
  WITH CHECK (tenant_id IS NULL OR tenant_scoped(tenant_id));

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS role_permissions_tenant_isolation ON role_permissions;
CREATE POLICY role_permissions_tenant_isolation
  ON role_permissions
  USING (
    EXISTS (
      SELECT 1
      FROM roles
      WHERE roles.id = role_permissions.role_id
        AND (roles.tenant_id IS NULL OR tenant_scoped(roles.tenant_id))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM roles
      WHERE roles.id = role_permissions.role_id
        AND (roles.tenant_id IS NULL OR tenant_scoped(roles.tenant_id))
    )
  );

ALTER TABLE case_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS case_participants_tenant_isolation ON case_participants;
CREATE POLICY case_participants_tenant_isolation
  ON case_participants
  USING (
    EXISTS (
      SELECT 1
      FROM cases
      WHERE cases.id = case_participants.case_id
        AND tenant_scoped(cases.tenant_id)
    )
    AND (
      case_participants.client_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM clients
        WHERE clients.id = case_participants.client_id
          AND tenant_scoped(clients.tenant_id)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM cases
      WHERE cases.id = case_participants.case_id
        AND tenant_scoped(cases.tenant_id)
    )
    AND (
      case_participants.client_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM clients
        WHERE clients.id = case_participants.client_id
          AND tenant_scoped(clients.tenant_id)
      )
    )
  );

ALTER TABLE tenant_membership_practice_areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_membership_practice_areas_tenant_isolation ON tenant_membership_practice_areas;
CREATE POLICY tenant_membership_practice_areas_tenant_isolation
  ON tenant_membership_practice_areas
  USING (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.id = tenant_membership_practice_areas.tenant_membership_id
        AND tenant_scoped(tenant_memberships.tenant_id)
    )
    AND EXISTS (
      SELECT 1
      FROM practice_areas
      WHERE practice_areas.id = tenant_membership_practice_areas.practice_area_id
        AND tenant_scoped(practice_areas.tenant_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.id = tenant_membership_practice_areas.tenant_membership_id
        AND tenant_scoped(tenant_memberships.tenant_id)
    )
    AND EXISTS (
      SELECT 1
      FROM practice_areas
      WHERE practice_areas.id = tenant_membership_practice_areas.practice_area_id
        AND tenant_scoped(practice_areas.tenant_id)
    )
  );
