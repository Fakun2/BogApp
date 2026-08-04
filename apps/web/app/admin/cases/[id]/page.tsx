import { RestrictedCases } from "../_components/access/restricted-cases";
import { getCasesServerSession } from "../_api/cases.server-api";
import { CaseDetailView } from "./_components/case-detail-view";
import { loadCaseDetail } from "./_utils/case-detail-loader";
import { getCaseDetailPermissions } from "./_utils/case-detail-permissions";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCasesServerSession();
  const permissions = session ? getCaseDetailPermissions(session) : null;

  if (!session || !permissions?.canReadCase) {
    return <RestrictedCases />;
  }

  const { id } = await params;
  const caseResult = await loadCaseDetail(id);

  if (caseResult.error || !caseResult.data) {
    return (
      <div
        data-admin-surface
        className="rounded-md border-0 bg-card p-6 text-sm font-medium text-destructive shadow-[var(--admin-card-shadow)]"
      >
        {caseResult.error?.message ?? "No se pudo cargar el expediente."}
      </div>
    );
  }

  return <CaseDetailView caseItem={caseResult.data} permissions={permissions} />;
}
