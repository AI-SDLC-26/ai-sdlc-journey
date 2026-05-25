import { useState, useCallback, type ReactNode } from "react";
import type { LoginResponse } from "../api";

import { AuthContext, type AuthState } from "./auth-context";

function loadFromSession(): AuthState | null {
  const raw = sessionStorage.getItem("auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(loadFromSession);

  const setAuth = useCallback((data: LoginResponse) => {
    const state: AuthState = { token: data.token, name: data.name, role: data.role };
    sessionStorage.setItem("auth", JSON.stringify(state));
    setUser(state);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth");
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, setAuth, logout }}>
      {children}
    </AuthContext>
  );
}