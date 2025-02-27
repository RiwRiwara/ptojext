import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";
import { AnimatePresence } from "framer-motion";


const anuphan_font = Anuphan({
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Simulation",
  description: "Simulation application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={anuphan_font.className}>
      <body className="antialiased font-sans">
        <AnimatePresence mode="wait" initial={false}>
          <NextUIProvider>{children}</NextUIProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
