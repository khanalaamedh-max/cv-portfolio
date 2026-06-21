import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandip Poudel | Digital Marketing Expert",
  description:
    "Portfolio and CV website for Sandip Poudel, a digital marketing expert, social media marketer, ads runner, web developer, and business growth strategist.",
  keywords: [
    "Sandip Poudel",
    "Digital Marketing",
    "Meta Ads",
    "Facebook Marketing",
    "Instagram Marketing",
    "Google Ads",
    "Web Developer",
    "Social Media Marketing",
    "Performance Marketing"
  ],
  openGraph: {
    title: "Sandip Poudel | Digital Marketing Expert",
    description:
      "Modern portfolio for digital marketing, paid ads, web development, and business growth.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
