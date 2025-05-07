import { Metadata } from "next";

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
    canonical: "https://www.visualright.org/about",
    languages: {
      'en': 'https://www.visualright.org/about?lang=en',
      'th': 'https://www.visualright.org/about?lang=th',
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="alternate" hrefLang="en" href="https://www.visualright.org/about?lang=en" />
        <link rel="alternate" hrefLang="th" href="https://www.visualright.org/about?lang=th" />
        <link rel="alternate" hrefLang="x-default" href="https://www.visualright.org/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "About Visual Right: AI Playground",
              "url": "https://www.visualright.org/about",
              "description": "Learn about Visual Right's mission to make AI and computer science accessible through interactive visualizations, meet our team, and explore our technology.",
              "inLanguage": ["en", "th"],
              "publisher": {
                "@type": "Organization",
                "name": "Visual Right",
                "url": "https://www.visualright.org",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.visualright.org/logo.png",
                  "width": 200,
                  "height": 60,
                },
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "Visual Right",
                "description": "An educational platform for interactive AI and computer science visualizations.",
                "member": [
                  {
                    "@type": "Person",
                    "name": "Riw Awirut",
                    "jobTitle": "Lead Developer",
                    "image": "https://www.visualright.org/team/profile1.webp",
                    "sameAs": ["https://github.com/riwara"]
                  },
                  {
                    "@type": "Person",
                    "name": "Gunn",
                    "jobTitle": "Algorithm Specialist",
                    "image": "https://www.visualright.org/team/profile2.webp",
                    "sameAs": ["https://github.com/Gunn"]
                  },
                  {
                    "@type": "Person",
                    "name": "Punnapa",
                    "jobTitle": "UX/UI Designer",
                    "image": "https://www.visualright.org/team/profile3.webp",
                    "sameAs": ["https://github.com/Punnapa", "https://sarahjohnson.design"]
                  }
                ]
              }
            }),
          }}
        />
      </head>
      {children}
    </>
  );
}
