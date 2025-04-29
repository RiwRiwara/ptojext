import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
const domain = "https://ptojext.vercel.app";
// Font setup
const comfortaa_font = Comfortaa({
  subsets: ["latin"],
  display: "swap",
});

// SEO & Social Metadata
export const metadata: Metadata = {
  title: "VISUALRIGHT",
  description: "Simulation application for interactive.",
  keywords: [
    "simulation",
    "physics",
    "cloth simulation",
    "interactive",
    "web demo",
    "Matter.js",
    "Next.js",
    "project",
  ],
  authors: [{ name: "Riwara", url: `${domain}` }],
  creator: "Riwara",
  openGraph: {
    title: "VISUALRIGHT",
    description: "Interactive web-based simulation application.",
    url: `${domain}`,
    siteName: "VISUALRIGHT",
    images: [
      {
        url: `${domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "VISUALRIGHT",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VISUALRIGHT",
    description: "Interactive web-based simulation application.",
    creator: "@yourtwitter",
    images: [`${domain}/og-image.png`],
  },
  metadataBase: new URL(domain),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  // You can add more fields as needed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={comfortaa_font.className}>
      <head>
        {/* Extra meta tags for SEO/social (optional, for max compatibility) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href={`${domain}/`} />
        {/* Favicon */}
        <link rel="icon" href={`${domain}/logo/logo-full.png`} />
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
