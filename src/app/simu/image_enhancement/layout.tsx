import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Enhancement Visualizations | Visual Right",
  description:
    "Explore interactive visualizations of image enhancement techniques including grayscale transformations, histogram processing, and spatial filtering. Learn through hands-on experimentation.",
  keywords: [
    "image enhancement",
    "image processing visualization",
    "grayscale transformation",
    "histogram equalization",
    "spatial filtering",
    "interactive learning",
    "visual right",
  ],
  openGraph: {
    title: "Interactive Image Enhancement Visualizations | Visual Right",
    description:
      "Explore and learn image enhancement techniques through interactive visualizations. Adjust parameters in real-time and see the effects on various images.",
    url: "https://www.visualright.org/simu/image_enhancement",
    siteName: "Visual Right",
    images: [
      {
        url: "https://www.visualright.org/og-image-enhancement.png",
        width: 1200,
        height: 630,
        alt: "Visual Right Image Enhancement Visualizations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Enhancement Visualizations | Visual Right",
    description:
      "Learn image processing through interactive visualizations. Experiment with different techniques and parameters.",
    images: ["https://www.visualright.org/og-image-enhancement.png"],
  },
  alternates: {
    canonical: "https://www.visualright.org/simu/image_enhancement",
  },
};

// Structured data for the image enhancement page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Interactive Image Enhancement Visualizations",
  description:
    "Interactive visualizations for learning image enhancement techniques including grayscale transformations, histogram processing, and spatial filtering.",
  learningResourceType: "Interactive Resource",
  educationalLevel: "Beginner to Advanced",
  audience: {
    "@type": "Audience",
    audienceType: "Students, Educators, Image Processing Enthusiasts",
  },
  teaches: [
    "Grayscale transformations",
    "Histogram equalization",
    "Spatial filtering",
    "Image enhancement techniques",
    "Digital image processing",
  ],
  about: [
    {
      "@type": "Thing",
      name: "Image Processing",
      description:
        "Techniques for manipulating digital images to enhance or extract information.",
    },
    {
      "@type": "Thing",
      name: "Computer Vision",
      description:
        "The field of computer science that enables computers to derive meaningful information from digital images and videos.",
    },
  ],
  provider: {
    "@type": "Organization",
    name: "Visual Right",
    url: "https://www.visualright.org",
  },
  hasPart: [
    {
      "@type": "LearningResource",
      name: "Grayscale Transformations",
      description:
        "Interactive visualization of linear, logarithmic, and power-law (gamma) transformations on grayscale images.",
    },
    {
      "@type": "LearningResource",
      name: "Histogram Processing",
      description:
        "Interactive visualization of histogram equalization, stretching, and other histogram-based enhancement techniques.",
    },
    {
      "@type": "LearningResource",
      name: "Image Enhancement Quiz",
      description:
        "Interactive quiz to test knowledge of image enhancement techniques.",
      url: "https://www.visualright.org/simu/image_enhancement/quiz",
    },
  ],
};

export default function ImageEnhancementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
      <BottomComponent />
    </>
  );
}
