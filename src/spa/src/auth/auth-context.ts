import { createContext, useContext } from "react";
import type { LoginResponse } from "../api";

export interface AuthState {
  token: string;
  name: string;
  role: string;
}

export interface AuthContextValue {
  user: AuthState | null;
  setAuth: (data: LoginResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}