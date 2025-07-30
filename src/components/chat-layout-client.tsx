"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { useAuthStore } from "@/stores";
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
    <div className="h-screen flex">
      <div className="w-80 shrink-0 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
