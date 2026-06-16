import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prateek — Software Engineer",
  description:
    "A space that has existed for years before you arrived. Software engineering, cloud architecture, and data systems.",
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
  openGraph: {
    title: "Prateek — Software Engineer",
    description: "A space that has existed for years before you arrived.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
