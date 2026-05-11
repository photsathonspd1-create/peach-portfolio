"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const data = [
  { skill: "AI Workflow", value: 95 },
  { skill: "Prompt Engineering", value: 90 },
  { skill: "Automation", value: 92 },
  { skill: "System Integration", value: 85 },
  { skill: "Electronics", value: 80 },
  { skill: "Data & Insight", value: 75 },
];

export default function SkillsRadar() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animatedData, setAnimatedData] = useState(
    data.map((d) => ({ ...d, value: 0 }))
  );
  const started = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedData(
              data.map((d) => ({
                ...d,
                value: Math.round(eased * d.value),
              }))
            );
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills-radar"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase text-[#a98bff]">Skill Map</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          ทักษะแบบ Radar
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          มุมมองแบบ 360° ของทักษะที่ใช้ในการทำงานจริง
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-10 flex justify-center"
      >
        <div className="w-full max-w-lg">
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart data={animatedData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="value"
                stroke="#58e1ff"
                fill="#58e1ff"
                fillOpacity={0.15}
                strokeWidth={2}
                animationDuration={0}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {data.map((d, i) => (
              <div key={d.skill} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#58e1ff]" />
                <span className="text-xs text-zinc-400">
                  {d.skill}:{" "}
                  <span className="font-semibold text-white">
                    {animatedData[i].value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
