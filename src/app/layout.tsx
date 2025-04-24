import { Comfortaa } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";

// Define the Comfortaa font
const comfortaa_font = Comfortaa({
  subsets: ["latin"],
  display: "swap",
});

// Export metadata for the app
export const metadata = {
  title: "Project Simulation",
  description: "Simulation application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={comfortaa_font.className}>
      <body className="antialiased font-sans">
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}