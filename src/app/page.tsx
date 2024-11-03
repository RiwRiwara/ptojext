import LeftMenu from "@/components/common/LeftMenu";
import RightMenu from "@/components/common/RightMenu";
import {
  BiImageAlt,
  BiSolidGrid,
  BiMath,
  BiBraille,
  BiBrain,
} from "react-icons/bi";


export default function LandingPage() {
  return (
    <div className="md:grid grid-cols-12 gap-4 bg-white px-4 py-6">
      {/* ---------------- Left menu ---------------- */}
      <LeftMenu />

      {/* ---------------- Main menu ---------------- */}
      <div className="col-span-7 flex flex-col gap-4 p-4 md:p-10">
        {/* Title section */}
        <div>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-gray-600 from-gray-400">
              Final Project for
            </span>{" "}
            <span className="text-gray-600 hover:text-black duration-300 ease-in-out hover:bg-gray-200 rounded-md px-2 hover:shadow-inner">Simulation!</span>
          </h1>
        </div>
        {/* Category section */}
        <div className="flex flex-row gap-4 items-center w-full overflow-x-clip ">
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
            <BiSolidGrid className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
            <div className="text-center px-2 text-nowrap">All</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
            <BiMath className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
            <div className="text-center px-2 text-nowrap">Algorithm</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
            <BiBraille className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
            <div className="text-center px-2 text-nowrap">AI</div>
          </div>
          <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
            <BiBrain className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
            <div className="text-center px-2 text-nowrap">Machine Learning</div>
          </div>
        </div>

        {/* Cards section */}
        <div className="flex flex-col gap-6 overflow-y-auto ">
          <div>
            <div className="mb-4 text-gray-900 font-bold">All items</div>
            <div className="grid grid-cols-2 gap-4">
              {/* Inner card  */}
              <a href="/simu/image_enchanted">
                <div className="flex flex-col bg-gradient-to-b from-slate-50 to-gray-200 rounded-2xl p-4 gap-4 shadow-inner group cursor-pointer hover:scale-95 duration-200">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-14 h-14 rounded-full bg-white shadow-md flex justify-center items-center">
                        <BiImageAlt className="w-10 h-10 text-gray-2000" />
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
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Right menu ---------------- */}
      <RightMenu />
    </div>
  );
}
