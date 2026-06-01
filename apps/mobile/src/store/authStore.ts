import { create } from "zustand";
import { login, register } from "@/api/auth";
import type { AuthSession, Credentials, RegisterPayload } from "@/types";

type AuthState = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (payload: Credentials) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => void;
  updateSessionUser: (updates: Partial<AuthSession["user"]>) => void;
};

export const authStore = create<AuthState>((set) => ({
  session: null,
  loading: false,
  signIn: async (payload) => {
    set({ loading: true });
    try {
      const session = await login(payload);
      set({ session, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signUp: async (payload) => {
    set({ loading: true });
    try {
      const session = await register(payload);
      set({ session, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signOut: () => set({ session: null }),
  updateSessionUser: (updates) =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            user: {
              ...state.session.user,
              ...updates,
            },
          }
        : null,
    })),
}));
