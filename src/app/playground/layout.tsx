"use client";

import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  // SEO metadata
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Visual Right - Interactive AI Playground",
    "url": "https://www.visualright.org/playground",
    "description": "Explore interactive AI and algorithm visualization playgrounds with hands-on learning experiences.",
    "inLanguage": "en",
    "keywords": "AI playground, algorithm visualization, interactive learning, visual programming"
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <BaseLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <BottomComponent />
        </div>
      </BaseLayout>
    </>
  );
}
