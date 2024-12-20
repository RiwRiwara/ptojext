"use client";
import Link from "next/link";
import { FaInfo, FaArrowCircleLeft } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";

export default function LeftMenuTop() {
  return (
    <div className="flex flex-row justify-center mb-6">
      <div className="w-full  flex p-2 flex-row gap-2 md:gap-0  justify-between  overflow-auto  bg-gradient-to-b from-slate-600 to-gray-400 rounded-full text-white border-2 border-white shadow-md shadow-gray-300">
        <div className="flex flex-row  gap-2 ">
          <Link
            href={"/"}
            className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"
          >
            <FaArrowCircleLeft className="w-8 h-8 text-gray-800 " />
          </Link>

        </div>

        <div className="flex flex-row  gap-2 ">
          <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
            <GiStairsGoal className="w-8 h-8 text-gray-800 " />
          </div>

          <Link
            href={"/about"}
            className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"
          >
            <FaInfo className="w-8 h-8 text-gray-800 " />
          </Link>
        </div>
      </div>
    </div>
  );
}
