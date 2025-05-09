import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorting Quiz | Visual Right",
  description: "Test your knowledge of sorting algorithms with our interactive quiz. Learn about sorting concepts, time complexity, and space complexity.",
  keywords: [
    "sorting algorithms quiz", 
    "sorting algorithms challenge", 
    "sorting algorithms time complexity analysis", 
    "sorting algorithms space complexity analysis", 
    "Bubble sort quiz",
    "Selection sort quiz",
    "Merge sort quiz",
    "Quick sort quiz",
    "Insertion sort quiz"
  ],
  openGraph: {
    title: "Interactive Sorting Algorithms Quiz | Visual Right",
    description: "Challenge yourself with our interactive sorting algorithms quiz. Complete sorting algorithm code and challenge analysis time and space complexity.",
    url: "https://www.visualright.org/playground/algorithms/sorting-quiz",
    siteName: "Visual Right",
    images: [
      {
        url: "https://www.visualright.org/og-image-quiz.png",
        width: 1200,
        height: 630,
        alt: "Visual Right Sorting Algorithms Quiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorting Algorithms Quiz | Visual Right",
    description: "Test your sorting algorithm skills with our interactive quiz. Learn while you play!",
    images: ["https://www.visualright.org/og-image-quiz.png"],
  },
  alternates: {
    canonical: "https://www.visualright.org/playground/algorithms/sorting-quiz",
  },
};

// Structured data for the quiz page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Sorting Algorithms Interactive Quiz",
  "description": "An interactive quiz on sorting algorithm concepts including simple coding, time complexity, and space complexity.",
  "learningResourceType": "Quiz",
  "educationalLevel": "Beginner to Advanced",
  "audience": {
    "@type": "Audience",
    "audienceType": "Computer Science Students, Algorithm Enthusiasts"
  },
  "teaches": [
    "Bubble sort",
    "Selection sort",
    "Insertion sort",
    "Merge sort",
    "Quick sort",
    "Time complexity analysis",
    "Space complexity analysis",
    "Sorting algorithm concepts",
  ],
  "about": [
    {
      "@type": "Thing",
      "name": "Sorting Algorithms",
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

export default function SortingQuizLayout({
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
