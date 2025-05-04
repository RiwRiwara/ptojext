import React, { useState } from "react";
import { TbAlphabetThai, TbAlphabetLatin } from "react-icons/tb";
import { FiLogIn, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { FaUserPlus, FaSignInAlt, FaGlobe, FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

interface SettingDropdownTreeProps {
  currentLang: string;
  onChangeLanguage: () => void;
  user?: { name: string; avatarUrl?: string } | null;
  logout?: () => void;
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  registerOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleRegister: (username: string, password: string) => Promise<void>;
  // Optional props for theme toggling
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const SettingDropdownTree: React.FC<SettingDropdownTreeProps> = ({ 
  currentLang, 
  onChangeLanguage, 
  user, 
  logout, 
  loginOpen, 
  setLoginOpen, 
  registerOpen, 
  setRegisterOpen, 
  handleLogin, 
  handleRegister,
  isDarkMode = false,
  toggleDarkMode
}) => {
  // State for active section
  const [activeSection, setActiveSection] = useState<'account' | 'preferences'>('account');
  
  // toggleAuth for switching between modals
  const toggleAuth = (type: 'login' | 'register') => {
    if (type === 'login') {
      setRegisterOpen(false);
      setLoginOpen(true);
    } else {
      setLoginOpen(false);
      setRegisterOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 bg-gray-50 min-w-[280px] p-0 md:p-4 rounded-lg shadow-sm">
        {/* Section Tabs */}
        <div className="w-full flex bg-gray-100 rounded-lg p-1 mb-2">
          <button
            onClick={() => setActiveSection('account')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all ${activeSection === 'account' ? 'bg-white shadow-sm text-[#83AFC9]' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <FiUser size={16} />
            Account
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all ${activeSection === 'preferences' ? 'bg-white shadow-sm text-[#83AFC9]' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <FiSettings size={16} />
            Preferences
          </button>
        </div>
        
        {/* Content based on active section */}
        <motion.div 
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
        {activeSection === 'account' && (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* User Section Card */}
            {user ? (
              <div className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-300 to-[#83AFC9] flex items-center justify-center shadow-md p-0.5 border-2 border-white mb-2">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" width={64} height={64} />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-[#83AFC9]" />
                    </div>
                  )}
                </div>
                <span className="font-semibold text-gray-800 text-base text-center truncate max-w-[180px] mb-1">{user.name}</span>
                <span className="text-xs text-gray-500 mb-3">Logged in user</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-400 transition-all duration-200 flex items-center gap-2 text-sm font-medium w-full justify-center"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                  <FiUser className="text-[#83AFC9]" /> Account Access
                </h3>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#83AFC9] hover:bg-blue-600 text-white transition-all duration-200 flex items-center gap-2 font-medium w-full justify-center shadow-sm"
                  >
                    <FaSignInAlt size={14} /> Sign In
                  </button>
                  <button
                    onClick={() => setRegisterOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-white text-[#83AFC9] border border-[#83AFC9] hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 font-medium w-full justify-center"
                  >
                    <FaUserPlus size={14} /> Create Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === 'preferences' && (
          <div className="flex flex-col gap-3 w-full">
            {/* Language Switch Card */}
            <div className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                <FaGlobe className="text-[#83AFC9]" /> Language
              </h3>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  {currentLang === "en" ? (
                    <>
                      <TbAlphabetLatin className="w-5 h-5 text-[#83AFC9]" />
                      <span className="text-sm font-medium text-gray-700">English</span>
                    </>
                  ) : (
                    <>
                      <TbAlphabetThai className="w-5 h-5 text-[#83AFC9]" />
                      <span className="text-sm font-medium text-gray-700">Thai</span>
                    </>
                  )}
                </div>
                <button
                  onClick={onChangeLanguage}
                  className="px-3 py-1.5 rounded-md bg-white border border-gray-200 text-sm font-medium text-[#83AFC9] hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  {currentLang === "en" ? "Switch to Thai" : "Switch to English"}
                </button>
              </div>
            </div>
            
            {/* Theme Toggle Card */}
            {toggleDarkMode && (
              <div className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                  {isDarkMode ? (
                    <FaMoon className="text-[#83AFC9]" />
                  ) : (
                    <FaSun className="text-[#83AFC9]" />
                  )}
                  Theme
                </h3>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                  <button
                    onClick={toggleDarkMode}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#83AFC9] focus:ring-offset-1 bg-gray-200"
                  >
                    <span
                      className={`${isDarkMode ? 'translate-x-6 bg-[#83AFC9]' : 'translate-x-1 bg-white'} inline-block h-4 w-4 transform rounded-full transition-transform duration-200 shadow-sm`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </motion.div>
      </div>
    </>
  );
};

export default SettingDropdownTree;