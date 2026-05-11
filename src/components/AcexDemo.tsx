"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";

const steps = [
  { label: "PLAN", desc: "วิเคราะห์และวางแผน", icon: "🧠" },
  { label: "DO", desc: "ลงมือทำงาน", icon: "⚡" },
  { label: "CHECK", desc: "ตรวจสอบผลลัพธ์", icon: "🔍" },
  { label: "ACT", desc: "ปรับปรุงและพัฒนา", icon: "🚀" },
];

export default function AcexDemo() {
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [done, setDone] = useState(false);

  const handleStart = () => {
    if (!input.trim() || running) return;
    setRunning(true);
    setActiveStep(0);
    setDone(false);

    steps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i), i * 1200);
    });

    setTimeout(() => {
      setDone(true);
      setRunning(false);
    }, steps.length * 1200 + 400);
  };

  const handleReset = () => {
    setInput("");
    setRunning(false);
    setActiveStep(-1);
    setDone(false);
  };

  return (
    <section
      id="acex-demo"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase text-[#58e1ff]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          ลองใช้ ACEX AI
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          พิมพ์งานที่คุณอยากให้ AI จัดการ แล้วดู ACEX AI วางแผนและทำงานแบบ Autonomous
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10"
      >
        {/* Input */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="พิมพ์งานที่คุณอยากให้ AI จัดการ..."
            disabled={running}
            className="flex-1 rounded-lg border border-white/10 bg-[#0b101a] px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#58e1ff]/50 focus:ring-1 focus:ring-[#58e1ff]/30 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleStart}
            disabled={!input.trim() || running}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#58e1ff] px-6 py-3 text-sm font-semibold text-[#031018] transition hover:bg-[#87ffbe] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play className="h-4 w-4" />
            เริ่ม Workflow
          </button>
        </div>

        {/* Steps */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const isActive = activeStep >= i;
            const isCurrent = activeStep === i;
            const isCompleted = activeStep > i || done;

            return (
              <motion.div
                key={step.label}
                animate={
                  isCurrent
                    ? { scale: [1, 1.03, 1], borderColor: ["rgba(88,225,255,0.6)", "rgba(88,225,255,0.2)", "rgba(88,225,255,0.6)"] }
                    : {}
                }
                transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                className={`relative overflow-hidden rounded-lg border p-5 transition-all duration-500 ${
                  isActive
                    ? "border-[#58e1ff]/40 bg-[#0d1a26] shadow-lg shadow-[#58e1ff]/10"
                    : "border-white/10 bg-[#0b101a]"
                }`}
              >
                {/* Glow */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,225,255,0.08),transparent_70%)]" />
                )}

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{step.icon}</span>
                    {isCompleted && (
                      <CheckCircle2 className="h-5 w-5 text-[#28c840]" />
                    )}
                  </div>
                  <p
                    className={`mt-4 text-lg font-bold ${
                      isActive ? "text-[#58e1ff]" : "text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className={`mt-2 text-sm ${isActive ? "text-zinc-300" : "text-zinc-600"}`}>
                    {step.desc}
                  </p>
                </div>

                {/* Progress bar */}
                {isCurrent && !done && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#58e1ff]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.1, ease: "linear" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Result */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-[#28c840]/30 bg-[#0d1a14] p-6 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-[#28c840]" />
              <p className="text-lg font-semibold text-white">
                ✅ Workflow สำเร็จแล้ว!
              </p>
              <p className="text-sm text-zinc-300">
                นี่คือตัวอย่างว่า ACEX AI ทำงานอย่างไร — Plan → Do → Check → Act วน Loop จนกว่าจะสำเร็จ
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.12]"
              >
                ลองใหม่
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
