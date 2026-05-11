"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const lines = [
  { text: "> Initializing AI Workflow System...", delay: 0 },
  { text: "> Loading profile: พสธร คุ้มแถว", delay: 1200 },
  { text: "> Role: AI Workflow Builder ✓", delay: 2400 },
  { text: "> Skills: AI Automation | Electronics | Prompt Engineering", delay: 3600 },
  { text: "> Status: Available for work 🟢", delay: 4800 },
];

export default function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setTimeout(() => setDone(true), 400);
      return;
    }

    const line = lines[currentLine].text;

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => {
          const copy = [...prev];
          copy[currentLine] = line.slice(0, currentChar + 1);
          return copy;
        });
        setCurrentChar((c) => c + 1);
      }, 28 + Math.random() * 22);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
        setVisibleLines((prev) => [...prev, ""]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-xl border border-[#58e1ff]/20 bg-[#0a0e14]/90 shadow-2xl shadow-[#58e1ff]/5 backdrop-blur">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-zinc-500">acex@ai ~ /workflow</span>
        </div>

        {/* Terminal body */}
        <div className="min-h-[220px] p-5 font-mono text-sm leading-7">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <span
                  className={`${
                    i === 3
                      ? "text-[#87ffbe]"
                      : i === 4
                      ? "text-[#28c840]"
                      : "text-[#58e1ff]"
                  }`}
                >
                  {line}
                </span>
                {i === currentLine && currentLine < lines.length && (
                  <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] animate-pulse bg-[#58e1ff]" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA after animation */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#58e1ff] px-5 py-3 text-sm font-semibold text-[#031018] transition hover:bg-[#87ffbe]"
            >
              ดูโปรเจกต์
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
            >
              ติดต่อ
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
