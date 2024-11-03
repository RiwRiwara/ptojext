import type { Metadata } from "next";
import { Anuphan } from 'next/font/google'
import "./globals.css";

const anuphan_font = Anuphan({
  subsets: ['latin', 'thai'],
  display: 'swap',
})

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
      <body
        className="antialiased font-sans"
      >

        {children}
      </body>
    </html>
  );
}
