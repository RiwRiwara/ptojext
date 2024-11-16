"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import { FaVectorSquare } from "react-icons/fa6";
import ConnectingLine from "@/components/landing_page/ConnectingLine";
import { FaImages, FaBrain } from "react-icons/fa6";

export default function NewLandingPage() {
  return (
    <BaseLayout>
      <div className="flex flex-col justify-center items-center h-full relative">
        {/* Reinfore Items */}
        <div
          id="reinforcement_item"
          className="absolute rounded-full bg-white border-2 border-gray-800 border-dashed flex justify-center items-center p-8 hover:scale-105 duration-300 ease-in-out"
          style={{
            top: "10%",
            left: "70%",
          }}
        >
          <FaVectorSquare className="text-gray-800 w-10 h-10" />
          <div
            className="text-center absolute text-xl text-nowrap "
            style={{
              top: "-35%",
              left: "-50%",
            }}
          >
            Reinforcement Learning
          </div>
        </div>
        {/* Reinfore Items */}

        {/* image Items */}
        <div
          id="image_item"
          className="absolute rounded-full bg-white border-2 border-gray-800 border-dashed flex justify-center items-center p-8 hover:scale-105 duration-300 ease-in-out"
          style={{
            top: "25%",
            left: "25%",
          }}
        >
          <FaImages className="text-gray-800 w-10 h-10" />
          <div
            className="text-center absolute text-xl text-nowrap"
            style={{
              top: "-35%",
              left: "-30%",
            }}
          >
            Image Processing
          </div>
        </div>
        {/* image Items */}

        {/* Algorithms Items */}
        <div
          id="algo_item"
          className="absolute rounded-full bg-white border-2 border-gray-800 border-dashed flex justify-center items-center p-8 hover:scale-105 duration-300 ease-in-out"
          style={{
            top: "75%",
            left: "32%",
          }}
        >
          <FaBrain className="text-gray-800 w-10 h-10" />
          <div
            className="text-center absolute text-xl text-nowrap"
            style={{
              top: "-35%",
              left: "0%",
            }}
          >
            Algorithms
          </div>
        </div>
        {/* Algorithms Items */}

        {/* ========================================  DOT ======================================= */}

        {/* Image Dot */}
        <div
          id="image_dot"
          className="absolute w-6 h-6 rounded-full bg-black flex justify-center items-center"
          style={{
            top: "35%",
            left: "45%",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
        {/* Image Dot */}

        {/* Reinfore dot */}
        <div
          className="absolute w-6 h-6 rounded-full bg-black flex justify-center items-center"
          style={{
            top: "30%",
            left: "56%",
          }}
        >
          <div
            className="w-2 h-2 rounded-full bg-white"
            id="reinforcement_dot"
          ></div>
        </div>
        {/* Reinfore dot */}

        <div
          className="absolute w-6 h-6 rounded-full bg-black flex justify-center items-center"
          id="algo_dot"
          style={{
            top: "65%",
            left: "49%",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>

        <h1 className="text-8xl font-bold ">AI LAB</h1>

        <ConnectingLine
          fromId="reinforcement_item"
          toId="reinforcement_dot"
          strokeWidth={2}
          dashArray="5 4"
        />
        <ConnectingLine
          fromId="image_item"
          toId="image_dot"
          side="right"
          strokeWidth={2}
          dashArray="5 4"
        />
        <ConnectingLine
          fromId="algo_item"
          toId="algo_dot"
          side="right"
          align="bot"
          strokeWidth={2}
          dashArray="5 4"
        />
      </div>
    </BaseLayout>
  );
}
