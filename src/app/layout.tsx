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
 title: "Acex AI | AI Workflow Builder — PHOTSATHON KUMTAEW",
 description:
  "AI Workflow Builder — ออกแบบ Automation ด้วย AI Tools ผสาน Electronics และ System Design เพื่อสร้างระบบทำงานได้จริง",
 keywords: ["AI", "Automation", "Workflow", "Electronics", "Arduino", "ESP32", "Next.js", "Portfolio"],
 authors: [{ name: "PHOTSATHON KUMTAEW" }],
 creator: "PHOTSATHON KUMTAEW",
 icons: {
  icon: "/logo.png",
  shortcut: "/logo.png",
 },
 openGraph: {
  title: "Acex AI | AI Workflow Builder — PHOTSATHON KUMTAEW",
  description:
   "AI Workflow Builder — Automation, Content Systems & Electronics Integration",
  url: "https://peach-portfolio.vercel.app",
  siteName: "Acex AI Portfolio",
  locale: "th_TH",
  type: "website",
  images: [
   {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: "Peach — AI Workflow Builder · Electronics · Automation",
   },
  ],
 },
 twitter: {
  card: "summary_large_image",
  title: "Acex AI | AI Workflow Builder — PHOTSATHON KUMTAEW",
  description:
   "AI Workflow Builder — Automation, Content Systems & Electronics Integration",
  images: ["/og.png"],
 },
 robots: {
  index: true,
  follow: true,
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
       "alternateName": "Peach",
       "jobTitle": "AI Workflow Builder",
       "description": "AI Workflow Builder — ออกแบบ Automation ด้วย AI Tools ผสาน Electronics และ System Design",
       "email": "acex.peachwork@gmail.com",
       "telephone": "+66641546355",
       "url": "https://peach-portfolio.vercel.app",
       "image": "https://peach-portfolio.vercel.app/og.png",
       "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chonburi",
        "addressCountry": "TH"
       },
       "sameAs": [
        "https://github.com/photsathonspd1-create",
        "https://line.me/ti/p/~peatz21"
       ],
       "knowsAbout": [
        "AI Automation",
        "Workflow Design",
        "Electronics",
        "Arduino",
        "ESP32",
        "Next.js",
        "TypeScript",
        "Python"
       ]
      }),
     }}
    />
   </head>
   <body suppressHydrationWarning>{children}</body>
  </html>
 );
}
