import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Visual Right - Interactive AI Playground",
  description: "Explore interactive AI and algorithm visualization playgrounds with hands-on learning experiences.",
  keywords: "AI playground, algorithm visualization, interactive learning, visual programming",
  alternates: {
    canonical: "https://www.visualright.org/playground",
  },
  openGraph: {
    title: "Visual Right - Interactive AI Playground",
    description: "Explore interactive AI and algorithm visualization playgrounds with hands-on learning experiences.",
    url: "https://www.visualright.org/playground",
    siteName: "Visual Right",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Right - Interactive AI Playground",
    description: "Explore interactive AI and algorithm visualization playgrounds with hands-on learning experiences.",
  },
};

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
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
      <Script id="playground-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
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
