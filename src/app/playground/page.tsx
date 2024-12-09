import BaseLayout from "@/components/layout/BaseLayout";

export default function About() {
  return (
    <BaseLayout>
      <div>
        <div className=" flex flex-col justify-start h-full gap-8">
          <div className="max-h-[90vh] flex flex-col container mx-auto  max-w-[600px] bg-gradient-to-b from-slate-600 to-gray-400 rounded-[20px] rounded-t-[45px] p-4 text-white border-2 border-white shadow-lg shadow-gray-300">
            {/* Content */}
            <h1 className="uppercase text-3xl font-bold mb-3">About</h1>
            {/* COntent */}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
