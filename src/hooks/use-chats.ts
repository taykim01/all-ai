"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserChats } from "@/app/actions/chat";
import type { Tables } from "@/types/database.types";

type Chat = Tables<"chats">;

export function useChats(userId?: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getUserChats(userId);

      if (result.success && result.data) {
        setChats(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch chats");
      }
    } catch {
      setError("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, loading, error, refetch: fetchChats };
}
