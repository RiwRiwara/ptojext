import { BiSolidGrid, BiMath, BiBraille, BiBrain } from "react-icons/bi";
import { IoCodeSlash } from "react-icons/io5";

export default function CategorySection() {
  return (
    <div className="flex flex-row gap-4 items-center w-full overflow-auto cus-scroll py-2">
      <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
        <BiSolidGrid className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
        <div className="text-center px-2 text-nowrap">All</div>
      </div>
      <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
        <IoCodeSlash className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
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
      <div className="flex flex-row  gap-4 p-1.5 justify-between text-lg font-bold text-gray-800 items-center bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 shadow-inner rounded-full">
        <BiMath className="rounded-full h-10 w-10 bg-white shadow-md p-1" />
        <div className="text-center px-2 text-nowrap">Image Processing</div>
      </div>
    </div>
  );
}
