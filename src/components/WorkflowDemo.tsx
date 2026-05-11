"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileCanvasWrapper from "@/components/MobileCanvasWrapper";

/* ── Types ── */
interface Port {
  id: string;
  label: string;
  type: "input" | "output";
  dataType: "trigger" | "data" | "condition" | "any";
}

interface WFNode {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon: string;
  color: string;
  ports: Port[];
  config: Record<string, string>;
}

interface Edge {
  id: string;
  from: string; // port id
  to: string;   // port id
}

interface DataPacket {
  edgeId: string;
  progress: number;
  color: string;
}

/* ── Node types ── */
const nodeTypes = [
  { type: "trigger", icon: "⚡", label: "Trigger", color: "#ffd166", desc: "Webhook / Schedule / Manual" },
  { type: "ai", icon: "🤖", label: "AI Model", color: "#58e1ff", desc: "GPT-4 / Claude / Gemini" },
  { type: "condition", icon: "🔀", label: "Condition", color: "#ff8462", desc: "If/Else branching" },
  { type: "output", icon: "📤", label: "Output", color: "#87ffbe", desc: "Notion / Sheets / Webhook" },
  { type: "delay", icon: "⏱️", label: "Delay", color: "#a98bff", desc: "Wait before next step" },
  { type: "code", icon: "💻", label: "Code", color: "#ff4444", desc: "Custom JS/Python" },
  { type: "filter", icon: "🔍", label: "Filter", color: "#ff8462", desc: "Filter data by condition" },
  { type: "merge", icon: "🔗", label: "Merge", color: "#58e1ff", desc: "Combine multiple inputs" },
];

const configFields: Record<string, { key: string; label: string; placeholder: string }[]> = {
  trigger: [{ key: "source", label: "Source", placeholder: "webhook / schedule / manual" }],
  ai: [
    { key: "model", label: "Model", placeholder: "gpt-4o / claude-3.5" },
    { key: "prompt", label: "Prompt", placeholder: "You are a helpful assistant..." },
  ],
  condition: [{ key: "expr", label: "Expression", placeholder: 'output.score > 0.8' }],
  output: [
    { key: "target", label: "Target", placeholder: "notion / sheets / webhook" },
    { key: "url", label: "URL/ID", placeholder: "https://..." },
  ],
  delay: [{ key: "seconds", label: "Seconds", placeholder: "5" }],
  code: [{ key: "lang", label: "Language", placeholder: "javascript / python" }, { key: "code", label: "Code", placeholder: "return data;" }],
  filter: [{ key: "field", label: "Field", placeholder: "data.status" }, { key: "op", label: "Operator", placeholder: "== / != / > / <" }, { key: "value", label: "Value", placeholder: "active" }],
  merge: [{ key: "strategy", label: "Strategy", placeholder: "concat / zip / merge" }],
};

let nodeCounter = 0;
function makeNode(type: string, x: number, y: number): WFNode {
  const def = nodeTypes.find(t => t.type === type)!;
  const id = `node_${nodeCounter++}`;
  const h = type === "ai" ? 140 : type === "code" ? 150 : 110;

  let ports: Port[] = [];
  switch (type) {
    case "trigger":
      ports = [{ id: `${id}_out`, label: "Out", type: "output", dataType: "trigger" }];
      break;
    case "ai":
      ports = [
        { id: `${id}_in`, label: "In", type: "input", dataType: "data" },
        { id: `${id}_out`, label: "Out", type: "output", dataType: "data" },
      ];
      break;
    case "condition":
      ports = [
        { id: `${id}_in`, label: "In", type: "input", dataType: "data" },
        { id: `${id}_true`, label: "True", type: "output", dataType: "data" },
        { id: `${id}_false`, label: "False", type: "output", dataType: "data" },
      ];
      break;
    case "output":
      ports = [{ id: `${id}_in`, label: "In", type: "input", dataType: "data" }];
      break;
    case "delay":
      ports = [
        { id: `${id}_in`, label: "In", type: "input", dataType: "any" },
        { id: `${id}_out`, label: "Out", type: "output", dataType: "any" },
      ];
      break;
    case "merge":
      ports = [
        { id: `${id}_in1`, label: "A", type: "input", dataType: "data" },
        { id: `${id}_in2`, label: "B", type: "input", dataType: "data" },
        { id: `${id}_out`, label: "Out", type: "output", dataType: "data" },
      ];
      break;
    default:
      ports = [
        { id: `${id}_in`, label: "In", type: "input", dataType: "any" },
        { id: `${id}_out`, label: "Out", type: "output", dataType: "any" },
      ];
  }

  return { id, type, x, y, w: 180, h, label: def.label, icon: def.icon, color: def.color, ports, config: {} };
}

/* ── Presets ── */
function buildPreset(name: string): { nodes: WFNode[]; edges: Edge[] } {
  nodeCounter = 0;
  const nodes: WFNode[] = [];
  const edges: Edge[] = [];

  if (name === "content") {
    const n1 = makeNode("trigger", 40, 140);
    n1.config = { source: "schedule — every 9:00 AM" };
    const n2 = makeNode("ai", 270, 120);
    n2.config = { model: "gpt-4o", prompt: "Generate a trending tech content idea..." };
    const n3 = makeNode("condition", 500, 130);
    n3.config = { expr: "output.quality_score > 0.8" };
    const n4 = makeNode("output", 730, 60);
    n4.config = { target: "Notion Database", url: "notion.so/..." };
    const n5 = makeNode("ai", 730, 220);
    n5.config = { model: "gpt-4o", prompt: "Improve this content draft..." };
    nodes.push(n1, n2, n3, n4, n5);
    edges.push(
      { id: "e1", from: n1.ports[0].id, to: n2.ports[0].id },
      { id: "e2", from: n2.ports[1].id, to: n3.ports[0].id },
      { id: "e3", from: n3.ports[1].id, to: n4.ports[0].id },
      { id: "e4", from: n3.ports[2].id, to: n5.ports[0].id },
      { id: "e5", from: n5.ports[1].id, to: n2.ports[0].id },
    );
  } else if (name === "iot") {
    const n1 = makeNode("trigger", 40, 130);
    n1.config = { source: "ESP32 Webhook — every 30s" };
    const n2 = makeNode("filter", 270, 120);
    n2.config = { field: "data.temperature", op: ">", value: "35" };
    const n3 = makeNode("ai", 490, 110);
    n3.config = { model: "gpt-4o-mini", prompt: "Analyze sensor data and suggest action..." };
    const n4 = makeNode("output", 720, 60);
    n4.config = { target: "LINE Notify", url: "notify-api.line.me/..." };
    const n5 = makeNode("output", 720, 200);
    n5.config = { target: "Google Sheets", url: "docs.google.com/..." };
    nodes.push(n1, n2, n3, n4, n5);
    edges.push(
      { id: "e1", from: n1.ports[0].id, to: n2.ports[0].id },
      { id: "e2", from: n2.ports[1].id, to: n3.ports[0].id },
      { id: "e3", from: n3.ports[1].id, to: n4.ports[0].id },
      { id: "e4", from: n3.ports[1].id, to: n5.ports[0].id },
    );
  } else if (name === "agent") {
    const n1 = makeNode("trigger", 40, 140);
    n1.config = { source: "User Chat Input" };
    const n2 = makeNode("ai", 270, 100);
    n2.config = { model: "claude-3.5-sonnet", prompt: "You are an autonomous agent. Plan the task..." };
    const n3 = makeNode("code", 500, 80);
    n3.config = { lang: "javascript", code: "executePlan(plan)" };
    const n4 = makeNode("condition", 730, 100);
    n4.config = { expr: "result.success === true" };
    const n5 = makeNode("output", 950, 40);
    n5.config = { target: "Slack / Email", url: "hooks.slack.com/..." };
    const n6 = makeNode("ai", 950, 190);
    n6.config = { model: "claude-3.5-sonnet", prompt: "Analyze error and retry with fix..." };
    nodes.push(n1, n2, n3, n4, n5, n6);
    edges.push(
      { id: "e1", from: n1.ports[0].id, to: n2.ports[0].id },
      { id: "e2", from: n2.ports[1].id, to: n3.ports[0].id },
      { id: "e3", from: n3.ports[1].id, to: n4.ports[0].id },
      { id: "e4", from: n4.ports[1].id, to: n5.ports[0].id },
      { id: "e5", from: n4.ports[2].id, to: n6.ports[0].id },
      { id: "e6", from: n6.ports[1].id, to: n2.ports[0].id },
    );
  }
  return { nodes, edges };
}

/* ── Main Component ── */
export default function WorkflowDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<WFNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [animTime, setAnimTime] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 450 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const runTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load preset
  useEffect(() => {
    const preset = buildPreset("content");
    setNodes(preset.nodes);
    setEdges(preset.edges);
  }, []);

  // Resize
  useEffect(() => {
    const resize = () => {
      const c = containerRef.current;
      if (!c) return;
      setCanvasSize({ w: c.clientWidth, h: 450 });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation
  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAnimTime(t => t + dt);
      setPackets(prev => prev.map(p => ({ ...p, progress: Math.min(1, p.progress + dt * 1.2) })).filter(p => p.progress < 1));
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => { if (runTimerRef.current) clearTimeout(runTimerRef.current); };
  }, []);

  // Get port world position
  const getPortPos = useCallback((portId: string): { x: number; y: number } | null => {
    for (const node of nodes) {
      for (const port of node.ports) {
        if (port.id === portId) {
          const px = port.type === "input" ? node.x - 6 : node.x + node.w + 6;
          const portIdx = node.ports.filter(p => p.type === port.type).indexOf(port);
          const totalPorts = node.ports.filter(p => p.type === port.type).length;
          const spacing = (node.h - 30) / (totalPorts + 1);
          const py = node.y + 25 + spacing * (portIdx + 1);
          return { x: px, y: py };
        }
      }
    }
    return null;
  }, [nodes]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    ctx.translate(viewOffset.x, viewOffset.y);

    // Background
    ctx.fillStyle = "#080c12";
    ctx.fillRect(-viewOffset.x, -viewOffset.y, W, H);

    // Grid
    ctx.strokeStyle = "rgba(88, 225, 255, 0.04)";
    ctx.lineWidth = 1;
    const gridSize = 30;
    const startX = Math.floor(-viewOffset.x / gridSize) * gridSize;
    const startY = Math.floor(-viewOffset.y / gridSize) * gridSize;
    for (let gx = startX; gx < W - viewOffset.x; gx += gridSize) {
      for (let gy = startY; gy < H - viewOffset.y; gy += gridSize) {
        ctx.fillStyle = "rgba(88, 225, 255, 0.06)";
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw edges
    edges.forEach((edge) => {
      const from = getPortPos(edge.from);
      const to = getPortPos(edge.to);
      if (!from || !to) return;

      const dx = Math.abs(to.x - from.x) * 0.5;
      const cp1x = from.x + dx;
      const cp1y = from.y;
      const cp2x = to.x - dx;
      const cp2y = to.y;

      // Edge glow when running
      if (running) {
        ctx.strokeStyle = "rgba(88, 225, 255, 0.15)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
        ctx.stroke();
      }

      ctx.strokeStyle = running ? "rgba(88, 225, 255, 0.7)" : "rgba(88, 225, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
      ctx.stroke();

      // Arrow
      const t = 0.95;
      const u = 1 - t;
      const ax = u * u * u * from.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * to.x;
      const ay = u * u * u * from.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * to.y;
      const angle = Math.atan2(to.y - ay, to.x - ax);
      ctx.fillStyle = running ? "#58e1ff" : "rgba(88, 225, 255, 0.5)";
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - 8 * Math.cos(angle - 0.4), to.y - 8 * Math.sin(angle - 0.4));
      ctx.lineTo(to.x - 8 * Math.cos(angle + 0.4), to.y - 8 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();

      // Animated packets
      packets.filter(p => p.edgeId === edge.id).forEach(packet => {
        const pt = packet.progress;
        const pu = 1 - pt;
        const px = pu * pu * pu * from.x + 3 * pu * pu * pt * cp1x + 3 * pu * pt * pt * cp2x + pt * pt * pt * to.x;
        const py = pu * pu * pu * from.y + 3 * pu * pu * pt * cp1y + 3 * pu * pt * pt * cp2y + pt * pt * pt * to.y;

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });

    // Connection preview
    if (connectingFrom) {
      const from = getPortPos(connectingFrom);
      if (from) {
        ctx.strokeStyle = "rgba(88, 225, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        const dx = Math.abs(mousePos.x - from.x) * 0.4;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.bezierCurveTo(from.x + dx, from.y, mousePos.x - dx, mousePos.y, mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      const isSelected = selectedNode === node.id;
      const r = 10;

      // Shadow
      ctx.shadowColor = isSelected ? node.color : "rgba(0,0,0,0.3)";
      ctx.shadowBlur = isSelected ? 15 : 8;
      ctx.shadowOffsetY = 4;

      // Body
      ctx.fillStyle = "#111827";
      ctx.strokeStyle = isSelected ? node.color : `${node.color}55`;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
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
      ctx.shadowOffsetY = 0;

      // Header bar
      ctx.fillStyle = `${node.color}20`;
      ctx.beginPath();
      ctx.moveTo(node.x + r, node.y);
      ctx.lineTo(node.x + node.w - r, node.y);
      ctx.quadraticCurveTo(node.x + node.w, node.y, node.x + node.w, node.y + r);
      ctx.lineTo(node.x + node.w, node.y + 32);
      ctx.lineTo(node.x, node.y + 32);
      ctx.lineTo(node.x, node.y + r);
      ctx.quadraticCurveTo(node.x, node.y, node.x + r, node.y);
      ctx.closePath();
      ctx.fill();

      // Header line
      ctx.strokeStyle = `${node.color}30`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y + 32);
      ctx.lineTo(node.x + node.w, node.y + 32);
      ctx.stroke();

      // Icon + Label
      ctx.font = "16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(node.icon, node.x + 10, node.y + 23);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(node.label, node.x + 32, node.y + 22);

      // Config preview
      const configKeys = Object.keys(node.config);
      if (configKeys.length > 0) {
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        configKeys.slice(0, 2).forEach((key, i) => {
          const val = node.config[key];
          const display = val.length > 25 ? val.slice(0, 25) + "…" : val;
          ctx.fillText(`${key}: ${display}`, node.x + 10, node.y + 50 + i * 16);
        });
      }

      // Ports
      node.ports.forEach((port) => {
        const isInput = port.type === "input";
        const px = isInput ? node.x - 6 : node.x + node.w + 6;
        const sameTypePorts = node.ports.filter(p => p.type === port.type);
        const idx = sameTypePorts.indexOf(port);
        const spacing = (node.h - 30) / (sameTypePorts.length + 1);
        const py = node.y + 25 + spacing * (idx + 1);

        // Port circle
        const portColor = port.type === "input" ? "#58e1ff" : "#87ffbe";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = connectingFrom === port.id ? "#fff" : `${portColor}33`;
        ctx.fill();
        ctx.strokeStyle = portColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = portColor;
        ctx.fill();

        // Port label
        ctx.fillStyle = "#666";
        ctx.font = "9px monospace";
        ctx.textAlign = isInput ? "right" : "left";
        ctx.fillText(port.label, isInput ? px - 10 : px + 10, py + 3);
      });

      // Running indicator
      if (running) {
        const pulse = Math.sin(animTime * 4) * 0.3 + 0.7;
        ctx.strokeStyle = `${node.color}${Math.floor(pulse * 99).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.strokeRect(node.x - 2, node.y - 2, node.w + 4, node.h + 4);
      }
    });

    ctx.restore();
  }, [nodes, edges, selectedNode, connectingFrom, mousePos, running, packets, animTime, viewOffset, getPortPos]);

  // Render
  useEffect(() => { draw(); }, [draw]);

  // Canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) { canvas.width = canvasSize.w; canvas.height = canvasSize.h; }
  }, [canvasSize]);

  // Mouse helpers
  const getCanvasPos = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width) - viewOffset.x,
      y: (e.clientY - rect.top) * (canvas.height / rect.height) - viewOffset.y,
    };
  };

  const findPortAt = (x: number, y: number): Port | null => {
    for (const node of nodes) {
      for (const port of node.ports) {
        const px = port.type === "input" ? node.x - 6 : node.x + node.w + 6;
        const sameType = node.ports.filter(p => p.type === port.type);
        const idx = sameType.indexOf(port);
        const spacing = (node.h - 30) / (sameType.length + 1);
        const py = node.y + 25 + spacing * (idx + 1);
        if (Math.hypot(x - px, y - py) < 14) return port;
      }
    }
    return null;
  };

  const findNodeAt = (x: number, y: number): WFNode | null => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h) return n;
    }
    return null;
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    const port = findPortAt(pos.x, pos.y);

    if (port) {
      if (port.type === "output") {
        setConnectingFrom(port.id);
      } else if (connectingFrom) {
        // Check compatible types
        const fromPort = nodes.flatMap(n => n.ports).find(p => p.id === connectingFrom);
        if (fromPort && (fromPort.dataType === "any" || port.dataType === "any" || fromPort.dataType === port.dataType)) {
          if (!edges.some(e => e.to === port.id)) {
            setEdges(prev => [...prev, { id: `e_${Date.now()}`, from: connectingFrom, to: port.id }]);
          }
        }
        setConnectingFrom(null);
      }
      return;
    }

    if (connectingFrom) { setConnectingFrom(null); return; }

    const node = findNodeAt(pos.x, pos.y);
    if (node) {
      setDraggingNode(node.id);
      setDragOffset({ x: pos.x - node.x, y: pos.y - node.y });
      setSelectedNode(node.id);
    } else {
      setSelectedNode(null);
      // Start panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    setMousePos(pos);
    if (draggingNode) {
      setNodes(prev => prev.map(n =>
        n.id === draggingNode
          ? { ...n, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
          : n
      ));
    } else if (isPanning) {
      setViewOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  // Add node from palette
  const addNode = (type: string) => {
    const node = makeNode(type, 80 + Math.random() * 300 - viewOffset.x, 80 + Math.random() * 200 - viewOffset.y);
    setNodes(prev => [...prev, node]);
    setSelectedNode(node.id);
  };

  // Delete selected
  const deleteSelected = () => {
    if (!selectedNode) return;
    const node = nodes.find(n => n.id === selectedNode);
    if (!node) return;
    const portIds = node.ports.map(p => p.id);
    setEdges(prev => prev.filter(e => !portIds.includes(e.from) && !portIds.includes(e.to)));
    setNodes(prev => prev.filter(n => n.id !== selectedNode));
    setSelectedNode(null);
  };

  // Update config
  const updateConfig = (key: string, value: string) => {
    if (!selectedNode) return;
    setNodes(prev => prev.map(n => n.id === selectedNode ? { ...n, config: { ...n.config, [key]: value } } : n));
  };

  // Run workflow
  const runWorkflow = () => {
    if (running) return;
    setRunning(true);
    setPackets([]);

    // Create packets along edges in sequence
    const edgeOrder: string[] = [];
    const visited = new Set<string>();

    // BFS from trigger nodes
    const triggers = nodes.filter(n => n.type === "trigger");
    const queue = triggers.map(t => t.id);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const outEdges = edges.filter(e => {
        const fromNode = nodes.find(n => n.ports.some(p => p.id === e.from));
        return fromNode?.id === nodeId;
      });

      outEdges.forEach((edge, i) => {
        setTimeout(() => {
          setPackets(prev => [...prev, { edgeId: edge.id, progress: 0, color: "#58e1ff" }]);
        }, edgeOrder.length * 600 + i * 200);
        edgeOrder.push(edge.id);

        const toNode = nodes.find(n => n.ports.some(p => p.id === edge.to));
        if (toNode && !visited.has(toNode.id)) queue.push(toNode.id);
      });
    }

    runTimerRef.current = setTimeout(() => setRunning(false), edgeOrder.length * 600 + 2000);
  };

  // Load preset
  const loadPreset = (name: string) => {
    setRunning(false);
    setPackets([]);
    setConnectingFrom(null);
    setSelectedNode(null);
    setViewOffset({ x: 0, y: 0 });
    const preset = buildPreset(name);
    setNodes(preset.nodes);
    setEdges(preset.edges);
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setRunning(false);
    setPackets([]);
    setConnectingFrom(null);
    setSelectedNode(null);
  };

  return (
    <section id="workflow-demo" className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="max-w-3xl">
        <p className="text-sm font-medium uppercase text-[#58e1ff]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">AI Workflow Builder</h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">สร้าง AI workflow ของคุณ — ลาก nodes จาก palette, ต่อสาย, แล้วกด Run ดูข้อมูลไหลผ่านแต่ละ node</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Palette */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-2 lg:w-[140px] shrink-0">
            {nodeTypes.map((nt) => (
              <button
                key={nt.type}
                onClick={() => addNode(nt.type)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b101a] px-3 py-2 text-xs text-zinc-300 transition hover:border-white/25 hover:bg-[#111827] hover:text-white"
                title={nt.desc}
              >
                <span className="text-base">{nt.icon}</span>
                <span className="hidden sm:inline">{nt.label}</span>
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
              style={{ minHeight: 400 }}
            />
           </div>
          </MobileCanvasWrapper>

          {/* Inspector */}
          <AnimatePresence>
            {selectedNode && (() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              const fields = configFields[node.type] || [];
              return (
                <motion.div key={selectedNode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="lg:w-[240px] shrink-0 rounded-xl border border-white/10 bg-[#0b101a] p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{node.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{node.label}</p>
                      <p className="text-xs text-zinc-500">ID: {node.id}</p>
                    </div>
                  </div>

                  {fields.length > 0 && (
                    <div className="space-y-3">
                      {fields.map(field => (
                        <div key={field.key}>
                          <label className="text-xs text-zinc-400 mb-1 block">{field.label}</label>
                          {field.key === "prompt" || field.key === "code" ? (
                            <textarea
                              value={node.config[field.key] || ""}
                              onChange={(e) => updateConfig(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full rounded-lg border border-white/10 bg-[#05070d] px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#58e1ff]/50 resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={node.config[field.key] || ""}
                              onChange={(e) => updateConfig(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full rounded-lg border border-white/10 bg-[#05070d] px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#58e1ff]/50"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={deleteSelected} className="mt-4 w-full rounded-lg border border-[#ff4444]/30 bg-[#ff4444]/10 px-3 py-2 text-xs text-[#ff4444] transition hover:bg-[#ff4444]/20">
                    ลบ Node
                  </button>

                  <div className="mt-3 text-[10px] text-zinc-600">
                    Ports: {node.ports.map(p => `${p.label}(${p.type})`).join(" · ")}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={runWorkflow}
            disabled={running || nodes.length === 0}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              running
                ? "bg-[#58e1ff]/20 text-[#58e1ff] border border-[#58e1ff]/40 cursor-wait"
                : "bg-[#58e1ff] text-[#031018] hover:bg-[#87ffbe] disabled:opacity-30 disabled:cursor-not-allowed"
            }`}
          >
            {running ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#58e1ff] border-t-transparent" />
                Running...
              </>
            ) : (
              <>▶ Run Workflow</>
            )}
          </button>

          <button onClick={() => { setNodes(prev => prev.map(n => ({ ...n, config: { ...n.config } }))); }} className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.12]">
            Clear Config
          </button>
          <button onClick={clearAll} className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.12]">
            ล้างทั้งหมด
          </button>

          <div className="mx-2 h-6 w-px bg-white/10" />

          <span className="text-xs text-zinc-500">Preset:</span>
          {[
            { key: "content", label: "📝 Content Pipeline" },
            { key: "iot", label: "🌡️ IoT Alert" },
            { key: "agent", label: "🤖 AI Agent" },
          ].map(p => (
            <button key={p.key} onClick={() => loadPreset(p.key)} className="rounded-lg border border-[#58e1ff]/20 bg-[#58e1ff]/5 px-3 py-2 text-xs text-[#58e1ff] transition hover:bg-[#58e1ff]/15">
              {p.label}
            </button>
          ))}

          {running && (
            <span className="flex items-center gap-2 text-sm text-[#58e1ff] ml-auto">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#58e1ff]" />
              Data flowing...
            </span>
          )}
        </div>

        {/* Connection hint */}
        <AnimatePresence>
          {connectingFrom && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-lg border border-[#87ffbe]/30 bg-[#0b101a] px-4 py-2.5 text-sm text-[#87ffbe]">
              🔗 คลิก input port ของ node ที่ต้องการเชื่อมต่อ — หรือคลิกพื้นที่ว่างเพื่อยกเลิก
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
