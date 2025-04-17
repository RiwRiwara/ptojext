"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // For now, just mock a user. Replace with real auth logic later.
  const [user, setUser] = useState<User | null>(null);

  const login = () => setUser({
    name: "Demo User",
    email: "demo@example.com",
    avatarUrl: undefined
  });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
