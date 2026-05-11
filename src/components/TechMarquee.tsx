"use client";

import { motion } from "framer-motion";

const row1 = [
 "ChatGPT", "Claude", "n8n", "Make", "Zapier",
 "Arduino", "ESP32", "Raspberry Pi", "Python",
 "JavaScript", "LangChain", "OpenAI API",
 "Notion", "GitHub", "Tailwind", "Next.js",
];

const row2 = [
 "React", "Node.js", "TypeScript", "Docker",
 "PostgreSQL", "MongoDB", "Firebase", "Supabase",
 "Figma", "Postman", "GraphQL", "Prisma",
 "Framer Motion", "Three.js", "Recharts", "Vercel",
];

export default function TechMarquee() {
 const loop1 = [...row1, ...row1];
 const loop2 = [...row2, ...row2];

 return (
  <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 py-16 sm:px-8 lg:px-10">
   <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6 }}
   >
    <p className="mb-8 text-center text-sm font-medium uppercase text-[#a98bff]">
     Tech Stack
    </p>
   </motion.div>

   <div className="space-y-3">
    {/* Row 1 — left to right */}
    <div className="group relative">
     <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#05070d] to-transparent" />
     <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#05070d] to-transparent" />
     <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
      {loop1.map((tool, i) => (
       <span
        key={`r1-${tool}-${i}`}
        className="shrink-0 rounded-lg border border-white/10 bg-[#0b101a] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-[#58e1ff]/40 hover:text-white"
       >
        {tool}
       </span>
      ))}
     </div>
    </div>

    {/* Row 2 — right to left */}
    <div className="group relative">
     <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#05070d] to-transparent" />
     <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#05070d] to-transparent" />
     <div className="flex w-max animate-marquee-reverse gap-3 group-hover:[animation-play-state:paused]">
      {loop2.map((tool, i) => (
       <span
        key={`r2-${tool}-${i}`}
        className="shrink-0 rounded-lg border border-white/10 bg-[#0b101a] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-[#ff8462]/40 hover:text-white"
       >
        {tool}
       </span>
      ))}
     </div>
    </div>
   </div>
  </section>
 );
}
