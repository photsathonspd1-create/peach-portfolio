import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Peach | พสธร คุ้มแถว",
  description:
    "Portfolio ของ Peach (พสธร คุ้มแถว) — Frontend architecture, AI integration, motion systems, and polished digital experiences.",
  openGraph: {
    title: "Peach | พสธร คุ้มแถว",
    description:
      "Builder who blends sharp product taste, technical execution, AI systems, and motion-rich digital experiences.",
    url: "https://peach.dev",
    siteName: "Peach Portfolio",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/peach-hero-art.png",
        width: 1400,
        height: 1000,
        alt: "Peach Portfolio — abstract geometric hero art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peach | พสธร คุ้มแถว",
    description:
      "Builder who blends sharp product taste, technical execution, AI systems, and motion-rich digital experiences.",
    images: ["/peach-hero-art.png"],
  },
  metadataBase: new URL("https://peach.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
