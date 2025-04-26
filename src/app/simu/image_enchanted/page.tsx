"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import GrayscaleTransformSection from "@/components/image_enchanted/grayscaleTransform";
import SharpenSmoothTransformSection from "@/components/image_enchanted/sharpenSmoothTransform";
export default function ImageEnhancementPage() {

  return (
    <BaseLayout>
      <GrayscaleTransformSection />
      <SharpenSmoothTransformSection />
    </BaseLayout>
  );
}
