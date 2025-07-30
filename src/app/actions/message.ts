"use server";

import { createClient } from "@/lib/supabase";
import { generateAIResponse, selectBestModel, type AIMessage } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/types/database.types";

type Message = Tables<"messages">;

export async function createMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string,
  modelUsed?: string
) {
  try {
    const supabase = await createClient();
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

// Alias for backward compatibility and clearer naming
export const sendMessage = createMessage;

export async function getChatMessages(chatId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function generateResponse(chatId: string, userMessage: string) {
  try {
    const supabase = await createClient();

    // First, save the user message
    const userMsgResult = await createMessage(chatId, "user", userMessage);
    if (!userMsgResult.success) {
      throw new Error("Failed to save user message");
    }

    // Get chat history for context
    const historyResult = await getChatMessages(chatId);
    if (!historyResult.success || !historyResult.data) {
      throw new Error("Failed to get chat history");
    }

    // Convert to AI message format
    const messages: AIMessage[] = historyResult.data.map((msg: Message) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Select the best model for this query
    const selectedModel = selectBestModel(userMessage);

    // Generate AI response
    const aiResponse = await generateAIResponse(messages, selectedModel);

    // Save the assistant message
    const assistantMsgResult = await createMessage(
      chatId,
      "assistant",
      aiResponse.content,
      selectedModel
    );

    if (!assistantMsgResult.success) {
      throw new Error("Failed to save assistant message");
    }

    // Update chat timestamp
    await supabase
      .from("chats")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatId);

    revalidatePath(`/chat/${chatId}`);
    return {
      success: true,
      data: {
        userMessage: userMsgResult.data,
        assistantMessage: assistantMsgResult.data,
        modelUsed: selectedModel,
      },
    };
  } catch (error) {
    console.error("Error generating response:", error);
    return { success: false, error: "Failed to generate response" };
  }
}
