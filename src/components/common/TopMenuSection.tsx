"use client";
import "@/utils/i18n.config";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { TbHome, TbFolder, TbFolderOpen, TbAlphabetThai, TbAlphabetLatin, TbSettings } from "react-icons/tb";
import DropdownTree from "@/components/common/top_dropdown_tree/DropdownTree";
import SettingDropdownTree from "@/components/common/top_dropdown_tree/SettingDropdownTree";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/common/top_dropdown_tree/AuthModal";

const notify = (lang: string) => toast(`Now ${lang}!`, {
  icon: "💬",
});

export default function TopMenuSection() {
  // Modal state for login/register
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Auth handlers
  const handleLogin = async (username: string, password: string) => {
    if (login) await login();
    setLoginOpen(false);
  };
  const handleRegister = async (username: string, password: string) => {
    setRegisterOpen(false);
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  // Delay setting initial state or icon rendering until client-side
  const [hydrated, setHydrated] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Mark as hydrated when the component mounts on the client
    setHydrated(true);
  }, []);

  // Handle scroll events to prevent popover closing on scroll
  useEffect(() => {
    if (!settingsOpen) return;

    const handleScroll = () => {
      // Set scrolling flag to true when scrolling
      setIsScrolling(true);
      // Clear scrolling flag after 150ms
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [settingsOpen]);

  // Custom handler for popover open state changes
  const handleSettingsOpenChange = (open: boolean) => {
    // If it's a close request and we're scrolling, prevent closing
    if (!open && isScrolling) return;

    // Otherwise, update the open state
    setSettingsOpen(open);
  };

  const changeLanguageBox = () => {
    const nextLanguage = i18n.language === "th" ? "en" : "th";
    notify(i18n.language === "th" ? "English" : "Thai Damascus");
    void i18n.changeLanguage(nextLanguage);
  };

  const { user, login, logout } = useAuth();

  // Fallback content for server-side rendering
  if (!hydrated) {
    return (
      <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-10 mt-6">
        <div className="rounded-full shadow-md flex flex-row gap-0 p-1 items-center border-1 border-gray-200 bg-white">
          {/* Placeholder content for SSR */}
          <div className="text-gray-800 p-2 pr-2 bg-gray-100 shadow-inner rounded-l-full">
            <span className="w-8 h-8" /> {/* Placeholder for TbHome */}
          </div>
          <div className="text-gray-800 p-2 pl-2 bg-gray-50" />
          <div className="text-gray-800 p-2 pl-2 bg-gray-50 rounded-r-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-10 mt-6 ">
      <div className="rounded-full shadow-md flex flex-row gap-0 p-1 items-center border-1 border-gray-200 bg-white">
        <Link
          href="/"
          className="text-gray-800 p-2 pr-3 pl-3 bg-gray-100 shadow-inner rounded-l-full"
        >
          <TbHome className="w-8 h-8" />
        </Link>

        <Popover
          classNames={{
            base: ["before:bg-default-200"],
            content: ["py-3 px-4 mt-4 border border-default-200", "bg-white"],
          }}
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
          placement="bottom"
        >
          <PopoverTrigger>
            <div className="text-gray-800 p-2 pr-3 pl-3 bg-gray-50 hover:bg-gray-200 hover:shadow-inner cursor-pointer">
              {isOpen ? (
                <TbFolderOpen className="w-8 h-8 ease-soft spring duration-300 hover:scale-95" />
              ) : (
                <TbFolder className="w-8 h-8 ease-soft spring duration-300 hover:scale-95" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white">
            <DropdownTree />
          </PopoverContent>
        </Popover>

        {/* Settings menu with language switch as submenu */}
        <Popover
          classNames={{
            base: ["before:bg-default-200"],
            content: ["py-3 px-4 mt-4 border border-default-200", "bg-white"],
          }}
          placement="bottom"
          isOpen={settingsOpen}
          onOpenChange={handleSettingsOpenChange}>
          <PopoverTrigger>
            <button
              className="text-gray-800 p-2 pr-3 pl-3 bg-gray-50 rounded-r-full hover:bg-gray-200 hover:shadow-inner cursor-pointer flex items-center"
              aria-label="Settings"
            >
              <TbSettings className="w-8 h-8 ease-soft spring duration-300 hover:scale-95" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-50">
            {/* Use the new SettingDropdownTree component for settings subitems */}
            <SettingDropdownTree
              currentLang={i18n.language}
              onChangeLanguage={changeLanguageBox}
              user={user}
              logout={logout}
              loginOpen={loginOpen}
              setLoginOpen={setLoginOpen}
              registerOpen={registerOpen}
              setRegisterOpen={setRegisterOpen}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Toaster position="top-right" reverseOrder={false} />

      {/* Auth Modal (Login/Register) */}
      <AuthModal
        open={loginOpen || registerOpen}
        onClose={() => {
          setLoginOpen(false);
          setRegisterOpen(false);
        }}
        onLogin={async (username, password) => {
          await handleLogin(username, password);
          setLoginOpen(false);
        }}
        onRegister={async (username, password) => {
          await handleRegister(username, password);
          setRegisterOpen(false);
        }}
        mode={loginOpen ? "login" : "register"}
      />
    </div>
  );
}