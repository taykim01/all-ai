"use client";

import { useEffect } from "react";
import { Sidebar } from "@/features/common/layout";
import { useAuthStore } from "@/core/stores";
import type { User } from "@supabase/supabase-js";

interface ChatLayoutClientProps {
  children: React.ReactNode;
  user: User;
}

export function ChatLayoutClient({ children, user }: ChatLayoutClientProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth store with server-provided user data
    setUser(user);
    setLoading(false);
  }, [user, setUser, setLoading]);

  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-80">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-hidden bg-background">{children}</main>
    </div>
  );
}
