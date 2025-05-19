"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import ImageConvolutionMap from "@/components/playground_components/image_processing/image_convolution_map/ImageConvolutionMap";
import { useTranslation } from "react-i18next";
export default function ImageConvolutionPage() {
  const { t } = useTranslation("imageprocessing");
  return (
    <BaseLayout>
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Playground" },
              { label: "Image Processing" },
              { label: "Image Convolution" },
            ]}
          />

          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("title-sub")}</p>
          </div>
          <ImageConvolutionMap />
        </main>
      </div>
    </BaseLayout>
  );
}
