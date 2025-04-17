"use client";
import "@/utils/i18n.config";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { TbHome, TbFolder, TbFolderOpen, TbAlphabetThai, TbAlphabetLatin } from "react-icons/tb";
import DropdownTree from "@/components/common/top_dropdown_tree/DropdownTree";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

const notify = (lang: string) => toast(`Now ${lang}!`, {
  icon: "💬",
});

export default function TopMenuSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  // Delay setting initial state or icon rendering until client-side
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated when the component mounts on the client
    setHydrated(true);
  }, []);

  const changeLanguageBox = () => {
    const nextLanguage = i18n.language === "th" ? "en" : "th";
    notify(i18n.language === "th" ? "English" : "Thai");
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
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-10 mt-6">
      <div className="rounded-full shadow-md flex flex-row gap-0 p-1 items-center border-1 border-gray-200 bg-white">
        <Link
          href="/"
          className="text-gray-800 p-2 pr-2 bg-gray-100 shadow-inner rounded-l-full"
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
            <div className="text-gray-800 p-2 pl-2 bg-gray-50 hover:bg-gray-200 hover:shadow-inner cursor-pointer">
              {isOpen ? (
                <TbFolderOpen className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              ) : (
                <TbFolder className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownTree />
          </PopoverContent>
        </Popover>

        <a
          onClick={changeLanguageBox}
          className="text-gray-800 p-2 pl-2 bg-gray-50 rounded-r-full hover:bg-gray-200 hover:shadow-inner cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <div className="text-sm-bold">
              {i18n.language === "en" ? (
                <TbAlphabetLatin className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              ) : (
                <TbAlphabetThai className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              )}
            </div>
          </div>
        </a>
      </div>
      {/* User section */}
      {/* <div className="flex flex-row items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-300 to-pink-300 flex items-center justify-center shadow-md">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <FiUser className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="font-medium text-gray-800 hidden sm:block">{user.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 ml-2 rounded-full bg-gray-200 hover:bg-red-400 hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm"
            >
              <FiLogOut /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition-all duration-200 flex items-center gap-2 font-semibold"
          >
            <FiLogIn /> Login
          </button>
        )}
      </div> */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}