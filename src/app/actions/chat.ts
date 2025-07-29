"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createChat(userId: string, title: string) {
  try {
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

export async function updateChatTitle(chatId: string, title: string) {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", chatId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/chat");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating chat title:", error);
    return { success: false, error: "Failed to update chat title" };
  }
}

export async function deleteChat(chatId: string) {
  try {
    const { error } = await supabase.from("chats").delete().eq("id", chatId);

    if (error) throw error;

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}

export async function getUserChats(userId: string) {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return { success: false, error: "Failed to fetch chats" };
  }
}
