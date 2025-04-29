"use client";
import { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import GrayscaleTransformSection from "@/components/image_enhancement/grayscaleTransform";
import SharpenSmoothTransformSection from "@/components/image_enhancement/sharpenSmoothTransform";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslation } from "react-i18next";
import HistogramProcessingSection from "@/components/image_enhancement/histogramProcessing";

export default function ImageEnhancementPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [openSpatial, setOpenSpatial] = useState(false);
  const [openPoint, setOpenPoint] = useState(false);
  const [openMask, setOpenMask] = useState(false);
  const { t } = useTranslation("imageenchanted");

  return (
    <BaseLayout>
      <div className="container mx-auto flex flex-col justify-start h-screen gap-8 p-2 pt-8 mb-10 ">
        <div className="max-w-3xl mx-auto mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Image Enhancement" },
            ]}
          />
        </div>
        <h1 className="uppercase text-3xl font-bold text-center">
          Image Enhancement
        </h1>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {t("whatisimageenchanted")}
            </h1>
            <p className="text-lg">{t("mean")}</p>
          </div>
        </div>
        {/* Tree Menu */}
        <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-md">
          <div className="flex flex-col gap-2 text-gray-700 text-sm">
            {/* Top Level */}
            <button
              onClick={() => setOpenSpatial(!openSpatial)}
              className="text-left font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all w-full"
            >
              {openSpatial ? "▼" : "▶"} Spatial Domain
            </button>

            {/* Spatial Sub Levels */}
            <div
              className={`ml-4 overflow-hidden transition-all ${
                openSpatial ? "max-h-96" : "max-h-0"
              }`}
            >
              {/* Point Processing */}
              <button
                onClick={() => setOpenPoint(!openPoint)}
                className="text-left w-full py-2 px-4 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                {openPoint ? "▼" : "▶"} Point Processing
              </button>

              <div
                className={`ml-4 overflow-hidden transition-all ${
                  openPoint ? "max-h-40" : "max-h-0"
                }`}
              >
                <button
                  onClick={() => setSelectedSection("grayscale")}
                  className="text-left w-full py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all"
                >
                  Gray Level Transformation
                </button>
                <button
                  onClick={() => setSelectedSection("histogram")}
                  className="text-left w-full py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all"
                >
                  Histogram Processing
                </button>
              </div>

              {/* Mask Processing */}
              <button
                onClick={() => setOpenMask(!openMask)}
                className="text-left w-full py-2 px-4 rounded-lg hover:bg-gray-100 transition-all font-medium mt-2"
              >
                {openMask ? "▼" : "▶"} Mask Processing
              </button>

              <div
                className={`ml-4 overflow-hidden transition-all ${
                  openMask ? "max-h-40" : "max-h-0"
                }`}
              >
                <button
                  onClick={() => setSelectedSection("sharpenSmooth")}
                  className="text-left w-full py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all"
                >
                  Smoothing and Sharpening
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Render Selected Section */}
        <div className="w-full flex justify-center mt-10">
          <div className="max-w-5xl">
            {selectedSection === "grayscale" && <GrayscaleTransformSection />}
            {selectedSection === "histogram" && <HistogramProcessingSection />}
            {selectedSection === "sharpenSmooth" && (
              <SharpenSmoothTransformSection />
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
