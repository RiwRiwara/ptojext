"use client";
import { Link } from "@nextui-org/link";
import { FaInfoCircle } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";

function ConvolutionPage() {
  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {/* Header section */}
      <div className="p-2 bg-white rounded-md border-2 border-blue-800 mb-4 flex justify-between items-center">
        <div className="flex flex-row gap-2 items-center test-tour">
          <Link href={"/"}>
            <IoCaretBack size={30} className="text-gray-800" />
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <FaInfoCircle
            size={25}
            className="hover:scale-110 duration-300 text-blue-900 cursor-pointer"
          />
          <h1 className="font-semibold text-2xl uppercase text-blue-900">
            Image Convolution
          </h1>
        </div>
      </div>

      {/* Image and Grid Canvas */}
      <div className="shadow-md rounded-md border-2 bg-white border-blue-800 min-h-svh w-100 m-auto p-2 ">
        <div className="grid grid-cols-2 gap-4">
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default ConvolutionPage;
