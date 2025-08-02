"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase browser client
 * @returns A Supabase browser client
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        debug: false,
        storageKey: "supabase.auth.token",
        storage: {
          getItem: (key) => {
            try {
              return localStorage.getItem(key);
            } catch {
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              localStorage.setItem(key, value);
            } catch {}
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key);
            } catch {}
          },
        },
      },
    }
  );
}
