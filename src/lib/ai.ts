import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Google Gemini client
export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// AI Model types
export type AIModel =
  | "gpt-4"
  | "gpt-3.5-turbo"
  | "gemini-pro"
  | "gemini-pro-vision";

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

// Model selection logic based on query characteristics
export function selectBestModel(query: string): AIModel {
  const lowerQuery = query.toLowerCase();

  // Check for code-related queries - GPT-4 is better for coding
  if (
    lowerQuery.includes("code") ||
    lowerQuery.includes("program") ||
    lowerQuery.includes("debug") ||
    lowerQuery.includes("function") ||
    lowerQuery.includes("algorithm")
  ) {
    return "gpt-4";
  }

  // Check for creative writing - GPT models are generally better
  if (
    lowerQuery.includes("write") ||
    lowerQuery.includes("story") ||
    lowerQuery.includes("creative") ||
    lowerQuery.includes("poem") ||
    lowerQuery.includes("essay")
  ) {
    return "gpt-4";
  }

  // Check for analysis and research - Gemini is good for factual content
  if (
    lowerQuery.includes("analyze") ||
    lowerQuery.includes("research") ||
    lowerQuery.includes("explain") ||
    lowerQuery.includes("compare") ||
    lowerQuery.includes("summarize")
  ) {
    return "gemini-pro";
  }

  // For long queries or complex reasoning, use GPT-4
  if (query.length > 500) {
    return "gpt-4";
  }

  // Default to GPT-3.5 for general queries (faster and cheaper)
  return "gpt-3.5-turbo";
}

// Generate response using selected model
export async function generateAIResponse(
  messages: AIMessage[],
  model: AIModel
): Promise<AIResponse> {
  try {
    if (model.startsWith("gpt-")) {
      const response = await openai.chat.completions.create({
        model: model as "gpt-4" | "gpt-3.5-turbo",
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 2000,
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
    }

    if (model.startsWith("gemini-")) {
      const genModel = gemini.getGenerativeModel({ model: "gemini-pro" });

      // Convert messages to Gemini format
      const prompt = messages
        .map((msg) => {
          if (msg.role === "system") return `System: ${msg.content}`;
          if (msg.role === "user") return `User: ${msg.content}`;
          return `Assistant: ${msg.content}`;
        })
        .join("\n\n");

      const result = await genModel.generateContent(prompt);
      const response = await result.response;

      return {
        content: response.text(),
        model,
      };
    }

    throw new Error(`Unsupported model: ${model}`);
  } catch (error) {
    console.error(`Error generating response with ${model}:`, error);
    throw error;
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
