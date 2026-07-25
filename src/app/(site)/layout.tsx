import type { Metadata, Viewport } from "next";
import { Playfair_Display, Open_Sans, Pinyon_Script } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getSiteSettings } from "@/lib/cms/site-settings";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-decorative",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Thryve Co.",
    template: "%s | Thryve Co.",
  },
  description:
    "Your brand's new creative friend. We build brands that grow with intention.",
  keywords: [
    "Thryve Co.",
    "branding",
    "creative studio",
    "brand strategy",
    "design",
  ],
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#6B0F1A",
};

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`h-full ${playfair.variable} ${openSans.variable} ${pinyonScript.variable}`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <Navbar site={site} variant="dark" />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
