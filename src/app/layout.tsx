import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL, VALUE_PROPOSITION } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";

const description =
  "A space that has existed for years before you arrived. Software engineering, cloud architecture, and data systems.";

export const metadata: Metadata = {
  title: SITE_NAME,
  description,
  keywords: [
    "Prateek",
    "Software Engineer",
    "Data Engineer",
    "Systems Strategist",
    "Azure",
    "Microsoft Fabric",
    "ChampSim",
    "Cache Replacement Design",
    "TensorFlow",
    "NLP",
    "Portfolio",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: VALUE_PROPOSITION,
    type: "website",
    url: SITE_URL,
    siteName: "Prateek's World",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: VALUE_PROPOSITION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
