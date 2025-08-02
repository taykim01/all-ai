import OpenAI from "openai";
import { AIModel, AIResponse, ModelInfo } from "@/core/types";

// Environment variables check
const openaiApiKey = process.env.OPENAI_API_KEY;

/**
 * OpenAI client instance
 */
export const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
    })
  : null;

/**
 * Selects the best AI model based on the query content
 * @param query The user query to analyze
 * @returns The best AI model for the given query
 */
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

  // For creative tasks, general assistance
  if (
    lowerQuery.includes("creative") ||
    lowerQuery.includes("write") ||
    lowerQuery.includes("generate") ||
    lowerQuery.includes("idea") ||
    lowerQuery.includes("suggest") ||
    lowerQuery.includes("opinion") ||
    lowerQuery.includes("story") ||
    lowerQuery.includes("narrative")
  ) {
    // For short creative tasks
    if (queryLength < 100) {
      return "gpt-4.1-nano";
    }
    // For medium creative tasks
    return "gpt-4.1-mini";
  }

  // Default to the balanced choice for general queries
  return "gpt-4o";
}

/**
 * Gets detailed information about an AI model
 * @param model The AI model to get information about
 * @returns Detailed information about the model
 */
export function getModelInfo(model: AIModel): ModelInfo {
  const modelDetails: Record<AIModel, ModelInfo> = {
    "gpt-4.1": {
      name: "GPT-4.1",
      description: "Most capable model for deep analysis and complex tasks",
      costLevel: "high",
      contextWindow: 1000000,
      capabilities: ["complex reasoning", "code generation", "long context"],
    },
    "gpt-4.1-mini": {
      name: "GPT-4.1 Mini",
      description: "Efficient model with strong general capabilities",
      costLevel: "medium",
      contextWindow: 1000000,
      capabilities: ["balanced performance", "cost efficiency", "long context"],
    },
    "gpt-4.1-nano": {
      name: "GPT-4.1 Nano",
      description: "Fastest, most economical option for simpler tasks",
      costLevel: "low",
      contextWindow: 1000000,
      capabilities: ["speed", "cost efficiency", "basic tasks"],
    },
    "gpt-4o": {
      name: "GPT-4o",
      description: "Versatile model with strong multimodal capabilities",
      costLevel: "medium",
      contextWindow: 128000,
      capabilities: ["text", "image", "audio", "general purpose"],
    },
    o1: {
      name: "Claude O1",
      description: "Model focused on careful, methodical reasoning",
      costLevel: "medium",
      contextWindow: 200000,
      capabilities: ["step-by-step reasoning", "reliability", "thoroughness"],
    },
    o3: {
      name: "Claude O3",
      description: "Powerful model for complex reasoning tasks",
      costLevel: "high",
      contextWindow: 200000,
      capabilities: ["structured reasoning", "complex problems", "reliability"],
    },
    "o3-pro": {
      name: "Claude O3 Pro",
      description: "Most capable reasoning model for critical applications",
      costLevel: "high",
      contextWindow: 200000,
      capabilities: [
        "maximum reasoning",
        "sensitive tasks",
        "highest accuracy",
      ],
    },
    "o4-mini": {
      name: "Claude O4 Mini",
      description: "Compact visual reasoning model for quick tasks",
      costLevel: "low",
      contextWindow: 150000,
      capabilities: ["vision", "rapid response", "efficiency"],
    },
  };

  return modelDetails[model];
}
