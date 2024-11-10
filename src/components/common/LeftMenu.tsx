"use client";
import { BiMenu, BiSolidHome } from "react-icons/bi";

export default function LeftMenu() {
  return (
    <div className=" col-span-1 flex flex-row justify-center pl-2  ">
      <div className="w-full md:w-fit md:fixed z-10 md:h-[calc(100%-50px)] flex p-4 flex-row gap-2 md:gap-0 md:flex-col md:justify-between  overflow-auto bg-gradient-to-b from-slate-50 to-gray-200 rounded-full shadow-inner">
        <div className="flex flex-row md:flex-col gap-2 ">
          <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
            <BiSolidHome className="w-8 h-8 text-gray-500 " />
          </div>
          <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
            <BiMenu className="w-8 h-8 text-gray-500 " />
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 ">
          <div className="w-12 h-12 bg-gray-800 rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 ">
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
}
