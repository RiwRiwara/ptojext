import React from "react";
import { BiImageAlt } from "react-icons/bi";

export default function CardSection() {

  return (
    <div className="flex flex-col gap-6 overflow-y-auto ">
      <div>
        <div className="mb-4 text-gray-900 font-bold">All items</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inner card  */}
          <a href="/simu/image_enchanted">
            <div className="flex flex-col bg-gradient-to-b from-slate-50 to-gray-200 rounded-2xl p-4 gap-2 md:gap-4 shadow-inner group cursor-pointer hover:scale-95 duration-200">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-md flex justify-center items-center">
                    <BiImageAlt className="w-10 h-10 text-gray-2000" />
                  </div>
                  <span className={"text- text-xl text-gray-800 font-semibold"}>
                    Image Processing
                  </span>
                </div>
              </div>
              <div className="w-full text-wrap text-gray-700 text-lg">
                Simulation for image processing, such as pre-processing
                filtering.
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
