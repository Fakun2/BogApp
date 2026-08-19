import type { QueryClient } from "@tanstack/react-query";
import type { CaseDocumentDto, CaseDocumentsListResponse } from "../_types/cases.types";

export function upsertDocumentIntoCaseDocumentQueries(
  queryClient: QueryClient,
  caseId: string,
  document: CaseDocumentDto
) {
  const queries = queryClient
    .getQueryCache()
    .findAll({ predicate: (query) => isCaseDocumentsQuery(query.queryKey, caseId) });

  queries.forEach((query) => {
    const params = getCaseDocumentsQueryParams(query.queryKey);
    if (params.cursor || (params.categoryId && params.categoryId !== document.category?.id)) {
      return;
    }

    queryClient.setQueryData<CaseDocumentsListResponse>(query.queryKey, (current) => {
      if (!current) {
        return current;
      }

      const alreadyExists = current.items.some((item) => item.id === document.id);
      const items = current.items.filter((item) => item.id !== document.id);
      const limit = current.pageInfo.limit || items.length + 1;

      return {
        ...current,
        items: [document, ...items].slice(0, limit),
        pageInfo: {
          ...current.pageInfo,
          total: alreadyExists ? current.pageInfo.total : current.pageInfo.total + 1
        }
      };
    });
  });
}

export function isCaseDocumentsQuery(queryKey: readonly unknown[], caseId: string) {
  const casesIndex = queryKey.findIndex((part) => part === "cases");
  const root = queryKey[casesIndex];
  const scope = queryKey[casesIndex + 1];
  const queryCaseId = queryKey[casesIndex + 2];
  const resource = queryKey[casesIndex + 3];

  return (
    root === "cases" && scope === "detail" && queryCaseId === caseId && resource === "documents"
  );
}

function getCaseDocumentsQueryParams(queryKey: readonly unknown[]) {
  const casesIndex = queryKey.findIndex((part) => part === "cases");
  const params = queryKey[casesIndex + 4];
  if (!params || typeof params !== "object") {
    return {};
  }

  return params as { categoryId?: string; cursor?: string; limit?: number };
}
