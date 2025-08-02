"use server";

import { createServerClient } from "@/infrastructure/supabase";
import { revalidatePath } from "next/cache";

/**
 * Creates a new chat
 * @param userId The user ID who owns the chat
 * @param title The title of the chat
 * @returns Success status and chat data or error message
 */
export async function createChat(userId: string, title: string) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: userId,
        title,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/chat");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, error: "Failed to create chat" };
  }
}

/**
 * Updates a chat title
 * @param chatId The chat ID to update
 * @param title The new title
 * @returns Success status and updated chat data or error message
 */
export async function updateChatTitle(chatId: string, title: string) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("chats")
      .update({ title })
      .eq("id", chatId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/chat/${chatId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating chat title:", error);
    return { success: false, error: "Failed to update chat title" };
  }
}

/**
 * Deletes a chat
 * @param chatId The chat ID to delete
 * @returns Success status or error message
 */
export async function deleteChat(chatId: string) {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from("chats").delete().eq("id", chatId);

    if (error) throw error;

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}

/**
 * Gets all chats for a user
 * @param userId The user ID
 * @returns Success status and chats data or error message
 */
export async function getChats(userId: string) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("chats")
      .select()
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { success: false, error: "Failed to fetch chats" };
  }
}
