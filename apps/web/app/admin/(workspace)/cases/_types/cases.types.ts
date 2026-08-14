export type CaseStatus = "open" | "paused" | "closed";
export type CaseInstance = "first" | "second" | "third";
export type CaseCatalogStrategy = "manual" | "center_forum";
export type CaseTaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type CaseExpenseStatus = "pending" | "paid" | "cancelled" | "overdue";
export type CaseHearingType =
  | "preliminary"
  | "trial_view"
  | "conciliation"
  | "mediation"
  | "testimonial"
  | "confessional"
  | "debate"
  | "investigative_statement"
  | "other";

export type ProvinceDto = {
  caseCatalogStrategy: CaseCatalogStrategy;
  id: string;
  code: string;
  name: string;
};

export type ForumDto = {
  id: string;
  judicialCenterForumId: string | null;
  name: string;
};

export type JudicialCenterDto = {
  id: string;
  code: string;
  name: string;
};

export type CatalogResponse<TItem> = {
  items: TItem[];
};

export type CaseDto = {
  id: string;
  caseNumber: string;
  caption: string;
  subject: string | null;
  description: string | null;
  province: ProvinceDto;
  forum: ForumDto;
  judicialCenter: JudicialCenterDto | null;
  judicialCenterForumId: string | null;
  judicialCenterText: string | null;
  court: string | null;
  instance: CaseInstance;
  status: CaseStatus;
  filingDate: string | null;
  primaryClientId: string | null;
  practiceAreaId: string | null;
  responsibleMembershipId: string | null;
  participants: Array<{
    id?: string;
    participantKind: "client" | "opposing_party" | "third_party" | "other";
    role:
      | "claimant"
      | "defendant"
      | "complainant"
      | "accused"
      | "third_party"
      | "client"
      | "opposing_party"
      | "other";
    displayName: string;
    document?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    clientId?: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type CaseTaskDto = {
  id: string;
  caseId: string;
  assignedMembershipId: string | null;
  assignedTo: TaskAssigneeOption | null;
  name: string;
  startDate: string | null;
  endDate: string | null;
  status: CaseTaskStatus;
  notes: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskAssigneeOption = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  roleName: string | null;
};

export type CaseExpenseDto = {
  id: string;
  caseId: string;
  taskId: string | null;
  task: { id: string; name: string } | null;
  alertAt: string | null;
  alertEnabled: boolean;
  attachments: CaseExpenseAttachmentDto[];
  concept: string;
  amount: number;
  currencyCode: string;
  expenseDate: string;
  paymentDate: string;
  status: CaseExpenseStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CaseExpenseAttachmentDto = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type CaseHearingDto = {
  id: string;
  caseId: string;
  type: CaseHearingType;
  date: string;
  time: string;
  description: string;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CaseMetricsDto = {
  totalExpenses: number;
  pendingPayments: number;
  totalTasks: number;
  pendingTasks: number;
};

export type CaseDetailDto = CaseDto & {
  metrics: CaseMetricsDto;
};

export type CasesMetricsDto = {
  totalCases: number;
  openCases: number;
  closedCases: number;
  pendingTasks: number;
};

export type CaseTasksListResponse = {
  items: CaseTaskDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CaseExpensesListResponse = {
  items: CaseExpenseDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CaseHearingsListResponse = {
  items: CaseHearingDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CaseExpenseSummaryItemDto = {
  id: string;
  concept: string;
  amount: number;
  percentage: number;
};

export type CaseExpensesSummaryDto = {
  totalAmount: number;
  totalCount: number;
  items: CaseExpenseSummaryItemDto[];
};

export type CaseCalendarEventDto = {
  amount?: number;
  currencyCode?: string;
  date: string;
  id: string;
  status?: CaseExpenseStatus | string;
  hearingType?: CaseHearingType;
  time?: string;
  title: string;
  type: "payment_due" | "hearing" | "task_due";
};

export type CaseCalendarResponseDto = {
  events: CaseCalendarEventDto[];
  month: string;
  pageInfo?: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CaseExpenseAttachmentsListResponse = {
  items: CaseExpenseAttachmentDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CasesListResponse = {
  items: CaseDto[];
  pageInfo: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: string | null;
    offset: number;
    total: number;
  };
};

export type CasesQueryParams = {
  court?: string;
  cursor?: string;
  filingDate?: string;
  forumTemplateId?: string;
  instance?: CaseInstance;
  judicialCenter?: string;
  limit: number;
  offset: number;
  provinceId?: string;
  search?: string;
  status?: string;
  sortBy: CaseSortKey;
  sortDirection: CaseSortDirection;
};

export type CasesTableColumn =
  keyof typeof import("../_constants/cases.constants").casesTableColumnLabels;
export type CaseTasksTableColumn =
  keyof typeof import("../_constants/cases.constants").caseTasksTableColumnLabels;
export type CaseSortDirection = "asc" | "desc";
export type CaseSortKey = "caseNumber" | "caption" | "createdAt" | "status";

export type CasesPageSearchParams = {
  columns?: string;
  cursor?: string;
  cursorStack?: string;
  court?: string;
  filingDate?: string;
  forumTemplateId?: string;
  instance?: string;
  judicialCenter?: string;
  provinceId?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
};
