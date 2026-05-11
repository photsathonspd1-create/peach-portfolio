"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Footer() {
 const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 return (
  <footer className="relative mx-auto w-full max-w-7xl px-5 pb-8 pt-16 sm:px-8 lg:px-10">
   <div className="border-t border-white/10 pt-10">
    <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
     <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: smoothEase }}
     >
      <a href="#top" className="flex items-center gap-3 text-sm font-semibold text-white">
       <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
        P
       </span>
       <span>Peach</span>
      </a>
      <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
       Building precise, fast, unforgettable interfaces.
       <br />
       PHOTSATHON KUMTAEW — Frontend · AI · Motion
      </p>
     </motion.div>

     <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
      className="flex items-center gap-6"
     >
      <div className="flex gap-3 text-sm text-zinc-500">
       {[
        { label: "Projects", href: "#projects" },
        { label: "Skills", href: "#skills" },
        { label: "Now", href: "#now" },
        { label: "Contact", href: "#contact" },
       ].map((link) => (
        <a
         key={link.label}
         href={link.href}
         className="transition hover:text-white"
        >
         {link.label}
        </a>
       ))}
      </div>

      <button
       type="button"
       onClick={scrollToTop}
       className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:border-white/25 hover:text-white"
       aria-label="Back to top"
      >
       <ArrowUp className="h-4 w-4" />
      </button>
     </motion.div>
    </div>

    <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
     <p className="text-xs text-zinc-600">
      © {new Date().getFullYear()} Peach (PHOTSATHON KUMTAEW). All rights reserved.
     </p>
     <p className="flex items-center gap-1.5 text-xs text-zinc-600">
      Built with <Heart className="h-3 w-3 text-[#ff8462]" aria-hidden="true" /> Next.js + Three.js + Framer Motion
     </p>
    </div>
   </div>
  </footer>
 );
}
