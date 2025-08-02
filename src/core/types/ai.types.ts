// Available AI Models with their specifications
export type AIModel =
  | "gpt-4.1" // Best for deep code tasks, instruction-following, long-context work (1M tokens)
  | "gpt-4.1-mini" // Faster, lower-cost mini version with 1M token window
  | "gpt-4.1-nano" // Smallest, cheapest, fastest variant with 1M token context
  | "gpt-4o" // Original multimodal "omni" model - text, image, audio
  | "o1" // Reasoning-focused model that "thinks before answering"
  | "o3" // Successor to o1 with stronger structured reasoning
  | "o3-pro" // Most capable variant of o3, optimized for maximum reasoning quality
  | "o4-mini"; // Compact reasoning model with moderate reasoning and vision support

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelInfo {
  name: string;
  description: string;
  costLevel: "low" | "medium" | "high";
  contextWindow: number;
  capabilities: string[];
}
