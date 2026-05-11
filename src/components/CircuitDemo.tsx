"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileCanvasWrapper from "@/components/MobileCanvasWrapper";

/* ── Types ── */
interface Pin {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "power" | "ground" | "signal" | "input" | "output";
}

interface Comp {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  pins: Pin[];
  value?: number; // for potentiometer / sensor
  state?: boolean; // for switch / LED
}

interface Wire {
  id: string;
  from: string; // pin id
  to: string; // pin id
  color: string;
}

/* ── Component Factory ── */
let nextId = 1;
function makeComp(type: string, x: number, y: number): Comp {
  const id = `comp_${nextId++}`;
  switch (type) {
    case "battery":
      return { id, type, x, y, w: 60, h: 90, label: "Battery 9V", color: "#ff4444",
        pins: [
          { id: `${id}_p1`, x: 30, y: -6, label: "+", type: "power" },
          { id: `${id}_p2`, x: 30, y: 96, label: "−", type: "ground" },
        ] };
    case "arduino":
      return { id, type, x, y, w: 160, h: 110, label: "Arduino Uno", color: "#00979d",
        pins: [
          { id: `${id}_5v`, x: -6, y: 20, label: "5V", type: "power" },
          { id: `${id}_gnd`, x: -6, y: 40, label: "GND", type: "ground" },
          { id: `${id}_d13`, x: -6, y: 60, label: "D13", type: "output" },
          { id: `${id}_d2`, x: -6, y: 80, label: "D2", type: "input" },
          { id: `${id}_a0`, x: 166, y: 20, label: "A0", type: "input" },
          { id: `${id}_d7`, x: 166, y: 50, label: "D7", type: "output" },
          { id: `${id}_d8`, x: 166, y: 80, label: "D8", type: "output" },
        ] };
    case "led":
      return { id, type, x, y, w: 44, h: 50, label: "LED", color: "#ffdd44",
        pins: [
          { id: `${id}_a`, x: 10, y: 56, label: "Anode", type: "input" },
          { id: `${id}_k`, x: 34, y: 56, label: "Cathode", type: "output" },
        ], state: false };
    case "resistor":
      return { id, type, x, y, w: 70, h: 28, label: "220Ω", color: "#ff8844",
        pins: [
          { id: `${id}_1`, x: -6, y: 14, label: "1", type: "input" },
          { id: `${id}_2`, x: 76, y: 14, label: "2", type: "output" },
        ] };
    case "sensor":
      return { id, type, x, y, w: 80, h: 55, label: "DHT22", color: "#58e1ff",
        pins: [
          { id: `${id}_vcc`, x: 15, y: -6, label: "VCC", type: "power" },
          { id: `${id}_out`, x: 65, y: -6, label: "OUT", type: "output" },
          { id: `${id}_gnd`, x: 40, y: 61, label: "GND", type: "ground" },
        ], value: 25 };
    case "buzzer":
      return { id, type, x, y, w: 50, h: 50, label: "Buzzer", color: "#a98bff",
        pins: [
          { id: `${id}_p`, x: 15, y: 56, label: "+", type: "input" },
          { id: `${id}_n`, x: 35, y: 56, label: "−", type: "ground" },
        ] };
    case "motor":
      return { id, type, x, y, w: 60, h: 60, label: "DC Motor", color: "#87ffbe",
        pins: [
          { id: `${id}_p`, x: 15, y: -6, label: "+", type: "input" },
          { id: `${id}_n`, x: 45, y: -6, label: "−", type: "output" },
        ] };
    case "switch":
      return { id, type, x, y, w: 70, h: 35, label: "Switch", color: "#ffd166",
        pins: [
          { id: `${id}_1`, x: -6, y: 17, label: "1", type: "input" },
          { id: `${id}_2`, x: 76, y: 17, label: "2", type: "output" },
        ], state: false };
    case "relay":
      return { id, type, x, y, w: 90, h: 55, label: "Relay Module", color: "#ff8462",
        pins: [
          { id: `${id}_in`, x: -6, y: 20, label: "IN", type: "input" },
          { id: `${id}_vcc`, x: -6, y: 40, label: "VCC", type: "power" },
          { id: `${id}_no`, x: 96, y: 20, label: "NO", type: "output" },
          { id: `${id}_com`, x: 96, y: 40, label: "COM", type: "output" },
        ] };
    default:
      return { id, type, x, y, w: 60, h: 40, label: type, color: "#888",
        pins: [] };
  }
}

/* ── Palette items ── */
const paletteItems = [
  { type: "battery", icon: "🔋", label: "Battery" },
  { type: "arduino", icon: "🟦", label: "Arduino" },
  { type: "led", icon: "💡", label: "LED" },
  { type: "resistor", icon: "⚡", label: "Resistor" },
  { type: "sensor", icon: "🌡️", label: "Sensor" },
  { type: "buzzer", icon: "🔔", label: "Buzzer" },
  { type: "motor", icon: "⚙️", label: "Motor" },
  { type: "switch", icon: "🔘", label: "Switch" },
  { type: "relay", icon: "📡", label: "Relay" },
];

/* ── Preset circuits ── */
function buildPreset(name: string): { comps: Comp[]; wires: Wire[] } {
  nextId = 1;
  const comps: Comp[] = [];
  const wires: Wire[] = [];

  if (name === "blink") {
    const bat = makeComp("battery", 60, 80);
    const ard = makeComp("arduino", 200, 60);
    const res = makeComp("resistor", 440, 100);
    const led = makeComp("led", 530, 80);
    comps.push(bat, ard, res, led);
    wires.push(
      { id: "w1", from: bat.pins[0].id, to: ard.pins[0].id, color: "#ff4444" },
      { id: "w2", from: bat.pins[1].id, to: ard.pins[1].id, color: "#444" },
      { id: "w3", from: ard.pins[2].id, to: res.pins[0].id, color: "#58e1ff" },
      { id: "w4", from: res.pins[1].id, to: led.pins[0].id, color: "#ffaa00" },
      { id: "w5", from: led.pins[1].id, to: ard.pins[1].id, color: "#444" },
    );
  } else if (name === "sensor") {
    const bat = makeComp("battery", 50, 80);
    const ard = makeComp("arduino", 200, 50);
    const sensor = makeComp("sensor", 450, 40);
    const led = makeComp("led", 450, 180);
    const res = makeComp("resistor", 380, 190);
    comps.push(bat, ard, sensor, led, res);
    wires.push(
      { id: "w1", from: bat.pins[0].id, to: ard.pins[0].id, color: "#ff4444" },
      { id: "w2", from: bat.pins[1].id, to: ard.pins[1].id, color: "#444" },
      { id: "w3", from: ard.pins[4].id, to: sensor.pins[1].id, color: "#58e1ff" },
      { id: "w4", from: ard.pins[2].id, to: res.pins[0].id, color: "#ffaa00" },
      { id: "w5", from: res.pins[1].id, to: led.pins[0].id, color: "#ffaa00" },
      { id: "w6", from: led.pins[1].id, to: ard.pins[1].id, color: "#444" },
    );
  } else if (name === "relay") {
    const bat = makeComp("battery", 50, 90);
    const ard = makeComp("arduino", 200, 60);
    const sw = makeComp("switch", 430, 50);
    const relay = makeComp("relay", 430, 140);
    const motor = makeComp("motor", 580, 140);
    comps.push(bat, ard, sw, relay, motor);
    wires.push(
      { id: "w1", from: bat.pins[0].id, to: ard.pins[0].id, color: "#ff4444" },
      { id: "w2", from: bat.pins[1].id, to: ard.pins[1].id, color: "#444" },
      { id: "w3", from: ard.pins[5].id, to: sw.pins[0].id, color: "#58e1ff" },
      { id: "w4", from: sw.pins[1].id, to: relay.pins[0].id, color: "#ffd166" },
      { id: "w5", from: relay.pins[2].id, to: motor.pins[0].id, color: "#87ffbe" },
      { id: "w6", from: motor.pins[1].id, to: ard.pins[1].id, color: "#444" },
    );
  }
  return { comps, wires };
}

/* ── Main Component ── */
export default function CircuitDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [comps, setComps] = useState<Comp[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [powered, setPowered] = useState(false);
  const [draggingComp, setDraggingComp] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wiringFrom, setWiringFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [animTime, setAnimTime] = useState(0);
  const animRef = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState({ w: 750, h: 420 });

  // Load preset on mount
  useEffect(() => {
    const preset = buildPreset("blink");
    setComps(preset.comps);
    setWires(preset.wires);
  }, []);

  // Resize
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = Math.min(container.clientWidth, 900);
      setCanvasSize({ w, h: 420 });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop
  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAnimTime(prev => prev + dt);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Find pin world position
  const getPinPos = useCallback((pinId: string): { x: number; y: number } | null => {
    for (const comp of comps) {
      for (const pin of comp.pins) {
        if (pin.id === pinId) {
          return { x: comp.x + pin.x, y: comp.y + pin.y };
        }
      }
    }
    return null;
  }, [comps]);

  // Check if circuit is complete (has power path)
  const isCircuitComplete = useCallback((): boolean => {
    if (wires.length < 2) return false;
    // Check if there's a path from battery to ground through components
    const hasBattery = comps.some(c => c.type === "battery");
    const hasArduino = comps.some(c => c.type === "arduino");
    return hasBattery && hasArduino && wires.length >= 3;
  }, [comps, wires]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isPinPowered = (pinId: string): boolean => {
      if (!powered || !isCircuitComplete()) return false;
      return wires.some(w => w.from === pinId || w.to === pinId);
    };

    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = "#080c12";
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = "rgba(88, 225, 255, 0.05)";
    for (let gx = 20; gx < W; gx += 20) {
      for (let gy = 20; gy < H; gy += 20) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const isActive = powered && isCircuitComplete();

    // Draw wires
    wires.forEach((wire) => {
      const from = getPinPos(wire.from);
      const to = getPinPos(wire.to);
      if (!from || !to) return;

      ctx.strokeStyle = isActive ? wire.color : `${wire.color}66`;
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.lineCap = "round";

      // Bezier curve
      const midX = (from.x + to.x) / 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(midX, from.y, midX, to.y, to.x, to.y);
      ctx.stroke();

      // Animated current flow
      if (isActive) {
        const numDots = 3;
        for (let i = 0; i < numDots; i++) {
          const t = ((animTime * 0.8 + i / numDots) % 1);
          const u = 1 - t;
          const px = u * u * u * from.x + 3 * u * u * t * midX + 3 * u * t * t * midX + t * t * t * to.x;
          const py = u * u * u * from.y + 3 * u * u * t * from.y + 3 * u * t * t * to.y + t * t * t * to.y;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = wire.color;
          ctx.shadowColor = wire.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    });

    // Wiring preview line
    if (wiringFrom) {
      const from = getPinPos(wiringFrom);
      if (from) {
        ctx.strokeStyle = "rgba(88, 225, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw components
    comps.forEach((comp) => {
      const isSelected = selectedComp === comp.id;
      const r = 8;

      // Component body
      ctx.fillStyle = isSelected ? "#0f1a25" : "#111827";
      ctx.strokeStyle = isSelected ? "#58e1ff" : `${comp.color}88`;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;

      // Shadow for selected
      if (isSelected) {
        ctx.shadowColor = "#58e1ff";
        ctx.shadowBlur = 10;
      }

      // Rounded rect
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
      ctx.shadowBlur = 0;

      // Type-specific rendering
      if (comp.type === "led" && isActive && isPinPowered(comp.pins[0].id)) {
        // LED glow
        const cx = comp.x + comp.w / 2;
        const cy = comp.y + comp.h / 2 - 5;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
        grd.addColorStop(0, "rgba(255, 221, 68, 0.8)");
        grd.addColorStop(0.5, "rgba(255, 221, 68, 0.2)");
        grd.addColorStop(1, "rgba(255, 221, 68, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fill();

        // LED body
        ctx.fillStyle = "#ffdd44";
        ctx.shadowColor = "#ffdd44";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy - 2, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // LED legs
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 10);
        ctx.lineTo(cx - 5, cy + 22);
        ctx.moveTo(cx + 5, cy + 10);
        ctx.lineTo(cx + 5, cy + 22);
        ctx.stroke();
      } else if (comp.type === "led") {
        const cx = comp.x + comp.w / 2;
        const cy = comp.y + comp.h / 2 - 5;
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 10);
        ctx.lineTo(cx - 5, cy + 22);
        ctx.moveTo(cx + 5, cy + 10);
        ctx.lineTo(cx + 5, cy + 22);
        ctx.stroke();
      } else if (comp.type === "battery") {
        // Battery terminals
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(comp.x + 20, comp.y - 4, 20, 6);
        ctx.fillStyle = "#444";
        ctx.fillRect(comp.x + 20, comp.y + comp.h - 2, 20, 6);
        // Battery body detail
        ctx.strokeStyle = "#ff444466";
        ctx.lineWidth = 1;
        ctx.strokeRect(comp.x + 8, comp.y + 15, comp.w - 16, comp.h - 30);
        // + - labels
        ctx.fillStyle = "#ff4444";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("+", comp.x + comp.w / 2, comp.y + 30);
        ctx.fillStyle = "#666";
        ctx.fillText("−", comp.x + comp.w / 2, comp.y + comp.h - 18);
      } else if (comp.type === "arduino") {
        // Arduino PCB detail
        ctx.fillStyle = "#00979d22";
        ctx.fillRect(comp.x + 5, comp.y + 5, comp.w - 10, comp.h - 10);
        // Chip
        ctx.fillStyle = "#111";
        ctx.fillRect(comp.x + 50, comp.y + 30, 60, 40);
        ctx.strokeStyle = "#00979d44";
        ctx.lineWidth = 1;
        ctx.strokeRect(comp.x + 50, comp.y + 30, 60, 40);
        // Pin headers
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = "#222";
          ctx.fillRect(comp.x + 10 + i * 12, comp.y + 85, 8, 4);
        }
        // USB
        ctx.fillStyle = "#888";
        ctx.fillRect(comp.x + comp.w - 25, comp.y + 5, 18, 12);
        // Power LED
        if (isActive) {
          ctx.fillStyle = "#28c840";
          ctx.shadowColor = "#28c840";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(comp.x + 20, comp.y + 20, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (comp.type === "motor") {
        // Motor body
        const cx = comp.x + comp.w / 2;
        const cy = comp.y + comp.h / 2 + 5;
        ctx.strokeStyle = isActive ? "#87ffbe" : "#555";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
        // Spinning indicator
        if (isActive) {
          const angle = animTime * 8;
          ctx.strokeStyle = "#87ffbe";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle + 2.09) * 15, cy + Math.sin(angle + 2.09) * 15);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle + 4.19) * 15, cy + Math.sin(angle + 4.19) * 15);
          ctx.stroke();
        }
        // Shaft
        ctx.fillStyle = "#888";
        ctx.fillRect(cx + 16, cy - 3, 12, 6);
      } else if (comp.type === "switch") {
        // Switch body
        const cy = comp.y + comp.h / 2;
        ctx.strokeStyle = comp.state ? "#ffd166" : "#555";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(comp.x + 15, cy, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(comp.x + comp.w - 15, cy, 5, 0, Math.PI * 2);
        ctx.stroke();
        // Lever
        ctx.strokeStyle = comp.state ? "#ffd166" : "#666";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(comp.x + 15, cy);
        if (comp.state) {
          ctx.lineTo(comp.x + comp.w - 15, cy);
        } else {
          ctx.lineTo(comp.x + comp.w / 2, cy - 12);
        }
        ctx.stroke();
      } else if (comp.type === "buzzer") {
        // Buzzer body
        const cx = comp.x + comp.w / 2;
        const cy = comp.y + comp.h / 2 - 3;
        ctx.fillStyle = isActive ? "#a98bff22" : "#111";
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isActive ? "#a98bff" : "#555";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Sound waves when active
        if (isActive) {
          for (let i = 1; i <= 3; i++) {
            const r = 20 + i * 6;
            const alpha = 0.3 - i * 0.08;
            ctx.strokeStyle = `rgba(169, 139, 255, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx + 18, cy, r, -0.5, 0.5);
            ctx.stroke();
          }
        }
      } else if (comp.type === "relay") {
        // Relay coil
        ctx.strokeStyle = isActive ? "#ff8462" : "#555";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(comp.x + 25, comp.y + 25, 8 + i * 4, -1, 1);
          ctx.stroke();
        }
        // Relay switch
        ctx.strokeStyle = isActive ? "#87ffbe" : "#555";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(comp.x + 55, comp.y + 25);
        if (isActive) {
          ctx.lineTo(comp.x + 70, comp.y + 20);
        } else {
          ctx.lineTo(comp.x + 65, comp.y + 12);
        }
        ctx.stroke();
      } else if (comp.type === "sensor") {
        // Sensor body detail
        ctx.fillStyle = "#58e1ff11";
        ctx.fillRect(comp.x + 5, comp.y + 5, comp.w - 10, comp.h - 10);
        // Sensor grid
        ctx.strokeStyle = "#58e1ff22";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(comp.x + 20 + i * 15, comp.y + 12);
          ctx.lineTo(comp.x + 20 + i * 15, comp.y + comp.h - 12);
          ctx.stroke();
        }
        // Value display
        if (isActive) {
          ctx.fillStyle = "#58e1ff";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          const temp = 25 + Math.sin(animTime * 2) * 3;
          ctx.fillText(`${temp.toFixed(1)}°C`, comp.x + comp.w / 2, comp.y + comp.h / 2 + 4);
        }
      }

      // Resistor color bands
      if (comp.type === "resistor") {
        const bandColors = ["#884400", "#ff4444", "#ff8800", "#ffd700"];
        bandColors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(comp.x + 12 + i * 13, comp.y + 4, 6, comp.h - 8);
        });
      }

      // Label
      ctx.fillStyle = isActive ? "#eee" : "#888";
      ctx.font = `${comp.type === "arduino" ? "bold " : ""}11px monospace`;
      ctx.textAlign = "center";
      const labelY = comp.type === "led" ? comp.y + comp.h + 14 : comp.y + comp.h / 2 + 4;
      if (comp.type !== "led") {
        ctx.fillText(comp.label, comp.x + comp.w / 2, comp.type === "battery" ? comp.y + comp.h / 2 + 4 : labelY);
      }

      // Draw pins
      comp.pins.forEach((pin) => {
        const px = comp.x + pin.x;
        const py = comp.y + pin.y;
        const pinColor = pin.type === "power" ? "#ff4444" :
                          pin.type === "ground" ? "#666" :
                          pin.type === "output" ? "#58e1ff" : "#ffd166";

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = wiringFrom === pin.id ? "#fff" : `${pinColor}44`;
        ctx.fill();
        ctx.strokeStyle = pinColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pin label on hover/select
        if (selectedComp === comp.id || wiringFrom) {
          ctx.fillStyle = pinColor;
          ctx.font = "9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(pin.label, px, py - 10);
        }
      });
    });

    // Watermark
    ctx.fillStyle = "rgba(88, 225, 255, 0.15)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText("Peach Circuit Simulator v1.0", W - 12, H - 10);
  }, [comps, wires, powered, selectedComp, wiringFrom, mousePos, animTime, getPinPos, isCircuitComplete]);

  // Render loop
  useEffect(() => { draw(); }, [draw]);

  // Canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;
    }
  }, [canvasSize]);

  // Mouse handlers
  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const findPinAt = (x: number, y: number): Pin | null => {
    for (const comp of comps) {
      for (const pin of comp.pins) {
        const px = comp.x + pin.x;
        const py = comp.y + pin.y;
        if (Math.hypot(x - px, y - py) < 12) return pin;
      }
    }
    return null;
  };

  const findCompAt = (x: number, y: number): Comp | null => {
    for (let i = comps.length - 1; i >= 0; i--) {
      const c = comps[i];
      if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return c;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    const pin = findPinAt(pos.x, pos.y);

    if (pin) {
      if (wiringFrom) {
        // Complete wire
        if (wiringFrom !== pin.id) {
          const newWire: Wire = {
            id: `w_${Date.now()}`,
            from: wiringFrom,
            to: pin.id,
            color: ["#58e1ff", "#ff8462", "#87ffbe", "#a98bff", "#ffd166"][wires.length % 5],
          };
          setWires(prev => [...prev, newWire]);
        }
        setWiringFrom(null);
      } else {
        setWiringFrom(pin.id);
      }
      return;
    }

    if (wiringFrom) {
      setWiringFrom(null);
      return;
    }

    const comp = findCompAt(pos.x, pos.y);
    if (comp) {
      if (comp.type === "switch") {
        setComps(prev => prev.map(c => c.id === comp.id ? { ...c, state: !c.state } : c));
        return;
      }
      setDraggingComp(comp.id);
      setDragOffset({ x: pos.x - comp.x, y: pos.y - comp.y });
      setSelectedComp(comp.id);
    } else {
      setSelectedComp(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    setMousePos(pos);
    if (draggingComp) {
      setComps(prev => prev.map(c =>
        c.id === draggingComp
          ? { ...c, x: Math.max(0, Math.min(canvasSize.w - c.w, pos.x - dragOffset.x)), y: Math.max(0, Math.min(canvasSize.h - c.h, pos.y - dragOffset.y)) }
          : c
      ));
    }
  };

  const handleMouseUp = () => setDraggingComp(null);

  // Add component from palette
  const addComponent = (type: string) => {
    const comp = makeComp(type, 100 + Math.random() * 200, 100 + Math.random() * 150);
    setComps(prev => [...prev, comp]);
    setSelectedComp(comp.id);
  };

  // Delete selected
  const deleteSelected = () => {
    if (!selectedComp) return;
    setComps(prev => prev.filter(c => c.id !== selectedComp));
    setWires(prev => prev.filter(w => {
      const comp = comps.find(c => c.id === selectedComp);
      if (!comp) return true;
      const pinIds = comp.pins.map(p => p.id);
      return !pinIds.includes(w.from) && !pinIds.includes(w.to);
    }));
    setSelectedComp(null);
  };

  // Load preset
  const loadPreset = (name: string) => {
    setPowered(false);
    setWiringFrom(null);
    setSelectedComp(null);
    const preset = buildPreset(name);
    setComps(preset.comps);
    setWires(preset.wires);
  };

  // Clear all
  const clearAll = () => {
    setComps([]);
    setWires([]);
    setPowered(false);
    setWiringFrom(null);
    setSelectedComp(null);
  };

  return (
    <section id="circuit-demo" className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="max-w-3xl">
        <p className="text-sm font-medium uppercase text-[#87ffbe]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">Circuit Simulator</h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">ลาก components จาก palette วางบนบอร์ด ต่อวงจร แล้วเปิดไฟดูวงจรทำงานจริง</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Palette */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {paletteItems.map((item) => (
              <button
                key={item.type}
                onClick={() => addComponent(item.type)}
                className="flex min-w-[80px] flex-col items-center gap-1 rounded-lg border border-white/10 bg-[#0b101a] px-3 py-2.5 text-xs text-zinc-300 transition hover:border-[#87ffbe]/40 hover:bg-[#0d1a14] hover:text-[#87ffbe] shrink-0"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Canvas */}
          <MobileCanvasWrapper className="flex-1 border border-white/10 bg-[#080c12]">
           <div ref={containerRef}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="block w-full cursor-crosshair"
              style={{ minWidth: 600 }}
            />
           </div>
          </MobileCanvasWrapper>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setPowered(!powered); if (!isCircuitComplete() && !powered) { /* warn */ } }}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              powered
                ? "bg-[#ff4444]/20 text-[#ff4444] border border-[#ff4444]/40 hover:bg-[#ff4444]/30"
                : "bg-[#87ffbe]/15 text-[#87ffbe] border border-[#87ffbe]/40 hover:bg-[#87ffbe]/25"
            }`}
          >
            {powered ? "⏻ ปิดวงจร" : "⏻ เปิดวงจร"}
          </button>

          <button onClick={deleteSelected} disabled={!selectedComp} className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed">
            ลบ Component
          </button>

          <button onClick={clearAll} className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.12]">
            ล้างทั้งหมด
          </button>

          <div className="mx-2 h-6 w-px bg-white/10" />

          <span className="text-xs text-zinc-500">Preset:</span>
          {["blink", "sensor", "relay"].map((p) => (
            <button key={p} onClick={() => loadPreset(p)} className="rounded-lg border border-[#58e1ff]/20 bg-[#58e1ff]/5 px-3 py-2 text-xs text-[#58e1ff] transition hover:bg-[#58e1ff]/15">
              {p === "blink" ? "💡 Blink" : p === "sensor" ? "🌡️ Sensor" : "📡 Relay"}
            </button>
          ))}

          {powered && isCircuitComplete() && (
            <span className="flex items-center gap-2 text-sm text-[#87ffbe] ml-auto">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#87ffbe]" />
              วงจรทำงาน — Current flowing
            </span>
          )}
          {powered && !isCircuitComplete() && (
            <span className="flex items-center gap-2 text-sm text-[#ffd166] ml-auto">
              ⚠ วงจรยังไม่สมบูรณ์ — ต่อสายให้ครบ
            </span>
          )}
        </div>

        {/* Wiring hint */}
        <AnimatePresence>
          {wiringFrom && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-lg border border-[#58e1ff]/30 bg-[#0b101a] px-4 py-2.5 text-sm text-[#58e1ff]">
              🔗 คลิก pin ที่ต้องการเชื่อมต่อ — หรือคลิกพื้นที่ว่างเพื่อยกเลิก
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info panel */}
        <AnimatePresence>
          {selectedComp && (
            <motion.div key={selectedComp} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-lg border border-[#58e1ff]/30 bg-[#0b101a] p-5">
              {(() => {
                const comp = comps.find(c => c.id === selectedComp);
                if (!comp) return null;
                return (
                  <div>
                    <p className="text-sm font-medium uppercase text-[#58e1ff]">{comp.label}</p>
                    <p className="mt-2 text-sm text-zinc-400">
                      {comp.type === "battery" && "แหล่งจ่ายไฟ 9V — จ่ายไฟให้ Arduino และ components ทั้งหมด"}
                      {comp.type === "arduino" && "ไมโครคอนโทรลเลอร์หลัก — รับ input จาก sensor ประมวลผล และสั่งงาน output ผ่าน Digital/Analog pins"}
                      {comp.type === "led" && "LED (Light Emitting Diode) — แสดงผลลัพธ์ ติดเมื่อมีกระแสไฟไหลผ่าน ต้องต่อกับ Resistor เพื่อจำกัดกระแส"}
                      {comp.type === "resistor" && "ตัวต้านทาน 220Ω — จำกัดกระแสไฟฟ้า ป้องกัน LED ไหม้ คำนวณจาก V = IR"}
                      {comp.type === "sensor" && "DHT22 — เซนเซอร์วัดอุณหภูมิและความชื้น ส่งข้อมูลผ่าน Digital Pin ใช้ protocol 1-Wire"}
                      {comp.type === "buzzer" && "Piezo Buzzer — สร้างเสียงเมื่อมีกระแสไฟไหลผ่าน ใช้ PWM signal จาก Arduino เพื่อควบคุมความถี่"}
                      {comp.type === "motor" && "DC Motor — มอเตอร์กระแสตรง หมุนเมื่อมีไฟเลี้ยง ใช้ Relay หรือ Motor Driver ควบคุมทิศทาง"}
                      {comp.type === "switch" && "สวิตช์ — คลิกเพื่อเปิด/ปิด ควบคุมการไหลของกระแสไฟ"}
                      {comp.type === "relay" && "โมดูลรีเลย์ — ใช้สัญญาณ 5V จาก Arduino ควบคุมอุปกรณ์แรงดันสูง เช่น มอเตอร์ หรือ หลอดไฟ"}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">Pins: {comp.pins.map(p => p.label).join(" · ")} · ลากเพื่อย้ายตำแหน่ง</p>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
