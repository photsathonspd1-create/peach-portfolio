"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown } from "lucide-react";

const comparisons = [
  {
    before: "สร้าง Content ด้วยมือ — 4 ชั่วโมง/วัน",
    after: "AI Workflow อัตโนมัติ — 20 นาที/วัน",
    saved: 83,
    metric: "เวลา",
  },
  {
    before: "รายงานข้อมูล Manual — 2 ชั่วโมง",
    after: "CLI Tool + Automation — 5 นาที",
    saved: 96,
    metric: "เวลา",
  },
  {
    before: "ตอบลูกค้าซ้ำๆ ทุกวัน — เหนื่อย",
    after: "AI Agent จัดการแทน — ไม่ต้อง touch",
    saved: 100,
    metric: "แรง",
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

export default function BeforeAfter() {
  return (
    <section
      id="impact"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase text-[#ff8462]">Real Impact</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          ก่อน vs หลังใช้ Automation
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          ผลลัพธ์จริงจากการใช้ AI Workflow — ลดเวลา ลดแรง เพิ่มประสิทธิภาพ
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {comparisons.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#0b101a]"
          >
            {/* Before */}
            <div className="border-b border-white/[0.06] bg-[#0f0f0f]/50 p-5">
              <p className="text-xs font-medium uppercase text-zinc-500">ก่อน</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{card.before}</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ArrowRight className="h-4 w-4 text-zinc-500 rotate-90" />
              </div>
            </div>

            {/* After */}
            <div className="border-t border-white/[0.06] bg-[#0a1a12]/50 p-5">
              <p className="text-xs font-medium uppercase text-[#28c840]">หลัง</p>
              <p className="mt-3 text-sm leading-6 text-[#87ffbe]">{card.after}</p>
            </div>

            {/* Savings */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#0b101a] px-5 py-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[#28c840]" />
                <span className="text-xs text-zinc-400">ประหยัด{card.metric}</span>
              </div>
              <p className="text-2xl font-bold text-[#28c840]">
                <AnimatedNumber value={card.saved} suffix="%" />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
