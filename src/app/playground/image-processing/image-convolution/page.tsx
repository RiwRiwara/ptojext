import BaseLayout from "@/components/layout/BaseLayout";
import MainSection from "@/components/playground_components/image_processing/image_convolution/MainSection";

export default function About() {
  return (
    <BaseLayout>
      <div className=" flex flex-col justify-start h-screen gap-8 p-2 text-center pt-8">
        {/* Content */}
        <h1 className="uppercase text-3xl font-medium mb-3">
          Image Convolution
        </h1>
        <MainSection />
        {/* Content */}
      </div>
    </BaseLayout>
  );
}
