"use client";
import React from "react";
import { TbHome, TbFolder, TbFolderOpen } from "react-icons/tb";
import DropdownTree from "@/components/common/top_dropdown_tree/DropdownTree";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import Link from "next/link";

export default function TopMenuSection() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-10 mt-6 ">
      <div className="rounded-full shadow-md flex flex-row gap-0 p-1 items-center border-1 border-gray-200 bg-white">
        <Link
          href="/"
          className="text-gray-800 p-2 pr-2 bg-gray-100 shadow-inner rounded-l-full"
        >
          <TbHome className="w-8 h-8  " />
        </Link>
        <Popover
          classNames={{
            base: ["before:bg-default-200"],
            content: ["py-3 px-4 mt-4 border border-default-200", "bg-white"],
          }}
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
          placement="bottom"
        >
          <PopoverTrigger>
            <div className=" text-gray-800 p-2 pl-2 bg-gray-50 rounded-r-full hover:bg-gray-200 hover:shadow-inner cursor-pointer">
              {isOpen ? (
                <TbFolderOpen className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              ) : (
                <TbFolder className="w-8 h-8 ease-soft-spring duration-300 hover:scale-95" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownTree />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
