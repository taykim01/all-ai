"use client";

import { useEffect, useCallback } from "react";
import { createBrowserClient } from "@/infrastructure/supabase";
import { useAuthStore } from "@/core/stores";

/**
 * Custom hook for authentication
 * @returns Authentication state and methods
 */
export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const supabase = createBrowserClient();

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);

      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, supabase.auth]);

  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [initializeAuth, setUser, setLoading, supabase.auth]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, setUser, setLoading]);

  return {
    user,
    loading,
    signOut,
    refetch: initializeAuth,
  };
}
