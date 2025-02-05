import BaseLayout from "@/components/layout/BaseLayout";
import ImageConvolution from "@/components/playground_components/image_processing/image_convolution_res/ImageConvolution";
import ImageConvolutionMap from "@/components/playground_components/image_processing/image_convolution_map/ImageConvolutionMap";

export default function About() {
  return (
    <BaseLayout>
      <div className="container mx-auto flex flex-col justify-start h-screen gap-8 p-2 pt-8 mb-10 ">

        <h1 className="uppercase text-3xl font-bold mt-3 text-center">Image Convolution</h1>


        <ImageConvolutionMap />

        {/* <h1 className="text-2xl font-semibold mb-2">Adjust the kernel</h1>
        <ImageConvolution /> */}
      </div>
    </BaseLayout>
  );
}
