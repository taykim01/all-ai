"use client";

import { useState, useEffect, useCallback } from "react";
import { getChatMessages } from "@/app/actions/message";
import type { Tables } from "@/types/database.types";

type Message = Tables<"messages">;

export function useMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getChatMessages(chatId);

      if (result.success && result.data) {
        setMessages(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch messages");
      }
    } catch {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}
