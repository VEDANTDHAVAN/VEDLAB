import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import './globals.css';
import { Room } from "./Room";

const worksans = Work_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  weight: ['400', '600', '700']
})

export const metadata: Metadata = {
  title: "VedLab",
  description: "A minimalist Figma Clone using Fabric.js and LiveBlocks for realtime collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${worksans.className}`}
      >
        <Room>
         {children}
        </Room>
      </body>
    </html>
  );
}
