import { AIMessage, AIResponse, AIModel } from "@/core/types";
import { openai } from "./client";

/**
 * Generates an AI response using the selected model
 * @param messages The conversation history
 * @param model The AI model to use for generation
 * @returns The AI response
 */
export async function generateAIResponse(
  messages: AIMessage[],
  model: AIModel
): Promise<AIResponse> {
  try {
    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    });

    return {
      content:
        response.choices[0]?.message?.content || "No response generated.",
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
    console.error("Error generating AI response:", error);
    throw error;
  }
}
