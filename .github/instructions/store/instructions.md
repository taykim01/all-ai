---
applyTo: "src/store/**"
---

# Store Directory Instructions

## Overview

The `src/store` directory contains global state management using Zustand for client-side state and React Context for server-state integration.

## State Management Philosophy

- Use Zustand for complex client-side state
- Use React Context for simple shared state
- Server state is managed through Server Actions and React hooks
- Minimize global state - prefer local state when possible

## Store Structure

### Authentication Store

```typescript
// auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  logout: () => void;
}

interface UserPreferences {
  preferredAIModel: AIModel;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      preferences: {
        preferredAIModel: "gpt-4",
        theme: "system",
        language: "en",
        notifications: {
          email: true,
          push: false,
        },
      },

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);
```

### Chat Store

```typescript
// chat-store.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { type Conversation, type Message } from "@/types/chat";

interface ChatState {
  activeConversationId: string | null;
  conversations: Record<string, Conversation>;
  isLoading: boolean;
  error: string | null;
}

interface ChatActions {
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessage: (conversationId: string, message: Message) => void;
  removeConversation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  subscribeWithSelector((set, get) => ({
    // State
    activeConversationId: null,
    conversations: {},
    isLoading: false,
    error: null,

    // Actions
    setActiveConversation: (id) => set({ activeConversationId: id }),

    addConversation: (conversation) =>
      set((state) => ({
        conversations: {
          ...state.conversations,
          [conversation.id]: conversation,
        },
      })),

    updateConversation: (id, updates) =>
      set((state) => ({
        conversations: {
          ...state.conversations,
          [id]: { ...state.conversations[id], ...updates },
        },
      })),

    addMessage: (conversationId, message) =>
      set((state) => {
        const conversation = state.conversations[conversationId];
        if (!conversation) return state;

        return {
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...conversation,
              messages: [...conversation.messages, message],
              updatedAt: new Date(),
            },
          },
        };
      }),

    removeConversation: (id) =>
      set((state) => {
        const { [id]: removed, ...rest } = state.conversations;
        return {
          conversations: rest,
          activeConversationId:
            state.activeConversationId === id
              ? null
              : state.activeConversationId,
        };
      }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  }))
);

// Selectors
export const useActiveConversation = () => {
  return useChatStore((state) => {
    const id = state.activeConversationId;
    return id ? state.conversations[id] : null;
  });
};

export const useConversationMessages = (conversationId: string) => {
  return useChatStore(
    (state) => state.conversations[conversationId]?.messages || []
  );
};
```

### UI Store

```typescript
// ui-store.ts
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  modalStack: string[];
  toasts: Toast[];
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // State
  sidebarOpen: true,
  theme: "system",
  modalStack: [],
  toasts: [],

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),

  openModal: (modalId) =>
    set((state) => ({
      modalStack: [...state.modalStack, modalId],
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modalStack: state.modalStack.filter((id) => id !== modalId),
    })),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
```

### AI Store

```typescript
// ai-store.ts
import { create } from "zustand";
import { type AIModel, type AIResponse } from "@/types/ai";

interface AIState {
  selectedModel: AIModel;
  modelPreferences: Record<string, AIModel>; // query type -> preferred model
  responseHistory: AIResponse[];
  isGenerating: boolean;
  usage: {
    totalTokens: number;
    requestCount: number;
    resetDate: Date;
  };
}

interface AIActions {
  setSelectedModel: (model: AIModel) => void;
  setModelPreference: (queryType: string, model: AIModel) => void;
  addResponse: (response: AIResponse) => void;
  setGenerating: (generating: boolean) => void;
  updateUsage: (tokens: number) => void;
  resetUsage: () => void;
}

export const useAIStore = create<AIState & AIActions>((set, get) => ({
  // State
  selectedModel: "gpt-4",
  modelPreferences: {},
  responseHistory: [],
  isGenerating: false,
  usage: {
    totalTokens: 0,
    requestCount: 0,
    resetDate: new Date(),
  },

  // Actions
  setSelectedModel: (model) => set({ selectedModel: model }),

  setModelPreference: (queryType, model) =>
    set((state) => ({
      modelPreferences: {
        ...state.modelPreferences,
        [queryType]: model,
      },
    })),

  addResponse: (response) =>
    set((state) => ({
      responseHistory: [response, ...state.responseHistory].slice(0, 50), // Keep last 50
    })),

  setGenerating: (generating) => set({ isGenerating: generating }),

  updateUsage: (tokens) =>
    set((state) => ({
      usage: {
        ...state.usage,
        totalTokens: state.usage.totalTokens + tokens,
        requestCount: state.usage.requestCount + 1,
      },
    })),

  resetUsage: () =>
    set((state) => ({
      usage: {
        totalTokens: 0,
        requestCount: 0,
        resetDate: new Date(),
      },
    })),
}));
```

## Store Patterns

### Async Actions

```typescript
// For complex async operations, create separate action functions
export const chatActions = {
  async loadConversations() {
    useChatStore.getState().setLoading(true);
    useChatStore.getState().clearError();

    try {
      const conversations = await fetchConversations();
      conversations.forEach((conversation) => {
        useChatStore.getState().addConversation(conversation);
      });
    } catch (error) {
      useChatStore
        .getState()
        .setError(
          error instanceof Error
            ? error.message
            : "Failed to load conversations"
        );
    } finally {
      useChatStore.getState().setLoading(false);
    }
  },

  async sendMessage(conversationId: string, content: string) {
    const chatStore = useChatStore.getState();
    const aiStore = useAIStore.getState();

    // Optimistic update
    const tempMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      conversationId,
      createdAt: new Date(),
    };

    chatStore.addMessage(conversationId, tempMessage);
    aiStore.setGenerating(true);

    try {
      const response = await sendChatMessage(content, conversationId);

      if (response.success && response.aiResponse) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: response.aiResponse.content,
          role: "assistant",
          conversationId,
          aiModel: response.aiResponse.model,
          createdAt: new Date(),
        };

        chatStore.addMessage(conversationId, aiMessage);
        aiStore.addResponse(response.aiResponse);
        aiStore.updateUsage(response.aiResponse.usage.totalTokens);
      }
    } catch (error) {
      chatStore.setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      aiStore.setGenerating(false);
    }
  },
};
```

### Store Composition

```typescript
// Create composed hooks for common use cases
export function useChatInterface(conversationId: string) {
  const conversation = useChatStore(
    (state) => state.conversations[conversationId]
  );
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const isGenerating = useAIStore((state) => state.isGenerating);

  const sendMessage = useCallback(
    async (content: string) => {
      await chatActions.sendMessage(conversationId, content);
    },
    [conversationId]
  );

  return {
    conversation,
    messages: conversation?.messages || [],
    isLoading: isLoading || isGenerating,
    error,
    sendMessage,
  };
}
```

## Best Practices

### Performance

- Use selective subscriptions to prevent unnecessary re-renders
- Implement proper memoization for expensive computations
- Use shallow comparison for object updates
- Consider using subscribeWithSelector middleware

### State Structure

- Keep state flat and normalized
- Separate UI state from business logic state
- Use computed values (selectors) for derived state
- Implement proper TypeScript typing

### Error Handling

- Store error states alongside loading states
- Provide clear error messages for users
- Implement retry mechanisms for transient errors
- Log errors for debugging purposes

### Persistence

- Use persistence middleware selectively
- Exclude sensitive data from persistence
- Handle hydration mismatches properly
- Implement migration strategies for schema changes

### Testing

- Write unit tests for store actions and selectors
- Mock store state in component tests
- Test error conditions and edge cases
- Use proper TypeScript testing patterns
