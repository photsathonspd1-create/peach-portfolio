"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface ComponentInfo {
  name: string;
  desc: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "rect" | "circle";
}

const components: ComponentInfo[] = [
  { name: "Battery", desc: "แหล่งจ่ายไฟ 5V — จ่ายไฟให้ Arduino และ components ทั้งหมด", x: 50, y: 130, w: 60, h: 80, type: "rect" },
  { name: "Arduino", desc: "ไมโครคอนโทรลเลอร์หลัก — รับ input จาก sensor ประมวลผล และสั่งงาน output", x: 220, y: 100, w: 140, h: 120, type: "rect" },
  { name: "Resistor", desc: "จำกัดกระแสไฟ — ป้องกัน LED ไหม้ ค่าที่ใช้ 220Ω", x: 400, y: 150, w: 60, h: 30, type: "rect" },
  { name: "LED", desc: "แสดงผลลัพธ์ — ติดเมื่อ Arduino ส่งสัญญาณ HIGH (3.3V/5V)", x: 520, y: 140, w: 40, h: 40, type: "circle" },
  { name: "Relay", desc: "สวิตช์ไฟฟ้า — ควบคุมอุปกรณ์แรงดันสูงด้วยสัญญาณ 5V จาก Arduino", x: 260, y: 260, w: 100, h: 50, type: "rect" },
  { name: "Sensor", desc: "DHT22 — วัดอุณหภูมิและความชื้น ส่งข้อมูลผ่าน Digital Pin", x: 500, y: 40, w: 80, h: 50, type: "rect" },
];

const wires = [
  { from: [110, 160], to: [220, 160], color: "#ff4444" },
  { from: [360, 160], to: [400, 165], color: "#ffaa00" },
  { from: [460, 165], to: [520, 160], color: "#ffaa00" },
  { from: [290, 220], to: [290, 260], color: "#58e1ff" },
  { from: [360, 180], to: [540, 65], color: "#58e1ff" },
  { from: [50, 200], to: [50, 280], to2: [260, 285], color: "#222222" },
];

export default function CircuitDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOn, setIsOn] = useState(false);
  const [selected, setSelected] = useState<ComponentInfo | null>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; progress: number; wireIdx: number }[]>([]);
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#0a1a0a";
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = "rgba(88, 225, 255, 0.08)";
    for (let x = 20; x < w; x += 20) {
      for (let y = 20; y < h; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Wires
    wires.forEach((wire) => {
      ctx.strokeStyle = isOn ? wire.color : "#333";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wire.from[0], wire.from[1]);
      if (wire.to2) {
        ctx.lineTo(wire.to[0], wire.to[1]);
        ctx.lineTo(wire.to2[0], wire.to2[1]);
      } else {
        ctx.lineTo(wire.to[0], wire.to[1]);
      }
      ctx.stroke();
    });

    // Components
    components.forEach((comp) => {
      const isSelected = selected?.name === comp.name;

      if (comp.type === "circle") {
        // LED
        ctx.beginPath();
        ctx.arc(comp.x + comp.w / 2, comp.y + comp.h / 2, comp.w / 2, 0, Math.PI * 2);
        if (isOn) {
          ctx.fillStyle = "#ffdd44";
          ctx.shadowColor = "#ffdd44";
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = "#333";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isSelected ? "#58e1ff" : "#555";
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();
      } else {
        // Rectangle component
        ctx.fillStyle = isSelected ? "#0f2530" : "#111";
        ctx.strokeStyle = isSelected ? "#58e1ff" : "#444";
        ctx.lineWidth = isSelected ? 3 : 1.5;

        // Rounded rect
        const r = 6;
        ctx.beginPath();
        ctx.moveTo(comp.x + r, comp.y);
        ctx.lineTo(comp.x + comp.w - r, comp.y);
        ctx.quadraticCurveTo(comp.x + comp.w, comp.y, comp.x + comp.w, comp.y + r);
        ctx.lineTo(comp.x + comp.w, comp.y + comp.h - r);
        ctx.quadraticCurveTo(comp.x + comp.w, comp.y + comp.h, comp.x + comp.w - r, comp.y + comp.h);
        ctx.lineTo(comp.x + r, comp.y + comp.h);
        ctx.quadraticCurveTo(comp.x, comp.y + comp.h, comp.x, comp.y + comp.h - r);
        ctx.lineTo(comp.x, comp.y + r);
        ctx.quadraticCurveTo(comp.x, comp.y, comp.x + r, comp.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = isOn ? "#ddd" : "#666";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(comp.name, comp.x + comp.w / 2, comp.y + comp.h / 2 + 4);

        // Arduino pin labels
        if (comp.name === "Arduino") {
          ctx.fillStyle = "#58e1ff";
          ctx.font = "8px monospace";
          ctx.textAlign = "left";
          ["5V", "GND", "D13", "A0", "D2"].forEach((pin, i) => {
            ctx.fillText(pin, comp.x + 5, comp.y + 18 + i * 18);
          });
        }
      }
    });

    // Current particles
    if (isOn) {
      ctx.fillStyle = "#58e1ff";
      particles.forEach((p) => {
        const wire = wires[p.wireIdx];
        if (!wire) return;
        const fx = wire.from[0];
        const fy = wire.from[1];
        const tx = wire.to2 ? wire.to2[0] : wire.to[0];
        const ty = wire.to2 ? wire.to2[1] : wire.to[1];
        const px = fx + (tx - fx) * p.progress;
        const py = fy + (ty - fy) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [isOn, selected, particles]);

  // Animation loop for particles
  useEffect(() => {
    if (!isOn) {
      setParticles([]);
      return;
    }

    // Initialize particles
    const initParticles = wires.flatMap((_, wi) =>
      [0, 0.33, 0.66].map((offset) => ({
        x: 0, y: 0, progress: offset, wireIdx: wi,
      }))
    );
    setParticles(initParticles);

    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          progress: (p.progress + dt * 0.5) % 1,
        }))
      );
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isOn]);

  // Draw loop
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle canvas click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const found = components.find(
      (c) => mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h
    );
    setSelected(found || null);
  };

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = 700;
      canvas.height = 320;
    };
    handleResize();
  }, []);

  return (
    <section
      id="circuit-demo"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase text-[#87ffbe]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          วงจรอิเล็กทรอนิกส์
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          คลิกที่ component เพื่อดูรายละเอียด
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10"
      >
        <div ref={containerRef} className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b101a]">
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            className="block w-full cursor-pointer"
            style={{ minWidth: 700 }}
          />
        </div>

        {/* Toggle button */}
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setIsOn(!isOn); setSelected(null); }}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isOn
                ? "bg-[#ff4444]/20 text-[#ff4444] border border-[#ff4444]/40 hover:bg-[#ff4444]/30"
                : "bg-[#87ffbe]/15 text-[#87ffbe] border border-[#87ffbe]/40 hover:bg-[#87ffbe]/25"
            }`}
          >
            {isOn ? "ปิดวงจร" : "เปิดวงจร"}
          </button>
          {isOn && (
            <span className="flex items-center gap-2 text-sm text-[#87ffbe]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#87ffbe]" />
              วงจรทำงาน
            </span>
          )}
        </div>

        {/* Info panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-[#58e1ff]/30 bg-[#0b101a] p-5"
          >
            <p className="text-sm font-medium uppercase text-[#58e1ff]">{selected.name}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{selected.desc}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
