import LeftMenu from "@/components/common/LeftMenu";
import RightMenu from "@/components/common/RightMenu";
import CardSection from "@/components/home/CardSection";
import CategorySection from "@/components/home/CategorySection";
import CommonLayout from "@/components/layout/CommonLayout";

export default function LandingPage() {
  return (
    <CommonLayout>
      <div className="md:grid grid-cols-12 gap-4">
        {/* ---------------- Left menu ---------------- */}
        <LeftMenu />

        {/* ---------------- Main menu ---------------- */}
        <div className="col-span-7 flex flex-col md:gap-4 p-2 md:p-10 my-6 md:my-0">
          {/* Title section */}
          <h1 className="mb-2 text-center text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl text-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-slate-500 from-gray-200">
              Ptojext{" "}
            </span>
            <span className="text-gray-200 hover:text-black duration-300 ease-in-out hover:bg-gray-100 rounded-md px-2 hover:shadow-inner">
              Simulation!
            </span>
          </h1>
          

          {/* Category section */}
          <CategorySection />
          {/* Cards section */}
          <CardSection />
        </div>

        {/* ---------------- Right menu ---------------- */}
        <RightMenu />
      </div>
    </CommonLayout>
  );
}
