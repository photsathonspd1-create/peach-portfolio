"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface WorkflowNode {
  id: string;
  label: string;
  desc: string;
  x: number;
  y: number;
  defaultX: number;
  defaultY: number;
  color: string;
  w: number;
  h: number;
}

const defaultNodes: WorkflowNode[] = [
  { id: "input", label: "📥 Input", desc: "รับข้อมูลเข้า — จาก webhook, form, หรือ API trigger", x: 40, y: 50, defaultX: 40, defaultY: 50, color: "#58e1ff", w: 130, h: 50 },
  { id: "ai", label: "🤖 AI Process", desc: "ส่งข้อมูลไปยัง AI model เช่น GPT-4, Claude — ประมวลผลและสร้าง output", x: 230, y: 50, defaultX: 230, defaultY: 50, color: "#6688ff", w: 130, h: 50 },
  { id: "decision", label: "🔀 Decision", desc: "ตรวจสอบ output — ถ้าผ่าน criteria → ส่งต่อ, ถ้าไม่ผ่าน → Retry", x: 420, y: 50, defaultX: 420, defaultY: 50, color: "#ffaa00", w: 130, h: 50 },
  { id: "output", label: "📤 Output A", desc: "บันทึกผลลัพธ์ — ส่งไป Notion, Google Sheets, หรือ webhook", x: 420, y: 180, defaultX: 420, defaultY: 180, color: "#28c840", w: 130, h: 50 },
  { id: "retry", label: "🔁 Retry", desc: "ลองประมวลผลใหม่ — ส่ง prompt ที่ปรับปรุงแล้วกลับไป AI", x: 230, y: 180, defaultX: 230, defaultY: 180, color: "#ff4444", w: 130, h: 50 },
  { id: "done", label: "✅ Done", desc: "Workflow สำเร็จ — ส่ง notification และบันทึก log", x: 560, y: 180, defaultX: 560, defaultY: 180, color: "#87ffbe", w: 130, h: 50 },
];

const edges = [
  { from: "input", to: "ai" },
  { from: "ai", to: "decision" },
  { from: "decision", to: "output" },
  { from: "decision", to: "retry" },
  { from: "retry", to: "ai" },
  { from: "output", to: "done" },
];

export default function WorkflowDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getNodeCenter = (id: string) => {
      const n = nodes.find((n) => n.id === id);
      if (!n) return { x: 0, y: 0 };
      return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
    };

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.fillStyle = "rgba(88, 225, 255, 0.04)";
    for (let x = 30; x < w; x += 30) {
      for (let y = 30; y < h; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Edges (bezier curves)
    edges.forEach((edge) => {
      const from = getNodeCenter(edge.from);
      const to = getNodeCenter(edge.to);
      const midX = (from.x + to.x) / 2;

      ctx.strokeStyle = "rgba(88, 225, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(midX, from.y, midX, to.y, to.x, to.y);
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(to.y - (from.y + to.y) / 2, to.x - midX);
      const arrowSize = 8;
      ctx.fillStyle = "rgba(88, 225, 255, 0.5)";
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(
        to.x - arrowSize * Math.cos(angle - 0.4),
        to.y - arrowSize * Math.sin(angle - 0.4)
      );
      ctx.lineTo(
        to.x - arrowSize * Math.cos(angle + 0.4),
        to.y - arrowSize * Math.sin(angle + 0.4)
      );
      ctx.closePath();
      ctx.fill();
    });

    // Nodes
    nodes.forEach((node) => {
      const isSelected = selected === node.id;
      const r = 10;

      // Shadow
      if (isSelected) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
      }

      // Fill
      ctx.fillStyle = isSelected ? "#0f1a25" : "#111827";
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isSelected ? 3 : 1.5;

      // Rounded rect
      ctx.beginPath();
      ctx.moveTo(node.x + r, node.y);
      ctx.lineTo(node.x + node.w - r, node.y);
      ctx.quadraticCurveTo(node.x + node.w, node.y, node.x + node.w, node.y + r);
      ctx.lineTo(node.x + node.w, node.y + node.h - r);
      ctx.quadraticCurveTo(node.x + node.w, node.y + node.h, node.x + node.w - r, node.y + node.h);
      ctx.lineTo(node.x + r, node.y + node.h);
      ctx.quadraticCurveTo(node.x, node.y + node.h, node.x, node.y + node.h - r);
      ctx.lineTo(node.x, node.y + r);
      ctx.quadraticCurveTo(node.x, node.y, node.x + r, node.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = "#e4e4e7";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x + node.w / 2, node.y + node.h / 2);
    });
  }, [nodes, selected]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 700;
    canvas.height = 380;
  }, []);

  // Mouse/touch handlers
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const found = [...nodes].reverse().find(
      (n) => pos.x >= n.x && pos.x <= n.x + n.w && pos.y >= n.y && pos.y <= n.y + n.h
    );
    if (found) {
      setDragging(found.id);
      setDragOffset({ x: pos.x - found.x, y: pos.y - found.y });
      setSelected(found.id);
    } else {
      setSelected(null);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getPos(e);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragging
          ? { ...n, x: Math.max(0, Math.min(570, pos.x - dragOffset.x)), y: Math.max(0, Math.min(330, pos.y - dragOffset.y)) }
          : n
      )
    );
  };

  const handleUp = () => setDragging(null);

  const resetLayout = () => {
    setNodes(defaultNodes.map((n) => ({ ...n, x: n.defaultX, y: n.defaultY })));
    setSelected(null);
  };

  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <section
      id="workflow-demo"
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
          AI Workflow Builder
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          ลากย้าย node เพื่อออกแบบ workflow ของคุณ
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
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onMouseLeave={handleUp}
            onTouchStart={handleDown}
            onTouchMove={handleMove}
            onTouchEnd={handleUp}
            className="block w-full cursor-grab active:cursor-grabbing"
            style={{ minWidth: 700, touchAction: "none" }}
          />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={resetLayout}
            className="rounded-lg border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
          >
            Reset Layout
          </button>
          {selected && (
            <span className="text-sm text-zinc-400">
              เลือก: <span className="text-white">{selectedNode?.label}</span>
            </span>
          )}
        </div>

        {selectedNode && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-[#58e1ff]/30 bg-[#0b101a] p-5"
          >
            <p className="text-sm font-medium uppercase" style={{ color: selectedNode.color }}>
              {selectedNode.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{selectedNode.desc}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
