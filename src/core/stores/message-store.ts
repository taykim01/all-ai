import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Message } from "@/core/types";

interface MessageState {
  messagesByChatId: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  clearMessages: (chatId?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageState>()(
  devtools(
    (set, get) => ({
      messagesByChatId: {},
      loading: false,
      error: null,
      setMessages: (chatId, messages) =>
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: messages,
          },
          error: null,
        })),
      addMessage: (chatId, message) =>
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: [...(state.messagesByChatId[chatId] || []), message],
          },
          error: null,
        })),
      updateMessage: (chatId, messageId, updates) =>
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: (state.messagesByChatId[chatId] || []).map((message) =>
              message.id === messageId ? { ...message, ...updates } : message
            ),
          },
          error: null,
        })),
      removeMessage: (chatId, messageId) =>
        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: (state.messagesByChatId[chatId] || []).filter(
              (message) => message.id !== messageId
            ),
          },
          error: null,
        })),
      clearMessages: (chatId) =>
        set((state) => ({
          messagesByChatId: chatId
            ? {
                ...state.messagesByChatId,
                [chatId]: [],
              }
            : {},
          error: null,
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "message-store" }
  )
);
