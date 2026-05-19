export type BrainCategory = "ai" | "dating" | "fitness-food";

export type Channel = {
  name: string;
  handle?: string;
  category: BrainCategory;
  priority: "core" | "useful" | "low";
  notes: string;
};

export type RadarVideo = {
  id: string;
  title: string;
  channel: string;
  category: BrainCategory;
  publishedAt: string;
  summary: string;
  whyItMatters: string;
  action: string;
  status: "new" | "saved" | "ignore" | "try-this-week";
  tags: string[];
};

export type CaptureCategory =
  | "AI Brain"
  | "Dating"
  | "Fitness/Food"
  | "General Signal";

export type CaptureIntent =
  | "Ask the brain"
  | "Save idea"
  | "Analyze message"
  | "Create action plan"
  | "Summarize";

export type CaptureInputCategory =
  | "Auto"
  | "AI Brain"
  | "Dating"
  | "Fitness/Food";

export type BrainResponse = {
  detectedCategory: CaptureCategory;
  meaning: string;
  recommendedAction: string;
  savedNotePreview: string;
  priority: number;
};

export type Capture = {
  id: string;
  title: string;
  category: CaptureCategory;
  intent: CaptureIntent;
  rawInput: string;
  summary: string;
  response: string;
  priority: number;
  sourceType: string;
  createdAt: string;
};
