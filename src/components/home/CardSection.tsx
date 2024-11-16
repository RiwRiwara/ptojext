import Link from "next/link";
import React from "react";
import { FaImages } from "react-icons/fa";
import { DiAptana } from "react-icons/di";
import { PiMatrixLogo, PiRobotBold } from "react-icons/pi";
import ml_img from "@/assets/images/ml_img.jpg";
import imp_img from "@/assets/images/bg_imgp.png";
import ggg_img from "@/assets/images/ggg.gif";
import Comp from "@/components/home/Comp";
import { BiGrid } from "react-icons/bi";

export default function CardSection() {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto max-h-[540px] cus-scroll">
      {/* Grid section 1 */}
      <div className="flex flex-col gap-4 md:grid grid-cols-1 md:grid-cols-2 md:gap-8 px-4 py-6">
        {/* Inner card  */}
        <div
          className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 border-2 border-white shadow-lg shadow-gray-400"
          style={{ backgroundImage: `url(${imp_img.src})` }}
        >
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
              <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer  duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm  hover:text-lg hover:font-bold">
                <DiAptana />
                Enchanted
              </div>
            </Link>
            <Link href="/simu/image_enchanted/convolution">
              <div className="text-base bg-white px-2 rounded-full text-red-800 cursor-pointer  hover:text-lg duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm hover:font-bold">
                <PiMatrixLogo />
                Convolution
              </div>
            </Link>
          </div>
        </div>

        {/* Inner card  */}
        <div
          className="flex flex-col  rounded-2xl p-2 gap-2 md:gap-4 border-2 border-white shadow-lg shadow-gray-400 row-span-3"
          style={{
            backgroundImage: `url(${ggg_img.src})`,
            backgroundSize: "cover", // Ensures the image covers the container
            backgroundPosition: "center", // Ensures the image is centered
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
          }}
        >
          <div className="flex flex-row gap-2 items-center">
            <div className="w-12 h-12 rounded-full shadow-md flex justify-center items-center bg-blue-900 ">
              <PiRobotBold className="w-6 h-6 text-white" />
            </div>
            <span
              className={
                "text-xl  text-white font-semibold bg-gray-800 bg-opacity-80 px-2 rounded-md"
              }
            >
              Reinforcement Learning
            </span>
          </div>
          <div className="h-full md:flex justify-center items-center hidden">
            <Comp />
          </div>

          <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
            <Link href="/simu/reinforcement">
              <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:text-lg duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm hover:font-bold">
                <BiGrid />
                Grid
              </div>
            </Link>
          </div>
        </div>

        {/* Inner card  */}
        <div
          className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 border-2 border-white shadow-lg shadow-gray-400"
          style={{ backgroundImage: `url(${ml_img.src})` }}
        >
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
                Basic Machine Learning
              </span>
            </div>
          </div>
          <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
            <Link href="/simu/image_enchanted">
              <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:text-lg duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm hover:font-bold">
                <DiAptana />
                Supervise Learning
              </div>
            </Link>
          </div>
        </div>
        {/* Inner card  */}
        <div
          className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 border-2 border-white shadow-lg shadow-gray-400"
          style={{ backgroundImage: `url(${ml_img.src})` }}
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-12 h-12 rounded-full shadow-md flex justify-center items-center bg-orange-700">
                <PiRobotBold className="w-6 h-6 text-white" />
              </div>
              <span
                className={
                  "text-xl  text-white font-semibold bg-gray-800 bg-opacity-80 px-2 rounded-md"
                }
              >
                Basic Machine Learning
              </span>
            </div>
          </div>
          <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
            <Link href="/simu/image_enchanted">
              <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:text-lg duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm hover:font-bold">
                <DiAptana />
                Supervise Learning
              </div>
            </Link>
          </div>
        </div>
        {/* Inner card  */}

        <div
          className="flex flex-col bg-top rounded-2xl p-2 gap-2 md:gap-4 border-2 border-white shadow-lg shadow-gray-400 col-span-2"
          style={{ backgroundImage: `url(${ml_img.src})` }}
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-12 h-12 rounded-full shadow-md flex justify-center items-center bg-orange-700">
                <PiRobotBold className="w-6 h-6 text-white" />
              </div>
              <span
                className={
                  "text-xl  text-white font-semibold bg-gray-800 bg-opacity-80 px-2 rounded-md"
                }
              >
                Basic Machine Learning
              </span>
            </div>
          </div>
          <div className="w-full text-wrap text-gray-700 flex flex-row gap-2">
            <Link href="/simu/image_enchanted">
              <div className="text-base bg-white px-2 rounded-full text-blue-800 cursor-pointer hover:text-lg duration-200 text-center font-medium flex flex-row gap-2 items-center shadow-sm hover:font-bold">
                <DiAptana />
                Supervise Learning
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
