import OpenAI from "openai";

// Environment variables check
const openaiApiKey = process.env.OPENAI_API_KEY;

// OpenAI client
export const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
    })
  : null;

// Available GPT Models with their specifications
export type AIModel =
  | "gpt-4.1"           // Best for deep code tasks, instruction-following, long-context work (1M tokens)
  | "gpt-4.1-mini"      // Faster, lower-cost mini version with 1M token window
  | "gpt-4.1-nano"      // Smallest, cheapest, fastest variant with 1M token context
  | "gpt-4o"            // Original multimodal "omni" model - text, image, audio
  | "o1"                // Reasoning-focused model that "thinks before answering"
  | "o3"                // Successor to o1 with stronger structured reasoning
  | "o3-pro"            // Most capable variant of o3, optimized for maximum reasoning quality
  | "o4-mini";          // Compact reasoning model with moderate reasoning and vision support

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

// Model selection logic based on query characteristics and model strengths
export function selectBestModel(query: string): AIModel {
  const lowerQuery = query.toLowerCase();
  const queryLength = query.length;

  // Complex reasoning, mathematics, competitive programming - use reasoning models
  if (
    lowerQuery.includes("math") ||
    lowerQuery.includes("calcul") ||
    lowerQuery.includes("equation") ||
    lowerQuery.includes("proof") ||
    lowerQuery.includes("logic") ||
    lowerQuery.includes("algorithm") ||
    lowerQuery.includes("competitive programming") ||
    lowerQuery.includes("solve") ||
    lowerQuery.includes("problem") ||
    lowerQuery.includes("reasoning")
  ) {
    // For ultra-complex tasks requiring maximum reliability
    if (
      lowerQuery.includes("research") ||
      lowerQuery.includes("legal") ||
      lowerQuery.includes("scientific") ||
      lowerQuery.includes("strategic")
    ) {
      return "o3-pro";
    }
    // For general complex reasoning
    return "o3";
  }

  // Deep code tasks, large codebases, instruction-following
  if (
    lowerQuery.includes("code") ||
    lowerQuery.includes("program") ||
    lowerQuery.includes("debug") ||
    lowerQuery.includes("function") ||
    lowerQuery.includes("class") ||
    lowerQuery.includes("method") ||
    lowerQuery.includes("implementation") ||
    lowerQuery.includes("codebase") ||
    lowerQuery.includes("development") ||
    lowerQuery.includes("software") ||
    queryLength > 2000 // Long-context work
  ) {
    return "gpt-4.1";
  }

  // Real-time visual reasoning, rapid coding assistance
  if (
    lowerQuery.includes("visual") ||
    lowerQuery.includes("image") ||
    lowerQuery.includes("quick") ||
    lowerQuery.includes("rapid") ||
    lowerQuery.includes("fast") ||
    lowerQuery.includes("document") ||
    lowerQuery.includes("extract") ||
    lowerQuery.includes("analytics")
  ) {
    return "o4-mini";
  }

  // Multimodal tasks - voice, image, audio, real-time translation
  if (
    lowerQuery.includes("image") ||
    lowerQuery.includes("audio") ||
    lowerQuery.includes("voice") ||
    lowerQuery.includes("translate") ||
    lowerQuery.includes("multilingual") ||
    lowerQuery.includes("photo") ||
    lowerQuery.includes("picture")
  ) {
    return "gpt-4o";
  }

  // High-volume structured queries, classification (use fastest, cheapest)
  if (
    lowerQuery.includes("classify") ||
    lowerQuery.includes("category") ||
    lowerQuery.includes("tag") ||
    lowerQuery.includes("label") ||
    queryLength < 100 // Short queries
  ) {
    return "gpt-4.1-nano";
  }

  // Everyday tasks: summarization, light coding, email drafting, Q&A
  if (
    lowerQuery.includes("summarize") ||
    lowerQuery.includes("summary") ||
    lowerQuery.includes("email") ||
    lowerQuery.includes("draft") ||
    lowerQuery.includes("write") ||
    lowerQuery.includes("explain") ||
    lowerQuery.includes("what is") ||
    lowerQuery.includes("how to") ||
    queryLength < 500
  ) {
    return "gpt-4.1-mini";
  }

  // Default to GPT-4.1 for general complex tasks
  return "gpt-4.1";
}

// Generate response using selected GPT model
export async function generateAIResponse(
  messages: AIMessage[],
  model: AIModel
): Promise<AIResponse> {
  try {
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }

    // Map our model names to actual OpenAI model names
    const getOpenAIModelName = (model: AIModel): string => {
      switch (model) {
        case "gpt-4.1":
          return "gpt-4"; // Use gpt-4 as placeholder until 4.1 is available
        case "gpt-4.1-mini":
          return "gpt-4"; // Use gpt-4 as placeholder until 4.1-mini is available
        case "gpt-4.1-nano":
          return "gpt-3.5-turbo"; // Use 3.5-turbo as fastest option
        case "gpt-4o":
          return "gpt-4o";
        case "o1":
          return "o1-preview"; // Use o1-preview as available o1 variant
        case "o3":
          return "gpt-4"; // Use gpt-4 as placeholder until o3 is available
        case "o3-pro":
          return "gpt-4"; // Use gpt-4 as placeholder until o3-pro is available
        case "o4-mini":
          return "gpt-4o-mini"; // Use gpt-4o-mini as closest available
        default:
          return "gpt-4";
      }
    };

    const openaiModel = getOpenAIModelName(model);

    // Configure parameters based on model type
    const getModelConfig = (model: AIModel) => {
      switch (model) {
        case "gpt-4.1-nano":
          return { temperature: 0.3, max_tokens: 1000 }; // Fast and efficient
        case "gpt-4.1-mini":
          return { temperature: 0.5, max_tokens: 2000 }; // Balanced for everyday tasks
        case "o1":
        case "o3":
        case "o3-pro":
          return { temperature: 0.1, max_tokens: 4000 }; // Low temp for reasoning
        case "o4-mini":
          return { temperature: 0.4, max_tokens: 1500 }; // Quick responses
        case "gpt-4o":
          return { temperature: 0.6, max_tokens: 3000 }; // Multimodal tasks
        case "gpt-4.1":
        default:
          return { temperature: 0.7, max_tokens: 4000 }; // Default configuration
      }
    };

    const config = getModelConfig(model);

    const response = await openai.chat.completions.create({
      model: openaiModel,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: config.temperature,
      max_tokens: config.max_tokens,
    });

    return {
      content: response.choices[0]?.message?.content || "",
      model,
      usage: response.usage
        ? {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    console.error(`Error generating response with ${model}:`, error);
    throw error;
  }
}

// Get model information for display purposes
export function getModelInfo(model: AIModel): {
  name: string;
  description: string;
  strengths: string[];
  costLevel: "low" | "medium" | "high";
} {
  switch (model) {
    case "gpt-4.1":
      return {
        name: "GPT-4.1",
        description: "Best for deep code tasks, instruction-following, long-context work (up to 1M tokens)",
        strengths: ["Development agents", "Large codebases", "Structured workflows", "SWE-bench Verified ~54.6%"],
        costLevel: "medium"
      };
    case "gpt-4.1-mini":
      return {
        name: "GPT-4.1 Mini",
        description: "Faster, lower-cost mini version of GPT-4.1 with same 1M token window",
        strengths: ["Summarization", "Light coding", "Email drafting", "Q&A", "CG-based writing"],
        costLevel: "low"
      };
    case "gpt-4.1-nano":
      return {
        name: "GPT-4.1 Nano",
        description: "Smallest, cheapest, fastest variant with 1M token context",
        strengths: ["High-volume queries", "Classification", "Prompting pipelines", "Speed"],
        costLevel: "low"
      };
    case "gpt-4o":
      return {
        name: "GPT-4o",
        description: "Original multimodal 'omni' model—supports text, image, audio input natively",
        strengths: ["Voice assistants", "Image input", "Multilingual chat", "Real-time translation"],
        costLevel: "medium"
      };
    case "o1":
      return {
        name: "o1",
        description: "Reasoning-focused model that 'thinks before answering'",
        strengths: ["Competitive programming", "Mathematics", "Complex logic", "STEM reasoning"],
        costLevel: "high"
      };
    case "o3":
      return {
        name: "o3",
        description: "Successor to o1 with stronger structured reasoning and image support",
        strengths: ["Multi-step logic", "Research", "Legal analysis", "Scientific tasks", "SWE-bench ~71.7%"],
        costLevel: "high"
      };
    case "o3-pro":
      return {
        name: "o3 Pro",
        description: "Most capable variant of o3, optimized for maximum reasoning quality over speed",
        strengths: ["Ultra-reliable outcomes", "Complex research", "Legal analysis", "Strategic decisions"],
        costLevel: "high"
      };
    case "o4-mini":
      return {
        name: "o4 Mini",
        description: "Compact reasoning model with moderate reasoning and vision support",
        strengths: ["Real-time visual reasoning", "Rapid coding", "Document extraction", "Analytics"],
        costLevel: "low"
      };
    default:
      return {
        name: "GPT-4.1",
        description: "Default model for general tasks",
        strengths: ["General purpose"],
        costLevel: "medium"
      };
  }
}

// Check if query needs clarification
export function needsClarification(query: string): boolean {
  const clarificationIndicators = [
    "what do you mean",
    "can you clarify",
    "i don't understand",
    "unclear",
    "ambiguous",
    "?",
  ];

  const lowerQuery = query.toLowerCase();

  // Very short queries might need clarification
  if (query.trim().length < 10) {
    return true;
  }

  // Check for clarification indicators
  return clarificationIndicators.some((indicator) =>
    lowerQuery.includes(indicator)
  );
}

// Check if additional internet search is needed
export function needsInternetSearch(query: string): boolean {
  const searchIndicators = [
    "current",
    "latest",
    "recent",
    "news",
    "today",
    "this year",
    "2024",
    "2025",
    "what happened",
    "stock price",
    "weather",
    "real-time",
  ];

  const lowerQuery = query.toLowerCase();

  return searchIndicators.some((indicator) => lowerQuery.includes(indicator));
}
