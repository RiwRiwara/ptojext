import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Quiz | Visual Right",
  description: "Test your knowledge of search algorithms with our interactive quiz. Learn about sorting concepts, time complexity, and space complexity.",
  keywords: [
    "search algorithms quiz", 
    "search algorithms challenge", 
    "search algorithms time complexity analysis", 
    "search algorithms space complexity analysis", 
    "Linear search quiz",
    "Binary search quiz",
    "Jump search quiz",
    "Interpolation search quiz"
  ],
  openGraph: {
    title: "Interactive Search Algorithms Quiz | Visual Right",
    description: "Challenge yourself with our interactive search algorithms quiz. Complete search algorithm code and challenge analysis time and space complexity.",
    url: "https://www.visualright.org/playground/algorithms/search-quiz",
    siteName: "Visual Right",
    images: [
      {
        url: "https://www.visualright.org/og-image-quiz.png",
        width: 1200,
        height: 630,
        alt: "Visual Right Search Algorithms Quiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Algorithms Quiz | Visual Right",
    description: "Test your search algorithm skills with our interactive quiz. Learn while you play!",
    images: ["https://www.visualright.org/og-image-quiz.png"],
  },
  alternates: {
    canonical: "https://www.visualright.org/playground/algorithms/search-quiz",
  },
};

// Structured data for the quiz page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Search Algorithms Interactive Quiz",
  "description": "An interactive quiz on sorting algorithm concepts including simple coding, time complexity, and space complexity.",
  "learningResourceType": "Quiz",
  "educationalLevel": "Beginner to Advanced",
  "audience": {
    "@type": "Audience",
    "audienceType": "Computer Science Students, Algorithm Enthusiasts"
  },
  "teaches": [
    "Linear search quiz",
    "Binary search quiz",
    "Jump search quiz",
    "Interpolation search quiz",
    "Time complexity analysis",
    "Space complexity analysis",
    "Search algorithm concepts",
  ],
  "about": [
    {
      "@type": "Thing",
      "name": "Search Algorithms",
      "description": "Algorithms that put elements of a list in a certain order."
    },
    {
      "@type": "Thing",
      "name": "Time Complexity",
      "description": "A computational complexity that describes the amount of time it takes to run an algorithm as a function of the length of the input."
    },
    {
      "@type": "Thing",
      "name": "Space Complexity",
      "description": "A computational complexity that describes the amount of working storage an algorithm needs."
    }
  ],
  "provider": {
    "@type": "Organization",
    "name": "Visual Right",
    "url": "https://www.visualright.org"
  }
};

export default function SearchQuizLayout({
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
