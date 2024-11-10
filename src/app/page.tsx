import LeftMenu from "@/components/common/LeftMenu";
import RightMenu from "@/components/common/RightMenu";
import CardSection from "@/components/home/CardSection";
import CategorySection from "@/components/home/CategorySection";
import { BiImageAlt } from "react-icons/bi";

export default function LandingPage() {
  return (
    <div className="md:grid grid-cols-12 gap-4 bg-white px-4 py-6">
      {/* ---------------- Left menu ---------------- */}
      <LeftMenu />

      {/* ---------------- Main menu ---------------- */}
      <div className="col-span-7 flex flex-col gap-4 p-4 md:p-10">
        {/* Title section */}
        <div>
          <h1 className="mb-2 text-center text-2xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl text-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-gray-600 from-gray-400">
              Final Project for
            </span>
            <span className="text-gray-600 hover:text-black duration-300 ease-in-out hover:bg-gray-200 rounded-md px-2 hover:shadow-inner">
              Simulation!
            </span>
          </h1>
        </div>

        {/* Category section */}
        <CategorySection />
        {/* Cards section */}
        <CardSection />
      </div>

      {/* ---------------- Right menu ---------------- */}
      <RightMenu />
    </div>
  );
}
