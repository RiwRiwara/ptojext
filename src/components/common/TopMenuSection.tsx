import { TbCategoryMinus, TbHome } from "react-icons/tb";
import Link from "next/link";

export default function TopMenuSection() {
  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-10 mt-6 ">
      <div className="rounded-full shadow-md flex flex-row gap-4 py-1 px-3 items-center border-1 border-gray-200 bg-white">
        <Link href={"/"} className="text-gray-800 p-2 bg-gray-100 rounded-full">
          <TbHome className="w-8 h-8  " />
        </Link>
        <Link
          href={"/"}
          className=" text-gray-800 p-2 bg-gray-100 rounded-full"
        >
          <TbCategoryMinus className="w-8 h-8 " />
        </Link>
      </div>
    </div>
  );
}
