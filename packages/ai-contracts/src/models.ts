export const aiModelIds = ["bogapp-legal", "reasoning", "fast"] as const;

export type AiModel = (typeof aiModelIds)[number];

export type AiModelDefinition = {
  id: AiModel;
  name: string;
  provider: "openai" | "mock";
};

export const aiModels: AiModelDefinition[] = [
  { id: "bogapp-legal", name: "BogApp Legal", provider: "openai" },
  { id: "reasoning", name: "Razonamiento", provider: "openai" },
  { id: "fast", name: "Rapido", provider: "openai" }
];
