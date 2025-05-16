"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  showLoginDialog: () => void;
  hideLoginDialog: () => void;
  isProtectedComponentBlocked: boolean;
  unblockProtectedComponent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("unauthenticated");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isProtectedComponentBlocked, setIsProtectedComponentBlocked] = useState(false);

  // For demo purposes when NextAuth is not fully set up
  const demoLogin = async (email: string, password: string): Promise<boolean> => {
    // Mock login for demonstration
    if (true || (email === "demo@example.com" && password === "password")) {
      setUser({
        id: "demo-user-id",
        name: "Demo User",
        email: "demo@example.com",
        role: "user",
        avatarUrl: undefined
      });
      setStatus("authenticated");
      toast.success("Logged in successfully!");
      setIsLoginDialogOpen(false);
      return true;
    }
    toast.error("Invalid credentials");
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use NextAuth signIn when ready, or use demo login
      // Uncomment this when NextAuth is configured:
      /*
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        toast.error(result.error);
        return false;
      }
      
      if (result?.ok) {
        toast.success("Logged in successfully!");
        setIsLoginDialogOpen(false);
        return true;
      }
      */
      
      // Remove this demo login when NextAuth is configured
      return await demoLogin(email, password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Use NextAuth signOut when ready
      // Uncomment this when NextAuth is configured:
      // await signOut({ redirect: false });
      
      // For now, just set user to null
      setUser(null);
      setStatus("unauthenticated");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
    setIsProtectedComponentBlocked(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const unblockProtectedComponent = () => {
    setIsProtectedComponentBlocked(false);
  };

  const contextValue: AuthContextType = {
    user,
    status,
    login,
    logout,
    showLoginDialog,
    hideLoginDialog,
    isProtectedComponentBlocked,
    unblockProtectedComponent,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <LoginDialog 
        isOpen={isLoginDialogOpen} 
        onClose={hideLoginDialog} 
        onLogin={login}
      />
      {children}
    </AuthContext.Provider>
  );
}

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
}

function LoginDialog({ isOpen, onClose, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("demo@example.com"); // Default for demo
  const [password, setPassword] = useState("password"); // Default for demo
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            Please sign in to access this feature.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// We're not using SessionProvider yet - we'll add it back when NextAuth is properly set up
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
