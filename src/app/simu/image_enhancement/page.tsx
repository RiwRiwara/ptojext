"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import GrayscaleTransformSection from "@/components/image_enhancement/grayscaleTransform";
import SharpenSmoothTransformSection from "@/components/image_enhancement/sharpenSmoothTransform";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslation } from "react-i18next";
import HistogramProcessingSection from "@/components/image_enhancement/histogramProcessing";
import ImageSubtractionSection from "@/components/image_enhancement/imageSubtraction";
import { Button } from "@nextui-org/button";

export default function ImageEnhancementPage() {
  const { t } = useTranslation("imageenhancement");

  const sections = [
    { id: "grayscale", label: "Gray Level Transformation" },
    { id: "histogram", label: "Histogram Processing" },
    { id: "sharpenSmooth", label: "Smoothing and Sharpening" },
    { id: "subtraction", label: "Image Subtraction" },
    { id: "quiz", label: "Challenge Quiz", href: "/simu/image_enhancement/quiz" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Image Enhancement" },
            ]}
          />

          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">
              Image Enhancement
            </h1>
            <p>
              {t("mean", "Image enhancement is the process of making images more useful (such as making images more visually appealing, bringing out specific features, removing noise from images and highlighting interesting details in images). ")}
            </p>
          </div>

          {/* Navigation Buttons */}
          <nav className="block top-0 z-10 bg-white py-4 drop-shadow-md rounded-xl mb-4">
            <div className="container mx-auto flex flex-wrap gap-4 justify-center">
              {sections.map(({ id, label, href }) => (
                <Button
                  key={id}
                  onPress={() => href ? window.location.href = href : scrollToSection(id)}
                  className="w-full lg:w-fit py-2 mx-4 md:mx-0 text-sm font-medium rounded-md transition bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-gray-900"
                  aria-label={href ? `Navigate to ${label}` : `Scroll to ${label}`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </nav>

          {/* Content Sections */}
          <div className="flex flex-col gap-6">
            <section
              id="grayscale"
              className="bg-white rounded-xl drop-shadow-md"
            >
              <div className="flex items-center gap-6 bg-indigo-50 p-6">
                <div className="bg-indigo-600 h-8 w-1 rounded-full"></div>
                <h2 className="text-lg md:text-2xl font-semibold">
                  Apply Grayscale Transformations to Your Image
                </h2>
              </div>

              <GrayscaleTransformSection />
            </section>

            <section
              id="histogram"
              className="bg-white rounded-xl drop-shadow-md"
            >
              <div className="flex items-center gap-6 bg-blue-50 p-6">
                <div className="bg-blue-600 h-8 w-1 rounded-full"></div>
                <h2 className="text-lg md:text-2xl font-semibold">
                  Histogram Processing
                </h2>
              </div>

              <HistogramProcessingSection />
            </section>

            <section id="sharpenSmooth" className="bg-white rounded-xl drop-shadow-md">
              <div className="flex items-center gap-6 bg-green-50 p-6">
                <div className="bg-green-600 h-8 w-1 rounded-full"></div>
                <h2 className="text-lg md:text-2xl font-semibold">
                  Smoothing and Sharpening
                </h2>
              </div>

              <SharpenSmoothTransformSection />
            </section>

            <section id="subtraction" className="bg-white rounded-xl drop-shadow-md">
              <div className="flex items-center gap-6 bg-purple-50 p-6">
                <div className="bg-purple-600 h-8 w-1 rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-semibold text-center">
                  Image Subtraction
                </h2>
              </div>

              <ImageSubtractionSection />
            </section>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
