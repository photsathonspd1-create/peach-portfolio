"use client";

import { motion } from "framer-motion";

const tools = [
 "ChatGPT", "Claude", "n8n", "Make", "Zapier",
 "Arduino", "ESP32", "Raspberry Pi", "Python",
 "JavaScript", "LangChain", "OpenAI API",
 "Notion", "GitHub", "Tailwind", "Next.js",
];

export default function TechMarquee() {
 const row = [...tools, ...tools]; // double for seamless loop

 return (
  <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 py-12 sm:px-8 lg:px-10">
   <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6 }}
   >
    <p className="mb-6 text-center text-sm font-medium uppercase text-[#a98bff]">
     Tech Stack
    </p>
   </motion.div>

   <div className="group relative">
    {/* Fade edges */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#05070d] to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#05070d] to-transparent" />

    <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
     {row.map((tool, i) => (
      <span
       key={`${tool}-${i}`}
       className="shrink-0 rounded-lg border border-white/10 bg-[#0b101a] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-[#58e1ff]/40 hover:text-white"
      >
       {tool}
      </span>
     ))}
    </div>
   </div>
  </section>
 );
}
