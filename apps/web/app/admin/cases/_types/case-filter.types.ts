export type CaseFiltersDraft = {
  court: string;
  filingDate: string;
  forumTemplateId: string;
  instance: string;
  judicialCenter: string;
  provinceId: string;
  search: string;
  status: string;
};

export type CaseFilterKey = keyof CaseFiltersDraft;
