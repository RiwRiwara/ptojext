import LeftMenu from "@/components/common/LeftMenu";
import RightMenu from "@/components/common/RightMenu";
import { BiImageAlt } from "react-icons/bi";

export default function LandingPage() {
  return (
    <div className="md:grid grid-cols-12 gap-4 bg-amber-50 px-4 py-6">
      {/* ---------------- Left menu ---------------- */}
      <LeftMenu />

      {/* ---------------- Main menu ---------------- */}
      <div className="col-span-7 flex flex-col gap-4 p-4 md:p-10">
        {/* Title section */}
        <div>
          <h1 className="text-[32px] md:text-[56px] text-center md:text-left font-medium uppercase">
            Final Project for
            <br /> Simulation!
          </h1>
        </div>
        {/* Category section */}
        <div className="flex flex-row gap-4 items-center w-full overflow-x-clip ">
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-orange-100 shadow-inner rounded-full">
            <div className="rounded-full h-10 w-10 bg-white shadow-md"></div>
            <div className="text-center px-2 text-nowrap">All</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-orange-100 shadow-inner rounded-full">
            <div className="rounded-full h-10 w-10 bg-white shadow-md"></div>
            <div className="text-center px-2 text-nowrap">Algorithm</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-orange-100 shadow-inner rounded-full">
            <div className="rounded-full h-10 w-10 bg-white shadow-md"></div>
            <div className="text-center px-2 text-nowrap">AI</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-orange-100 shadow-inner rounded-full">
            <div className="rounded-full h-10 w-10 bg-white shadow-md"></div>
            <div className="text-center px-2 text-nowrap">Machine Learning</div>
          </div>
        </div>

        {/* Cards section */}
        <div className="flex flex-col gap-6 overflow-y-auto ">
          <div>
            <div className="mb-4 text-gray-900 font-bold">All items</div>
            <div className="grid grid-cols-2 gap-4">
              {/* Inner card  */}
              <a href="/image_pro">
                <div className="flex flex-col bg-red-300 rounded-2xl p-4 gap-4 shadow-inner group cursor-pointer hover:scale-95 duration-200">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-14 h-14 rounded-full bg-white shadow-md flex justify-center items-center">
                        <BiImageAlt className="w-10 h-10 text-red-500" />
                      </div>
                      <span
                        className={"text- text-xl text-gray-800 font-semibold"}
                      >
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

              {/* Inner card  */}
              <div className="flex flex-col bg-blue-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
              {/* Inner card  */}
              <div className="flex flex-col bg-green-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
              {/* Inner card  */}
              <div className="flex flex-col bg-yellow-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 text-gray-900 font-bold">All items</div>
            <div className="grid grid-cols-2 gap-4">
              {/* Inner card  */}
              <div className="flex flex-col bg-red-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
              {/* Inner card  */}
              <div className="flex flex-col bg-blue-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
              {/* Inner card  */}
              <div className="flex flex-col bg-green-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
              {/* Inner card  */}
              <div className="flex flex-col bg-yellow-300 rounded-2xl p-4 gap-4 shadow-inner">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md"></div>
                    Neural network
                  </div>
                  <div className="px-4 py-1 bg-white rounded-full flex items-start justify-start text-center shadow-md">
                    sdsd
                  </div>
                </div>
                <div className="w-full text-wrap text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  architecto explicabo eius.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Right menu ---------------- */}
      <RightMenu />
    </div>
  );
}
