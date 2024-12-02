"use client";
import React from "react";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { HiOutlineHome } from "react-icons/hi2";

export default function TopNav() {
  return (
    <div>
      {/* Header Section */}
      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 px-1 py-1 flex rounded-full bg-white drop-shadow-2xl space-x-0 z-50">
        <button className="px-7 py-3 rounded-full bg-white border border-gray-300">
          <HiOutlineHome className="size-7 transform duration-300 hover:scale-105" />
        </button>
        <button className="px-7 py-3 rounded-full bg-white">
          <HiOutlineRectangleStack className="size-7 transform duration-300 hover:scale-105" />
        </button>
      </div>
    </div>
  );
}
