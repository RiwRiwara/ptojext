"use client";
import { BiMenu, BiSolidHome } from "react-icons/bi";
import { FaInfo } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import PopoverButton from "./PopoverButton";
import Link from "next/link";

export default function LeftMenu() {
  return (
    <div className=" col-span-1 flex flex-row justify-center md:pl-2  ">
      <div className="w-full md:w-fit md:fixed z-10 md:h-[calc(100%-50px)] flex p-2 md:p-4 flex-row gap-2 md:gap-0 md:flex-col justify-between  overflow-auto  bg-gradient-to-b from-slate-600 to-gray-400 rounded-full text-white border-2 border-white shadow-lg shadow-white">
        <div className="flex flex-row md:flex-col gap-2 ">
          <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
            <BiSolidHome className="w-8 h-8 text-gray-800 " />
          </div>
          <PopoverButton
            buttonText={
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
                <BiMenu className="w-8 h-8 text-gray-800 " />
              </div>
            }
            content={
              <div className="flex flex-row gap-2 flex-wrap w-fit">
                <div className="p-2 rounded-md bg-gray-800 text-white">
                  menu 1
                </div>
                <div className="p-2 rounded-md bg-gray-800 text-white">
                  menu 2
                </div>
                <div className="p-2 rounded-md bg-gray-800 text-white">
                  menu 3
                </div>
              </div>
            }
          />
        </div>
        {/* <div className="flex flex-row md:flex-col gap-2 ">
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
          <div className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"></div>
        </div> */}

        <Link 
        className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"
        href="/home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="text-black size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>

        <div className="flex flex-row md:flex-col gap-2 ">
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
