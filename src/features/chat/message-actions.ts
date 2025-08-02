"use server";

import { createServerClient } from "@/infrastructure/supabase";
import { generateAIResponse, selectBestModel } from "@/infrastructure/ai";
import { revalidatePath } from "next/cache";
import { Message, AIMessage } from "@/core/types";

/**
 * Creates a new message
 * @param chatId The chat ID
 * @param role The message role (user or assistant)
 * @param content The message content
 * @param modelUsed The AI model used (for assistant messages)
 * @returns Success status and message data or error message
 */
export async function createMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string,
  modelUsed?: string
) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        role,
        content,
        model_used: modelUsed,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/chat/${chatId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating message:", error);
    return { success: false, error: "Failed to create message" };
  }
}

/**
 * Generates an AI response to a user message
 * @param chatId The chat ID
 * @param userMessage The user's message content
 * @returns Success status and message data or error message
 */
export async function generateResponse(chatId: string, userMessage: string) {
  try {
    // 1. Store the user message
    const userMsgResult = await createMessage(chatId, "user", userMessage);
    if (!userMsgResult.success) {
      throw new Error(userMsgResult.error as string);
    }

    // 2. Get chat history for context
    const supabase = await createServerClient();
    const { data: messages, error: historyError } = await supabase
      .from("messages")
      .select()
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (historyError) throw historyError;

    // 3. Format messages for AI
    const aiMessages: AIMessage[] = messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // Add system message if not present
    if (!aiMessages.some((msg) => msg.role === "system")) {
      aiMessages.unshift({
        role: "system",
        content:
          "You are a helpful AI assistant. Provide concise, accurate, and helpful responses.",
      });
    }

    // 4. Select best model based on user query
    const bestModel = selectBestModel(userMessage);

    // 5. Generate AI response
    const aiResponse = await generateAIResponse(aiMessages, bestModel);

    // 6. Store AI response
    const assistantMsgResult = await createMessage(
      chatId,
      "assistant",
      aiResponse.content,
      bestModel
    );

    if (!assistantMsgResult.success) {
      throw new Error(assistantMsgResult.error as string);
    }

    // 7. Update chat title if it's the first message
    if (messages.length <= 2) {
      await updateChatTitleFromMessages(chatId);
    }

    return { success: true, data: assistantMsgResult.data };
  } catch (error) {
    console.error("Error generating response:", error);
    return { success: false, error: "Failed to generate response" };
  }
}

/**
 * Gets messages for a chat
 * @param chatId The chat ID
 * @returns Success status and messages data or error message
 */
export async function getMessages(chatId: string) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

/**
 * Updates a chat title based on its messages
 * @param chatId The chat ID
 * @returns Success status and updated chat data or error message
 */
async function updateChatTitleFromMessages(chatId: string) {
  try {
    const supabase = await createServerClient();

    // Get the first user message
    const { data: messages, error } = await supabase
      .from("messages")
      .select()
      .eq("chat_id", chatId)
      .eq("role", "user")
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) throw error;
    if (!messages || messages.length === 0) return { success: false };

    // Generate a title (first 40 chars of first message)
    const title =
      messages[0].content.slice(0, 40) +
      (messages[0].content.length > 40 ? "..." : "");

    // Update chat title
    const { data, error: updateError } = await supabase
      .from("chats")
      .update({ title })
      .eq("id", chatId)
      .select()
      .single();

    if (updateError) throw updateError;

    revalidatePath(`/chat/${chatId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating chat title:", error);
    return { success: false, error: "Failed to update chat title" };
  }
}
