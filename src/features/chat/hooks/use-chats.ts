"use client";

import { useCallback } from "react";
import { getChats, createChat, deleteChat } from "@/features/chat/actions";
import { useChatStore } from "@/core/stores";
import { Chat } from "@/core/types";

/**
 * Custom hook for managing chats
 * @returns Chat state and methods
 */
export function useChats() {
  const {
    chats,
    loading,
    error,
    setChats,
    addChat,
    removeChat,
    setLoading,
    setError,
    clearChats,
  } = useChatStore();

  const fetchChats = useCallback(
    async (userId: string) => {
      if (!userId) {
        clearChats();
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getChats(userId);

        if (result.success) {
          setChats(result.data as Chat[]);
        } else {
          setError(result.error as string);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    },
    [setChats, setLoading, setError, clearChats]
  );

  const createNewChat = useCallback(
    async (userId: string, title: string = "New Chat") => {
      try {
        setLoading(true);
        setError(null);
        const result = await createChat(userId, title);

        if (result.success) {
          addChat(result.data as Chat);
          return result.data;
        } else {
          setError(result.error as string);
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create chat";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [addChat, setLoading, setError]
  );

  const deleteChatById = useCallback(
    async (chatId: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await deleteChat(chatId);

        if (result.success) {
          removeChat(chatId);
          return true;
        } else {
          setError(result.error as string);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete chat");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removeChat, setLoading, setError]
  );

  return {
    chats,
    loading,
    error,
    fetchChats,
    createChat: createNewChat,
    deleteChat: deleteChatById,
  };
}
