"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import GrayscaleTransformSection from "@/components/image_enhancement/grayscaleTransform";
import SharpenSmoothTransformSection from "@/components/image_enhancement/sharpenSmoothTransform";
import Breadcrumb from "@/components/common/Breadcrumb";
export default function ImageEnhancementPage() {

  return ( 
    <BaseLayout>
    <div className="mx-auto flex flex-col justify-start h-screen gap-8 p-2 pt-8 mb-10">
        <div className="max-w-6xl mx-auto mb-4">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Image Enhancement" }
          ]} />
        </div>
        <h1 className="uppercase text-3xl font-bold mt-3 text-center">Image Enhancement</h1>


        <GrayscaleTransformSection />
        <SharpenSmoothTransformSection />

        {/* <h1 className="text-2xl font-semibold mb-2">Adjust the kernel</h1>
        <ImageConvolution /> */}
      </div>
    </BaseLayout>
  ); 
}