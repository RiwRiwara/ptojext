"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaSignInAlt, FaUserPlus, FaCrown, FaRocket } from "react-icons/fa";
import AuthModal from "@/components/common/top_dropdown_tree/AuthModal";
import { useAuth } from "@/context/AuthContext";

interface PremiumFeatureModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

/**
 * Modal that appears when a user attempts to access a premium feature without authentication
 * Provides information about the feature and options to sign in
 */
export function PremiumFeatureModal({
  open,
  onClose,
  featureName,
  description = "This premium feature requires you to be logged in."
}: PremiumFeatureModalProps) {
  const { login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Handlers for sign in and register
  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };
  
  const handleShowRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };
  
  // Handle login success from the auth modal
  const handleLogin = async (username: string, password: string) => {
    try {
      const success = await login(username, password);
      if (success) {
        setShowAuthModal(false);
        onClose(); // Close the premium feature modal as well
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  // Handle register as a login for now
  const handleRegister = async (username: string, password: string) => {
    try {
      // For demo, just use login
      const success = await login(username, password);
      if (success) {
        setShowAuthModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 z-[51]"
        >
          <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border border-amber-100">
            {/* Top decorative banner */}
            <div className="h-24 bg-gradient-to-r from-amber-400 to-amber-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
              </div>
              
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white">
                <FaCrown className="text-amber-500 text-2xl" />
              </div>
            </div>
            
            {/* Content with title pushed down to accommodate the crown icon */}
            <div className="pt-14 pb-6 px-6">
              <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Premium Feature</h2>
              <h3 className="text-amber-600 text-center font-medium mb-4">{featureName}</h3>
              
              <p className="text-gray-600 text-center mb-6">
                {description}
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleShowLogin}
                  className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                >
                  <FaSignInAlt className="text-white" /> Sign In
                </button>
                
                <button 
                  onClick={handleShowRegister}
                  className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 bg-white text-amber-600 border border-amber-200 font-medium hover:bg-amber-50 transition-all duration-200"
                >
                  <FaUserPlus /> Create Account
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-2 rounded-lg text-gray-500 font-medium hover:bg-gray-50 transition-all mt-2"
                >
                  Continue with Limited Access
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <FaRocket className="text-amber-400" />
                <span className="text-xs text-gray-500">
                  Unlock all premium features with a user account
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* AuthModal will be shown on top when triggered */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        mode={authMode}
      />
    </>
  );
}
