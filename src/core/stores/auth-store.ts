import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loading: true,
        _hasHydrated: false,
        setUser: (user) => set({ user }),
        setLoading: (loading) => set({ loading }),
        clearAuth: () => set({ user: null, loading: false }),
        setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }), // Only persist user data
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    { name: "auth-store" }
  )
);
