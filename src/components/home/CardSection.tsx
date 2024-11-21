import Link from "next/link";
import React from "react";
import { FaImages } from "react-icons/fa";
import { DiAptana } from "react-icons/di";
import { PiMatrixLogo, PiRobotBold } from "react-icons/pi";
import ml_img from "@/assets/images/ml_img.jpg"
import imp_img from "@/assets/images/bg_imgp.png"

export default function CardSection() {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto ">
      <div>
        <div className="mb-4 text-gray-900 font-bold">All items</div>

        {/* Grid section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inner card  */}
          <div className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 shadow-inner" style={{ backgroundImage: `url(${imp_img.src})` }}>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 items-center">
                <div className="w-12 h-12 rounded-full shadow-md flex justify-center items-center bg-sky-800">
                  <FaImages className="w-6 h-6 text-white" />
                </div>
                <span
                  className={
                    "text-xl  text-white font-semibold bg-gray-800 bg-opacity-80 px-2 rounded-md"
                  }
                >
                  Image Processing
                </span>
              </div>
            </div>
            <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
              <Link href="/simu/image_enchanted">
                <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:scale-95 duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm  ">
                  <DiAptana />
                  Enchanted
                </div>
              </Link>
              <Link href="/simu/image_enchanted/convolution">
                <div className="text-base bg-white px-2 rounded-full text-red-800 cursor-pointer hover:scale-95 duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm">
                  <PiMatrixLogo />
                  Convolution
                </div>
              </Link>
            </div>
          </div>

          {/* Inner card  */}
          <div className="flex flex-col bg-gradient-to-b from-slate-50 to-gray-200 rounded-2xl p-2 gap-2 md:gap-4 shadow-inner row-span-3"></div>

          {/* Inner card  */}
          <div className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 shadow-inner" style={{ backgroundImage: `url(${ml_img.src})` }}>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 items-center">
                <div className="w-12 h-12 rounded-full shadow-md flex justify-center items-center bg-blue-900 ">
                  <PiRobotBold className="w-6 h-6 text-white" />
                </div>
                <span
                  className={
                    "text-xl  text-white font-semibold bg-gray-800 bg-opacity-80 px-2 rounded-md"
                  }
                >
                  Machine Learning
                </span>
              </div>
            </div>
            <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
              <Link href="/simu/image_enchanted">
                <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:scale-95 duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm">
                  <DiAptana />
                  Supervise Learning
                </div>
              </Link>
            </div>
          </div>
          {/* Inner card  */}
          <div className="flex flex-col bg-gradient-to-b from-slate-50 to-gray-200 rounded-2xl p-2 gap-2 md:gap-4 shadow-inner "></div>
        </div>

        {/* Grid section 2 */}
      </div>
    </div>
  );
}
