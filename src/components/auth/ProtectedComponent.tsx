"use client";
import React, { useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiShield, FiAlertTriangle } from "react-icons/fi";

export interface ProtectedComponentProps {
  children: ReactNode;
  message?: string;
  title?: string;
  featureName?: string;
  requiresAdmin?: boolean;
}

/**
 * A wrapper component that requires authentication to access its children.
 * Displays a login prompt with caution message when user is not authenticated.
 */
export function ProtectedComponent({
  children,
  message = "Please sign in to access this feature.",
  title = "Authentication Required",
  featureName = "this feature",
  requiresAdmin = false,
}: ProtectedComponentProps) {
  const { user, status, showLoginDialog, isProtectedComponentBlocked, unblockProtectedComponent } = useAuth();
  const [showContent, setShowContent] = useState(false);

  // Check authentication and permissions
  const isAuthenticated = status === "authenticated" && user !== null;
  const hasPermission = isAuthenticated && (!requiresAdmin || user.role === "admin");
  
  // Determine if we should show the protected content
  const shouldShowContent = isAuthenticated && hasPermission && !isProtectedComponentBlocked;

  // Effect to handle animation state
  useEffect(() => {
    // Only show content if authorized and not blocked
    setShowContent(shouldShowContent);
  }, [shouldShowContent]);

  // When loading, show a placeholder
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-6 animate-pulse">
        <div className="h-32 w-full bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showContent ? (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="auth-required"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full overflow-hidden border border-amber-200 bg-amber-50">
            <CardHeader className="bg-amber-100 pb-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg text-amber-800">{title}</CardTitle>
              </div>
              <CardDescription className="text-amber-700">
                Authentication required to access {featureName}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <FiLock className="h-8 w-8" />
                </div>
                <p className="text-sm text-amber-800">{message}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end border-t border-amber-200 bg-amber-100/50 pt-3">
              <Button 
                variant="outline"
                className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={unblockProtectedComponent}
              >
                Continue Limited Access
              </Button>
              <Button onClick={showLoginDialog} className="bg-amber-600 hover:bg-amber-700">
                <FiShield className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
