"use client";
import React from "react";
import TopNav from "../../components/common/TopNav";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* Top Nav */}
      <TopNav/>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="font-default font-main-title text-gray-800">AI LAB</h1>
        <div className="mt-12 flex flex-wrap justify-center items-center gap-16">
          {/* Image Processing */}
          {/* <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <img
                src="/icons/image-processing.svg"
                alt="Image Processing"
                className="h-10 w-10"
              />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Image Processing
            </p>
          </div> */}

          {/* Reinforcement Learning */}
          {/* <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <img
                src="/icons/reinforcement-learning.svg"
                alt="Reinforcement Learning"
                className="h-10 w-10"
              />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Reinforcement Learning
            </p>
          </div> */}

          {/* Algorithms */}
          {/* <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <img
                src="/icons/algorithms.svg"
                alt="Algorithms"
                className="h-10 w-10"
              />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">Algorithms</p>
          </div> */}
        </div>
      </div>

      {/* Rocket Button */}
      <button className="absolute bottom-12 right-12 p-4 rounded-full bg-white drop-shadow-2xl transform duration-300 hover:scale-105">
        <HiOutlineRocketLaunch className="size-7"/>
      </button>
    </div>
  );
}
