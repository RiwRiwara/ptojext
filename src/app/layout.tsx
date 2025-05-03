import type { Metadata, Viewport } from "next";
import { Comfortaa } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const domain = "https://www.visualright.org/";

// Font setup
const comfortaa_font = Comfortaa({
  subsets: ["latin"],
  display: "swap",
});

// Viewport export for viewport and themeColor
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#83AFC9",
};

// SEO & Social Metadata
export const metadata: Metadata = {
  title: "Visual Right: AI Simulations and Visualizations",
  description: "Discover Many Simulations in an interactive AI playground. Master computer science with engaging visualizations.",
  keywords: [
    "pathfinding algorithms",
    "A* algorithm",
    "Dijkstra algorithm",
    "physics simulations",
    "computer science visualizations",
    "AI interactive playground",
    "algorithm visualizations",
    "educational simulations",
    "learn computer science",
  ],
  authors: [{ name: "Riwara", url: domain }],
  creator: "Riwara",
  openGraph: {
    title: "AI Playground: Simulations and Visualizations",
    description:
      "Discover Many Simulations in an interactive AI playground. Master computer science with engaging visualizations.",
    url: domain,
    siteName: "VisualRight",
    images: [
      {
        url: `${domain}og-image.png`,
        width: 1200,
        height: 630,
        alt: "VisualRight: AI Interactive Playground",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Playground: Algorithm & Physics Visualizations",
    description:
      "Discover A*, Dijkstra, and physics simulations. Master computer science with VisualRight’s interactive visuals.",
    creator: "@Riwara", // Update if handle changes
    images: [`${domain}og-image.png`],
  },
  metadataBase: new URL(domain),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: `${domain}favicon.ico`,
    apple: `${domain}apple-touch-icon.png`,
  },
  other: {
    "application-ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "VisualRight",
      url: domain,
      description:
        "Interactive visualizations and simulations for learning computer science concepts like pathfinding algorithms and physics.",
      publisher: {
        "@type": "Organization",
        name: "VisualRight",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${domain}search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={comfortaa_font.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VisualRight",
              url: domain,
              description:
                "Interactive visualizations and simulations for learning computer science concepts like pathfinding algorithms and physics.",
              publisher: {
                "@type": "Organization",
                name: "VisualRight",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${domain}search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className="antialiased font-sans">
        <AnimatePresence mode="wait" initial={false}>
          <NextUIProvider>{children}</NextUIProvider>
        </AnimatePresence>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}