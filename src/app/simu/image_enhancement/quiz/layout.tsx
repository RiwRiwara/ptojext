import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Enhancement Quiz | Visual Right",
  description: "Test your knowledge of image enhancement techniques with our interactive quiz. Learn about contrast adjustment, histogram equalization, and more through hands-on challenges.",
  keywords: [
    "image enhancement quiz", 
    "image processing challenge", 
    "medical image analysis", 
    "contrast adjustment", 
    "histogram equalization", 
    "interactive learning",
    "visual right"
  ],
  openGraph: {
    title: "Interactive Image Enhancement Quiz | Visual Right",
    description: "Challenge yourself with our interactive image enhancement quiz. Adjust parameters to match target images and learn image processing techniques.",
    url: "https://www.visualright.org/simu/image_enhancement/quiz",
    siteName: "Visual Right",
    images: [
      {
        url: "https://www.visualright.org/og-image-quiz.png",
        width: 1200,
        height: 630,
        alt: "Visual Right Image Enhancement Quiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Enhancement Quiz | Visual Right",
    description: "Test your image processing skills with our interactive quiz. Learn while you play!",
    images: ["https://www.visualright.org/og-image-quiz.png"],
  },
  alternates: {
    canonical: "https://www.visualright.org/simu/image_enhancement/quiz",
  },
};

// Structured data for the quiz page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Image Enhancement Interactive Quiz",
  "description": "An interactive quiz on image enhancement techniques including contrast adjustment, histogram equalization, and kernel filters.",
  "learningResourceType": "Quiz",
  "educationalLevel": "Beginner to Advanced",
  "audience": {
    "@type": "Audience",
    "audienceType": "Medical Students, Computer Science Students, Image Processing Enthusiasts"
  },
  "teaches": [
    "Image contrast adjustment",
    "Histogram equalization",
    "Gamma correction",
    "Kernel filters",
    "Image sharpening",
    "Medical image analysis"
  ],
  "about": [
    {
      "@type": "Thing",
      "name": "Image Processing",
      "description": "Techniques for manipulating digital images to enhance or extract information."
    },
    {
      "@type": "Thing",
      "name": "Medical Imaging",
      "description": "The use of imaging techniques to visualize the interior of a body for clinical analysis and medical intervention."
    }
  ],
  "provider": {
    "@type": "Organization",
    "name": "Visual Right",
    "url": "https://www.visualright.org"
  }
};

export default function ImageEnhancementQuizLayout({
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
    </>
  );
}
