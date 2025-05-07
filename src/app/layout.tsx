import type { Metadata, Viewport } from "next";
import { Comfortaa, Anuphan } from "next/font/google";
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
  variable: "--font-en",
});

const anuphan_font = Anuphan({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-th",
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
    "AI simulation",
    "AI visualization",
    "Simulations",
    "Visualizations",
    "physics simulations",
    "computer science visualizations",
    "AI interactive playground",
    "algorithm visualizations",
    "visual right",
    "visualright",
    "image enhancement",
    "image processing",
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
      "Discover A*, Dijkstra, and physics simulations. Master computer science with VisualRight's interactive visuals.",
    creator: "@Riwara",
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
    icon: [
      { url: `${domain}favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${domain}favicon-16x16.png`, sizes: "16x16", type: "image/png" },
    ],
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
    <html lang="en" className={`${comfortaa_font.variable} ${anuphan_font.variable}`}>

      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://www.visualright.org/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://www.visualright.org/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://www.visualright.org/favicon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#83AFC9" />
        <meta name="application-name" content="VisualRight" />
        <meta name="msapplication-TileColor" content="#83AFC9" />

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

      <body className="antialiased ">
        <AnimatePresence mode="wait" initial={false}>
          <NextUIProvider>{children}</NextUIProvider>
        </AnimatePresence>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}