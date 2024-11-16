"use client";
import { Link } from "@nextui-org/link";
import { FaInfoCircle } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";
import React, { useState, useEffect } from "react";

function ReinforcementPage() {
  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header section */}
      <div className="p-2 bg-white shadow-md rounded-md mb-4 flex justify-between items-center ">
        <div className="flex flex-row gap-2 items-center test-tour">
          <Link href={"/"}>
            <IoCaretBack size={30} className="text-gray-800" />
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <FaInfoCircle
            size={25}
            className="hover:scale-110 duration-300 text-blue-900 cursor-pointer"
          />
          <h1 className="font-semibold text-2xl uppercase text-blue-900">
            Reinforcement
          </h1>
        </div>
      </div>

      <div className="shadow-md rounded-md bg-white  min-h-svh w-100 m-auto ">
      </div>
    </div>
  );
}

export default ReinforcementPage;
