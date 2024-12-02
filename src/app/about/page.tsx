"use client";
import PopoverButton from "@/components/old-component/common/PopoverButton";
import CommonLayout from "@/components/layout/CommonLayout";
import Link from "next/link";
import { BiMenu, BiSolidHome } from "react-icons/bi";
import { FaInfo, FaArrowCircleLeft } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { motion, useCycle } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

export default function AboutPage() {
  return (
    <CommonLayout>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className=" flex flex-col justify-start h-full gap-8">
          <div className=" flex flex-col container mx-auto max-w-[600px] bg-gradient-to-b from-slate-600 to-gray-400 rounded-[20px] p-4 text-white border-2 border-white shadow-lg shadow-gray-300">
            <div className="flex flex-row justify-center mb-6">
              <div className="w-full  flex p-2 flex-row gap-2 md:gap-0  justify-between  overflow-auto  bg-gradient-to-b from-slate-600 to-gray-400 rounded-full text-white border-2 border-white shadow-md shadow-gray-300">
                <div className="flex flex-row  gap-2 ">
                  <Link
                    href={"/"}
                    className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"
                  >
                    <FaArrowCircleLeft className="w-8 h-8 text-gray-800 " />
                  </Link>
                  <PopoverButton
                    buttonText={
                      <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
                        <BiMenu className="w-8 h-8 text-gray-800 " />
                      </div>
                    }
                    content={
                      <div className="flex flex-row gap-2 flex-wrap w-fit">
                        <div className="p-2 rounded-md bg-gray-800 text-white">
                          menu 1
                        </div>
                        <div className="p-2 rounded-md bg-gray-800 text-white">
                          menu 2
                        </div>
                        <div className="p-2 rounded-md bg-gray-800 text-white">
                          menu 3
                        </div>
                      </div>
                    }
                  />
                </div>

                <div className="flex flex-row  gap-2 ">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer">
                    <GiStairsGoal className="w-8 h-8 text-gray-800 " />
                  </div>

                  <Link
                    href={"/about"}
                    className="w-12 h-12 bg-white rounded-full shadow-md flex justify-center items-center hover:shadow-lg hover:rotate-12 hover:shadow-gray-400 duration-200 ease-in-out cursor-pointer"
                  >
                    <FaInfo className="w-8 h-8 text-gray-800 " />
                  </Link>
                </div>
              </div>
            </div>
            <h1 className="uppercase text-3xl font-bold mb-3">About</h1>
            <p className="uppercase text-lg">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed
              asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Sed asperiores facere, dolore architecto ipsum amet nemo ab
              consectetur mollitia distinctio excepturi optio voluptas repellat
              a quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Sed asperiores facere, dolore
              architecto ipsum amet nemo ab consectetur mollitia distinctio
              excepturi optio voluptas repellat a quasi, cum, eaque perspiciatis
              quod? mollitia distinctio excepturi optio voluptas repellat a
              quasi, cum, eaque perspiciatis quod? Lorem, ipsum dolor sit amet
              consectetur amet nemo ab consectetur mollitia distinctio excepturi
              optio
            </p>
          </div>
        </div>
      </motion.div>
    </CommonLayout>
  );
}
