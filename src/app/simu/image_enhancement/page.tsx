"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import GrayscaleTransformSection from "@/components/image_enhancement/GrayscaleTransform";
import SharpenSmoothTransformSection from "@/components/image_enhancement/SharpenSmoothTransform";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslation } from "react-i18next";
import HistogramProcessingSection from "@/components/image_enhancement/HistogramProcessing";
import ImageSubtractionSection from "@/components/image_enhancement/ImageSubtraction";
import { Button } from "@nextui-org/button";

export default function ImageEnhancementPage() {
  const { t } = useTranslation("imageenchanted");

  const sections = [
    { id: "grayscale", label: "Gray Level Transformation" },
    { id: "histogram", label: "Histogram Processing" },
    { id: "sharpenSmooth", label: "Smoothing and Sharpening" },
    { id: "subtraction", label: "Image Subtraction" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <BaseLayout>
      <div className="container mx-auto flex flex-col justify-start min-h-screen gap-8 p-4 pt-8 mb-10">
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
            <h2 className="text-2xl font-semibold mb-2">
              {t("whatisimageenchanted")}
            </h2>
            <p className="text-lg">{t("mean")}</p>
          </div>
        </div>
        {/* Navigation Buttons */}
        <nav className="sticky top-0 z-10 bg-white py-4">
          <div className="container mx-auto flex flex-wrap gap-4 justify-center">
            {sections.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => scrollToSection(id)}
                className="px-4 py-2 text-sm font-medium rounded-md transition bg-gray-100 text-gray-700 hover:bg-indigo-100"
                aria-label={`Scroll to ${label}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Content Sections */}
        <section id="grayscale" className="pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Apply Grayscale Transformations to Your Image
          </h2>

          <GrayscaleTransformSection />
        </section>
        <section id="histogram" className="pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Histogram Processing
          </h2>
          <HistogramProcessingSection />
        </section>
        <section id="sharpenSmooth" className="pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Smoothing and Sharpening
          </h2>
          <SharpenSmoothTransformSection />
        </section>
        <section id="subtraction" className="pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Image Subtraction
          </h2>
          <ImageSubtractionSection />
        </section>
      </div>
    </BaseLayout>
  );
}
