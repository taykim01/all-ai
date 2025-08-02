import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Chat } from "@/core/types";

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  loading: boolean;
  error: string | null;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  setCurrentChatId: (chatId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      loading: false,
      error: null,
      setChats: (chats) => set({ chats, error: null }),
      addChat: (chat) =>
        set((state) => ({
          chats: [chat, ...state.chats],
          error: null,
        })),
      removeChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId:
            state.currentChatId === chatId ? null : state.currentChatId,
          error: null,
        })),
      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updates } : chat
          ),
          error: null,
        })),
      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearChats: () =>
        set({
          chats: [],
          currentChatId: null,
          loading: false,
          error: null,
        }),
    }),
    { name: "chat-store" }
  )
);
