import { hasPermission } from "@/lib/auth/permissions";
import type { CaseDetailPermissions, CaseDetailSession } from "../_types/case-detail-page.types";

export function getCaseDetailPermissions(session: CaseDetailSession): CaseDetailPermissions {
  return {
    canCreateExpense: hasPermission(session, "expenses:create"),
    canCreateHearing: hasPermission(session, "hearings:create"),
    canCreateTask: hasPermission(session, "tasks:create"),
    canDeleteExpense: hasPermission(session, "expenses:delete"),
    canDeleteHearing: hasPermission(session, "hearings:delete"),
    canDeleteTask: hasPermission(session, "tasks:delete"),
    canReadCase: hasPermission(session, "cases:read"),
    canReadDocument: hasPermission(session, "documents:read"),
    canReadExpense: hasPermission(session, "expenses:read"),
    canReadHearing: hasPermission(session, "hearings:read"),
    canUseCaseAi: hasPermission(session, "ai:case_chat"),
    canWriteDocument: hasPermission(session, "documents:write"),
    canUpdateExpense: hasPermission(session, "expenses:update"),
    canUpdateHearing: hasPermission(session, "hearings:update"),
    canUpdateTask: hasPermission(session, "tasks:update")
  };
}
