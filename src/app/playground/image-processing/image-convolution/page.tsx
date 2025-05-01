"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import ImageConvolutionMap from "@/components/playground_components/image_processing/image_convolution_map/ImageConvolutionMap";

export default function ImageConvolutionPage() {
  return (
    <BaseLayout>
      <div className="mx-auto flex flex-col justify-start min-h-screen gap-6 p-4 md:p-6 pt-8 mb-10 max-w-7xl">
        <div className="w-full mx-auto mb-2">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Playground" },
            { label: "Image Processing" },
            { label: "Image Convolution" }
          ]} />
        </div>

        <div className="py-8 px-6  mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#83AFC9]">Image Convolution</h1>
          <p className="text-[#83AFC9] text-center mt-2 max-w-3xl mx-auto opacity-90">
            Learn how image filters work by exploring convolution matrices and their effects on pixels
          </p>
        </div>

        <ImageConvolutionMap />

        <BottomComponent />
      </div>
    </BaseLayout>
  );
}
