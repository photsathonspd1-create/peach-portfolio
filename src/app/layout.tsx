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
 title: "Peach | AI Workflow Builder — PHOTSATHON KUMTAEW",
 description:
  "AI Workflow Builder — ออกแบบ Automation ด้วย AI Tools ผสาน Electronics และ System Design เพื่อสร้างระบบทำงานได้จริง",
 icons: {
  icon: "/logo.png",
  shortcut: "/logo.png",
 },
 openGraph: {
  title: "Peach | AI Workflow Builder — PHOTSATHON KUMTAEW",
  description:
   "AI Workflow Builder — Automation, Content Systems & Electronics Integration",
  url: "https://peach-portfolio.vercel.app",
  siteName: "Peach Portfolio",
  locale: "th_TH",
  type: "website",
  images: [
   {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: "Peach — Frontend · AI · Motion Systems",
   },
  ],
 },
 twitter: {
  card: "summary_large_image",
  title: "Peach | AI Workflow Builder — PHOTSATHON KUMTAEW",
  description:
   "AI Workflow Builder — Automation, Content Systems & Electronics Integration",
  images: ["/og.png"],
 },
 metadataBase: new URL("https://peach-portfolio.vercel.app"),
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="th" className={`${geistSans.variable} ${geistMono.variable}`}>
   <head>
    <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{
      __html: JSON.stringify({
       "@context": "https://schema.org",
       "@type": "Person",
       "name": "Photsathon Kumtaew",
       "jobTitle": "AI Workflow Builder",
       "email": "acex.peachwork@gmail.com",
       "url": "https://peach-portfolio.vercel.app",
       "sameAs": ["https://github.com/photsathonspd1-create"],
      }),
     }}
    />
   </head>
   <body suppressHydrationWarning>{children}</body>
  </html>
 );
}
