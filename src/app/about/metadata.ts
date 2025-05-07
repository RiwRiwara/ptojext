import type { Metadata } from "next";

// Define metadata for the About page
export const metadata: Metadata = {
  title: "About Visual Right: AI Playground | Interactive AI Education",
  description: "Learn about Visual Right, an interactive platform for exploring AI and computer science concepts through visualizations and simulations. Meet our team, discover our mission, and explore our technology stack.",
  keywords: ["AI education", "interactive visualizations", "computer science learning", "AI algorithms", "Visual Right", "team", "mission"],
  openGraph: {
    title: "About Visual Right: AI Playground",
    description: "Discover Visual Right's mission to democratize AI education through interactive visualizations and meet the team behind the platform.",
    url: "https://www.visualright.org/about",
    siteName: "Visual Right",
    images: [
      {
        url: "https://www.visualright.org/og-about.png",
        width: 1200,
        height: 630,
        alt: "Visual Right About Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Visual Right: AI Playground",
    description: "Explore Visual Right's mission, team, and technology for interactive AI education.",
    images: ["https://www.visualright.org/og-about.png"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default metadata;
