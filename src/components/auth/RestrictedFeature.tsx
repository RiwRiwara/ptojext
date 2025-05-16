"use client";
import React, { useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import AuthModal from "@/components/common/top_dropdown_tree/AuthModal";

export interface RestrictedFeatureProps {
  children: ReactNode;
  message?: string;
  title?: string;
  featureName?: string;
  requiresAdmin?: boolean;
  mode?: 'overlay' | 'replace' | 'button-only';
  className?: string;
}

/**
 * An improved component that restricts access to features based on authentication,
 * fully integrated with the existing Auth modal system.
 */
export function RestrictedFeature({
  children,
  message = "Please sign in to access this feature.",
  title = "Authentication Required",
  featureName = "this feature",
  requiresAdmin = false,
  mode = 'overlay',
  className = "",
}: RestrictedFeatureProps) {
  const auth = useAuth();
  const { user, status, login } = auth;
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check authentication and permissions
  const isAuthenticated = status === "authenticated" && user !== null;
  const hasPermission = isAuthenticated && (!requiresAdmin || user.role === "admin");
  
  // Handle login and register actions
  const handleLogin = async (username: string, password: string) => {
    try {
      const success = await login(username, password);
      if (success) setShowAuthModal(false);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleRegister = async (username: string, password: string) => {
    try {
      // For now just use login since we don't have a separate register function
      const success = await login(username, password);
      if (success) setShowAuthModal(false);
    } catch (error) {
      console.error("Register error:", error);
    }
  };
  
  // If user is authenticated and has permission, simply show the children
  if (hasPermission) {
    return <>{children}</>;
  }

  // Render based on the specified mode
  if (mode === 'button-only') {
    // Only replace the button with a login button, useful for actions
    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 py-2 px-4 text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
      >
        <FaLock className="text-white" />
        <span>Sign in to {featureName}</span>
        
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          mode="login"
        />
      </button>
    );
  }

  if (mode === 'replace') {
    // Replace the entire component with a login card
    return (
      <div className={className}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-tr from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 rounded-full p-3">
              <FaExclamationTriangle className="h-6 w-6 text-amber-500" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800">{title}</h3>
              <p className="text-amber-700 mt-1 mb-4">{message}</p>
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 py-2 px-4 rounded-lg border border-amber-300 bg-white text-amber-700 hover:bg-amber-50 font-medium transition-colors duration-200"
              >
                <FaShieldAlt className="text-amber-500" />
                Sign in to Access
              </button>
            </div>
          </div>
        </motion.div>
        
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          mode="login"
        />
      </div>
    );
  }

  // Default mode: 'overlay' - Show children with a semi-transparent overlay
  return (
    <div className={`relative group ${className}`}>
      {/* The actual component (dimmed) */}
      <div className="opacity-50 pointer-events-none filter grayscale">
        {children}
      </div>
      
      {/* Overlay with authentication message */}
      <div className="absolute inset-0 z-10 bg-black bg-opacity-40 backdrop-blur-[1px] flex items-center justify-center rounded-lg overflow-hidden">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-xs mx-auto shadow-lg text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <FaLock className="text-amber-500 h-5 w-5" />
          </div>
          
          <h3 className="text-amber-800 font-semibold">{title}</h3>
          <p className="text-amber-700 text-sm my-2">{message}</p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="mt-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-colors duration-200 flex items-center justify-center gap-2 w-full"
          >
            <FaShieldAlt className="h-4 w-4" />
            Sign in to continue
          </button>
        </div>
      </div>
      
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        mode="login"
      />
    </div>
  );
}
