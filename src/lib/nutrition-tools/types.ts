export type ToolGroup = "A" | "B" | "C" | "D";

export type ToolStatus =
  | "Research Pending"
  | "Research Completed"
  | "Design Completed"
  | "Implemented"
  | "Tested"
  | "Ready"
  | "Blocked";

export type NutritionTool = {
  id: string;
  slug: string;
  group: ToolGroup;
  groupLabel: string;
  title: string;
  summary: string;
  minutes: number;
  audience: string;
  method: string;
  sources: string[];
  limits: string[];
  warnings: string[];
  status: ToolStatus;
  relatedHrefs?: string[];
  /** Blocked tools: resmi dış link */
  externalHref?: string;
};
