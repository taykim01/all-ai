---
applyTo: "src/hooks/**"
---

# Hooks Directory Instructions

## Overview

The `src/hooks` directory contains custom React hooks that encapsulate reusable stateful logic and side effects.

## Naming Convention

- All hooks must start with `use` prefix
- Use camelCase: `useAuth`, `useChatHistory`, `useAIResponse`
- Be descriptive and specific: `useLocalStorage`, `useDebounce`, `useAsyncOperation`

## Hook Categories

### Authentication Hooks

```typescript
// useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/components/providers/AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// useSupabaseAuth.ts
import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@/lib/supabase/client";

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { user, loading };
}
```

### Chat Hooks

```typescript
// useChat.ts
import { useState, useCallback } from "react";
import { type Message, type Conversation } from "@/types/chat";
import { sendChatMessage } from "@/lib/actions/chat";

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Add user message immediately (optimistic update)
        const userMessage: Message = {
          id: crypto.randomUUID(),
          content,
          role: "user",
          conversationId,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send message via server action
        const result = await sendChatMessage(content, conversationId);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Add AI response
        if (result.aiResponse) {
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            content: result.aiResponse.content,
            role: "assistant",
            conversationId,
            aiModel: result.aiResponse.model,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Remove optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
}

// useChatHistory.ts
import { useEffect, useState } from "react";
import { type Conversation } from "@/types/chat";
import { getChatHistory } from "@/lib/actions/chat";

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await getChatHistory();
        if (result.success && result.data) {
          setConversations(result.data);
        } else {
          setError(result.error || "Failed to load chat history");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return { conversations, loading, error };
}
```

### Utility Hooks

```typescript
// useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// useAsyncOperation.ts
import { useState, useCallback } from "react";

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsyncOperation<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
```

### AI-Specific Hooks

```typescript
// useAIResponse.ts
import { useState, useCallback } from "react";
import { type AIModel, type AIResponse } from "@/types/ai";
import { AIClient } from "@/lib/ai/client";
import { selectBestModel } from "@/lib/ai/selector";

export function useAIResponse() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(
    async (
      query: string,
      preferredModel?: AIModel
    ): Promise<AIResponse | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const model = preferredModel || (await selectBestModel(query));
        const aiClient = new AIClient();

        const response = await aiClient.chat(model, [
          { role: "user", content: query },
        ]);

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "AI service error";
        setError(errorMessage);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateResponse,
    isGenerating,
    error,
  };
}

// useModelSelection.ts
import { useState, useEffect } from "react";
import { type AIModel } from "@/types/ai";
import { selectBestModel } from "@/lib/ai/selector";
import { useDebounce } from "./useDebounce";

export function useModelSelection(query: string) {
  const [selectedModel, setSelectedModel] = useState<AIModel>("gpt-4");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const analyzeQuery = async () => {
      setIsAnalyzing(true);
      try {
        const model = await selectBestModel(debouncedQuery);
        setSelectedModel(model);
      } catch (error) {
        console.error("Model selection error:", error);
        // Fallback to default
        setSelectedModel("gpt-4");
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeQuery();
  }, [debouncedQuery]);

  return {
    selectedModel,
    isAnalyzing,
    setSelectedModel,
  };
}
```

## Best Practices

### Hook Design Principles

1. **Single Responsibility**: Each hook should have one clear purpose
2. **Reusability**: Design hooks to be used across multiple components
3. **Consistency**: Return objects with consistent naming patterns
4. **Error Handling**: Always handle and expose errors appropriately
5. **Performance**: Use useCallback and useMemo when appropriate

### State Management

- Keep hook state minimal and focused
- Use reducer pattern for complex state logic
- Implement optimistic updates for better UX
- Provide reset/cleanup functions when needed

### Side Effects

- Clean up subscriptions and timeouts in useEffect
- Handle component unmounting gracefully
- Use AbortController for cancellable requests
- Implement proper dependency arrays

### TypeScript

- Use generic types for flexible hooks
- Provide proper type inference
- Document complex type relationships
- Use strict typing for better developer experience

### Testing

- Write unit tests for complex hook logic
- Use React Testing Library's renderHook
- Test error conditions and edge cases
- Mock external dependencies appropriately
