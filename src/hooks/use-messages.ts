import { useCallback } from "react";
import { getChatMessages, sendMessage } from "@/app/actions/message";
import { useMessageStore } from "@/stores";
import type { Tables } from "@/types/database.types";

type Message = Tables<"messages">;

export function useMessages() {
  const {
    messagesByChatId,
    loading,
    error,
    setMessages,
    addMessage,
    setLoading,
    setError,
    clearMessages,
  } = useMessageStore();

  const getMessages = useCallback(
    (chatId: string): Message[] => {
      return messagesByChatId[chatId] || [];
    },
    [messagesByChatId]
  );

  const fetchMessages = useCallback(
    async (chatId: string) => {
      if (!chatId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getChatMessages(chatId);

        if (result.success && result.data) {
          setMessages(chatId, result.data);
        } else {
          setError(result.error || "Failed to fetch messages");
          setMessages(chatId, []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages");
        setMessages(chatId, []);
      } finally {
        setLoading(false);
      }
    },
    [setMessages, setLoading, setError]
  );

  const sendNewMessage = useCallback(
    async (
      chatId: string,
      content: string,
      role: "user" | "assistant" = "user"
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await sendMessage(
          chatId,
          content as "user" | "assistant",
          role
        );

        if (result.success && result.data) {
          addMessage(chatId, result.data);
          return result.data;
        } else {
          setError(result.error || "Failed to send message");
          return null;
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [addMessage, setLoading, setError]
  );

  return {
    getMessages,
    loading,
    error,
    fetchMessages,
    sendNewMessage,
    clearMessages,
  };
}
