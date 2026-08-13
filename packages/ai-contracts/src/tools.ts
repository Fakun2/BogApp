export const aiToolIds = ["general", "case_summary", "case_documents", "case_deadlines"] as const;

export type AiTool = (typeof aiToolIds)[number];

export type AiToolDefinition = {
  id: AiTool;
  name: string;
  description: string;
  requiredPermissions: string[];
  requiresCase: boolean;
};

export const aiTools: AiToolDefinition[] = [
  {
    id: "general",
    name: "Chat general",
    description: "Responde sin consultar datos operativos del tenant.",
    requiredPermissions: [],
    requiresCase: false
  },
  {
    id: "case_summary",
    name: "Resumen de expediente",
    description: "Prepara respuestas usando solo datos de lectura del expediente indicado.",
    requiredPermissions: ["cases:read"],
    requiresCase: true
  },
  {
    id: "case_documents",
    name: "Documentos del expediente",
    description: "Permite orientar consultas sobre documentos ya existentes del expediente.",
    requiredPermissions: ["cases:read", "documents:read"],
    requiresCase: true
  },
  {
    id: "case_deadlines",
    name: "Vencimientos",
    description: "Permite orientar consultas sobre tareas y audiencias del expediente.",
    requiredPermissions: ["cases:read", "tasks:read", "hearings:read"],
    requiresCase: true
  }
];

export const aiToolsById = Object.fromEntries(aiTools.map((tool) => [tool.id, tool])) as Record<
  AiTool,
  AiToolDefinition
>;
