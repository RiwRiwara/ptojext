"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import ImageConvolutionMap from "@/components/playground_components/image_processing/image_convolution_map/ImageConvolutionMap";

export default function ImageConvolutionPage() {
  return (
    <BaseLayout>
      <div className="mx-auto flex flex-col justify-start h-screen gap-8 p-2 pt-8 mb-10">
        <div className="max-w-6xl mx-auto mb-4">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Image Convolution" }
          ]} />
        </div>
        <h1 className="uppercase text-3xl font-bold mt-3 text-center">Image Convolution</h1>


        <ImageConvolutionMap />

        {/* <h1 className="text-2xl font-semibold mb-2">Adjust the kernel</h1>
        <ImageConvolution /> */}
        <BottomComponent />
      </div>

    </BaseLayout>
  );
}
