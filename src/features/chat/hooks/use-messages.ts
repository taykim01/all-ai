"use client";

import { useCallback } from "react";
import {
  getMessages as fetchMessagesFromAction,
  generateResponse,
} from "@/features/chat/message-actions";
import { useMessageStore } from "@/core/stores";
import { Message } from "@/core/types";

/**
 * Custom hook for managing messages
 * @returns Message state and methods
 */
export function useMessages() {
  const {
    messagesByChatId,
    loading,
    error,
    setMessages,
    // addMessage, // Removed unused variable
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
        const result = await fetchMessagesFromAction(chatId);

        if (result.success) {
          setMessages(chatId, result.data as Message[]);
        } else {
          setError(result.error as string);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
      } finally {
        setLoading(false);
      }
    },
    [setMessages, setLoading, setError]
  );

  const sendUserMessage = useCallback(
    async (chatId: string, content: string) => {
      try {
        setLoading(true);
        setError(null);

        // We'll generate response from the server action
        const result = await generateResponse(chatId, content);

        if (result.success) {
          // Refresh all messages to ensure we have the latest state
          await fetchMessages(chatId);
          return true;
        } else {
          setError(result.error as string);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMessages, setLoading, setError]
  );

  return {
    getMessages,
    loading,
    error,
    fetchMessages,
    sendMessage: sendUserMessage,
    clearMessages,
  };
}
