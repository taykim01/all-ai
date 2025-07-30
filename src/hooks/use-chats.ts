import { useCallback } from "react";
import { getUserChats, createChat, deleteChat } from "@/app/actions/chat";
import { useChatStore } from "@/stores";
import type { Tables } from "@/types/database.types";

type Chat = Tables<"chats">;

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

        const result = await getUserChats(userId);

        if (result.success && result.data) {
          setChats(result.data);
        } else {
          setError(result.error || "Failed to fetch chats");
          setChats([]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError("Failed to fetch chats");
        setChats([]);
      } finally {
        setLoading(false);
      }
    },
    [setChats, setLoading, setError, clearChats]
  );

  const createNewChat = useCallback(
    async (userId: string, title: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await createChat(userId, title);

        if (result.success && result.data) {
          addChat(result.data);
          return result.data;
        } else {
          setError(result.error || "Failed to create chat");
          return null;
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        setError("Failed to create chat");
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
          setError(result.error || "Failed to delete chat");
          return false;
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
        setError("Failed to delete chat");
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
    createNewChat,
    deleteChatById,
    clearChats,
  };
}
