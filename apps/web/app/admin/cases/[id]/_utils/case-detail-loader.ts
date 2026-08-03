import { getCaseDetailServer } from "../../_api/cases.server-api";

export async function loadCaseDetail(caseId: string) {
  try {
    return {
      data: await getCaseDetailServer(caseId),
      error: null
    };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error : new Error("No se pudo cargar el expediente.")
    };
  }
}
