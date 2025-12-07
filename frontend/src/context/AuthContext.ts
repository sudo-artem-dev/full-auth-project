import { createContext, useContext } from "react";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  picture?: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
