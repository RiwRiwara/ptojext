import React, { useState, useEffect } from "react";
import { FaTimes, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
  mode: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLogin, onRegister, mode: initialMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'login' | 'register'>(initialMode);
  
  // Update active mode when prop changes
  useEffect(() => {
    if (open) {
      setActiveMode(initialMode);
    }
  }, [initialMode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (activeMode === "login") {
        await onLogin(username, password);
      } else {
        await onRegister(username, password);
      }
    } catch (err) {
      setError("Authentication failed");
    }
    setLoading(false);
  };
  
  const switchMode = (newMode: 'login' | 'register') => {
    setActiveMode(newMode);
    setUsername("");
    setPassword("");
    setError(null);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 mx-4 z-[101]"
        >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 z-[102]"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Tabs for switching between login and register */}
        <div className="flex justify-center mb-6 gap-2">
          <div className="w-full max-w-xs bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 ${activeMode === 'login' 
                ? 'bg-white text-[#83AFC9] shadow-md font-medium' 
                : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <FaSignInAlt className={activeMode === 'login' ? 'text-[#83AFC9]' : 'text-gray-500'} />
              Login
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 ${activeMode === 'register' 
                ? 'bg-white text-[#83AFC9] shadow-md font-medium' 
                : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <FaUserPlus className={activeMode === 'register' ? 'text-[#83AFC9]' : 'text-gray-500'} />
              Register
            </button>
          </div>
        </div>
        
        {/* Logo/Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#83AFC9] to-indigo-600 flex items-center justify-center shadow-lg p-1 border-2 border-white">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#83AFC9]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {activeMode === "login" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-[#83AFC9] mb-2">
          {activeMode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {activeMode === "login" ? "Sign in to continue to your account" : "Join our community today"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83AFC9] focus:border-[#83AFC9] transition-all shadow-sm"
                placeholder="Enter your username"
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83AFC9] focus:border-[#83AFC9] transition-all shadow-sm"
                placeholder="Enter your password"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#83AFC9] rounded-full p-1 transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.053-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-6.828a4 4 0 010 5.656M21 21l-6-6m-6 0l-6-6"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeMode === "login"
              ? "bg-gradient-to-r from-[#83AFC9] to-indigo-600 hover:from-[#6c9ab4] hover:to-indigo-700 focus:ring-[#83AFC9]"
              : "bg-gradient-to-r from-[#83AFC9] to-indigo-600 hover:from-[#6c9ab4] hover:to-indigo-700 focus:ring-[#83AFC9]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={activeMode === "login" ? "Login" : "Register"}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {activeMode === "login" ? "Logging in..." : "Registering..."}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {activeMode === "login" ? (
                  <>
                    <FaSignInAlt className="text-white" />
                    Login
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-white" />
                    Register
                  </>
                )}
              </span>
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
            aria-label="Cancel"
          >
            Cancel
          </button>

          {/* Additional help text */}
          <div className="text-center text-sm mt-6 text-gray-500">
            {activeMode === "login" ? (
              <p>Use the tabs above to switch between login and register</p>
            ) : (
              <p>Fill in your details to create a new account</p>
            )}
          </div>
        </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;