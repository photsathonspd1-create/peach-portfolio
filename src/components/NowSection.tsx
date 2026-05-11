"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Zap,
  Target,
  Coffee,
  Sparkles,
} from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

const nowItems = [
  {
    icon: Zap,
    label: "Building",
    value: "ACEX AI — ระบบ Autonomous Workflow",
    color: "#58e1ff",
  },
  {
    icon: Target,
    label: "Focus",
    value: "AI Agent, n8n, Make, OpenAI API Integration",
    color: "#ff8462",
  },
  {
    icon: Coffee,
    label: "Learning",
    value: "LangChain, Web Automation, Embedded IoT",
    color: "#87ffbe",
  },
  {
    icon: Sparkles,
    label: "Open to",
    value: "Freelance AI Automation & System Design",
    color: "#a98bff",
  },
];

export default function NowSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="now"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65, ease: smoothEase }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#87ffbe]/30 bg-[#87ffbe]/10 px-3 py-1.5 text-sm font-medium text-[#87ffbe]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#87ffbe] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#87ffbe]" />
          </span>
          Currently active
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          ตอนนี้ทำอะไรอยู่
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          ภาพรวมของสิ่งที่กำลังโฟกัส เรียนรู้ และพร้อมรับงาน
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {nowItems.map((nowItem, index) => {
          const Icon = nowItem.icon;
          return (
            <motion.div
              key={nowItem.label}
              variants={item}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -6, transition: { duration: 0.2 } }
              }
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0b101a] p-5 transition duration-300 hover:border-white/20"
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                      }
                }
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${nowItem.color}22, transparent)`,
                }}
              />
              <div className="relative">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: `${nowItem.color}40`,
                    backgroundColor: `${nowItem.color}15`,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: nowItem.color }}
                    aria-hidden="true"
                  />
                </span>
                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {nowItem.label}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {nowItem.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
