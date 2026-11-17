import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { buildMetadata } from "@/lib/seo";
import { siteSettingsFixture } from "@/data/fixtures";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: siteSettingsFixture.metaTitle,
  description: siteSettingsFixture.metaDescription,
  path: "/",
  brandName: siteSettingsFixture.brandName,
  absoluteTitle: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${playfair.variable} ${inter.variable} ${jakarta.variable} flex min-h-screen flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary-container focus:px-4 focus:py-2 focus:text-on-primary"
        >
          İçeriğe atla
        </a>
        {children}
      </body>
    </html>
  );
}
