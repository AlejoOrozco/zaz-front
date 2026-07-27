import type { Metadata } from "next";
import type { JSX } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteProvider } from "@/components/shell/site-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zaz   Your ideas into software",
  description:
    "Save time, automate your work, and ease your workflow all within your budget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-transparent font-sans text-ink">
        <SiteProvider>
          <MotionProvider>{children}</MotionProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
