import { createContext, useContext, useMemo, useState } from "react";
import { loginApi, registerApi } from "../../lib/api/auth";
import type { AuthSession, Role } from "../../types";
import { authStorage } from "./auth-storage";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (name: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  updateSessionUser: (updates: Partial<AuthSession["user"]>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.get());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      async login(email, password) {
        const nextSession = await loginApi({ email, password });
        setSession(nextSession);
        authStorage.set(nextSession);
        return nextSession;
      },
      async register(name, email, password) {
        const nextSession = await registerApi({ name, email, password });
        setSession(nextSession);
        authStorage.set(nextSession);
        return nextSession;
      },
      logout() {
        setSession(null);
        authStorage.clear();
      },
      updateSessionUser(updates) {
        setSession((current) => {
          if (!current) return current;
          const nextSession = {
            ...current,
            user: {
              ...current.user,
              ...updates,
            },
          };
          authStorage.set(nextSession);
          return nextSession;
        });
      },
      hasRole(role) {
        return session?.user.role === role;
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
