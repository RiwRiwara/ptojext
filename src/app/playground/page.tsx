"use client";
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function PlaygroundPage() {
  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Playground", href: "/playground" },
              {
                label: "Image Processing",
                href: "/playground/image-processing",
              },
            ]}
          />

          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">
              Image Processing Playground
            </h1>
            <p className="text-gray-600">
              Build your own image processing workflow by dragging and
              connecting nodes
            </p>
          </div>

          {/* Image Processing Flow Editor */}
        </main>
        <BottomComponent />
      </div>
    </BaseLayout>
  );
}
