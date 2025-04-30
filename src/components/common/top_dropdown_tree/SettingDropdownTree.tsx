import React, { useState } from "react";
import { TbAlphabetThai, TbAlphabetLatin } from "react-icons/tb";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
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
}

const SettingDropdownTree: React.FC<SettingDropdownTreeProps> = ({ currentLang, onChangeLanguage, user, logout, loginOpen, setLoginOpen, registerOpen, setRegisterOpen, handleLogin, handleRegister }) => {
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
      <div className="flex flex-col justify-center items-center gap-4 bg-gray-50 min-w-[260px] ">
        {/* User Section Card */}
        <div className="flex flex-col items-center gap-2 w-full">
          {user ? (
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-300 to-pink-300 flex items-center justify-center shadow-md">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover" width={56} height={56} />
                ) : (
                  <FiUser className="w-8 h-8 text-white" />
                )}
              </div>
              <span className="font-medium text-gray-800 text-base text-center truncate max-w-[140px]">{user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-1 rounded-full bg-gray-200 hover:bg-red-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm font-medium mt-1"
              >
                <FiLogOut /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2 rounded-full bg-[#83AFC9] hover:bg-blue-600 text-white border-2 border-white transition-all duration-200 flex items-center gap-2 font-semibold w-full justify-center"
              >
                <FiLogIn /> Login
              </button>
              <button
                onClick={() => setRegisterOpen(true)}
                className="px-4 py-2 rounded-full bg-white text-[#83AFC9] border-2 border-[#83AFC9]]    transition-all duration-200 flex items-center gap-2 font-semibold w-full justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </button>
            </div>
          )}
        </div>
        {/* Language Switch Card */}
        <div className="rounded-xl bg-white shadow-sm border p-0.5 w-full">
          <button
            onClick={onChangeLanguage}
            className="flex items-center gap-3 bg-white w-full p-3 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {currentLang === "en" ? (
              <>
                <TbAlphabetThai className="w-6 h-6 text-[#83AFC9]" />
                <span className="text-sm font-medium text-gray-900">Switch to Thai</span>
              </>
            ) : (
              <>
                <TbAlphabetLatin className="w-6 h-6 text-[#83AFC9]" />
                <span className="text-sm font-medium text-gray-900">Switch to English</span>
              </>
            )}
          </button>
        </div>
      </div>

    </>
  );
};

export default SettingDropdownTree;