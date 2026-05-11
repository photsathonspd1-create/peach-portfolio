"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface SensorConfig {
  id: string;
  name: string;
  thai: string;
  icon: string;
  unit: string;
  min: number;
  max: number;
  warning: number;
  danger: number;
  color: string;
  isBoolean?: boolean;
  decimals: number;
}

interface RelayState {
  id: string;
  name: string;
  thai: string;
  icon: string;
  on: boolean;
  autoMode: boolean;
  triggerSensor?: string;
  triggerAbove?: number;
  triggerBelow?: number;
}

/* ── Sensor configs ── */
const sensors: SensorConfig[] = [
  { id: "temp", name: "Temperature", thai: "อุณหภูมิ", icon: "🌡️", unit: "°C", min: 20, max: 45, warning: 32, danger: 38, color: "#ff4444", decimals: 1 },
  { id: "humidity", name: "Humidity", thai: "ความชื้น", icon: "💧", unit: "%", min: 20, max: 95, warning: 75, danger: 90, color: "#58e1ff", decimals: 1 },
  { id: "light", name: "Light", thai: "แสง", icon: "☀️", unit: "lux", min: 0, max: 1000, warning: 800, danger: 950, color: "#ffd166", decimals: 0 },
  { id: "co2", name: "CO₂", thai: "คาร์บอนไดออกไซด์", icon: "💨", unit: "ppm", min: 300, max: 2000, warning: 1000, danger: 1500, color: "#a98bff", decimals: 0 },
  { id: "soil", name: "Soil Moisture", thai: "ความชื้นดิน", icon: "🌱", unit: "%", min: 0, max: 100, warning: 30, danger: 15, color: "#87ffbe", decimals: 0 },
  { id: "motion", name: "Motion", thai: "ตรวจจับการเคลื่อนไหว", icon: "👁️", unit: "", min: 0, max: 1, warning: 0.5, danger: 1, color: "#ff8462", isBoolean: true, decimals: 0 },
];

const defaultRelays: RelayState[] = [
  { id: "fan", name: "Fan", thai: "พัดลม", icon: "🌀", on: false, autoMode: true, triggerSensor: "temp", triggerAbove: 32 },
  { id: "pump", name: "Water Pump", thai: "ปั๊มน้ำ", icon: "🚰", on: false, autoMode: true, triggerSensor: "soil", triggerBelow: 30 },
  { id: "light_r", name: "Grow Light", thai: "ไฟปลูก", icon: "💡", on: false, autoMode: true, triggerSensor: "light", triggerBelow: 200 },
  { id: "alarm", name: "Alarm", thai: "สัญญาณเตือน", icon: "🚨", on: false, autoMode: true, triggerSensor: "co2", triggerAbove: 1200 },
];

/* ── Simulated sensor data generation ── */
function generateValue(sensor: SensorConfig, prev: number, time: number): number {
  if (sensor.isBoolean) return Math.random() > 0.85 ? 1 : 0;
  // Realistic drift with noise
  const drift = Math.sin(time * 0.001 + sensors.indexOf(sensor)) * (sensor.max - sensor.min) * 0.15;
  const noise = (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.04;
  const mean = (sensor.min + sensor.max) / 2;
  const target = mean + drift;
  const newVal = prev + (target - prev) * 0.15 + noise;
  return Math.max(sensor.min, Math.min(sensor.max, newVal));
}

/* ── Sparkline Chart Component ── */
function SparklineChart({
  data,
  color,
  min,
  max,
  warning,
  danger,
  width,
  height,
  isBoolean,
}: {
  data: number[];
  color: string;
  min: number;
  max: number;
  warning: number;
  danger: number;
  width: number;
  height: number;
  isBoolean?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const W = width;
    const H = height;
    const pad = 4;

    ctx.clearRect(0, 0, W, H);

    if (data.length < 2) return;

    const range = max - min || 1;

    // Warning/danger zones
    if (!isBoolean) {
      const warnY = H - pad - ((warning - min) / range) * (H - pad * 2);
      const dangerY = H - pad - ((danger - min) / range) * (H - pad * 2);

      ctx.strokeStyle = `${danger}22`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pad, dangerY);
      ctx.lineTo(W - pad, dangerY);
      ctx.stroke();

      ctx.strokeStyle = `${warning}22`;
      ctx.beginPath();
      ctx.moveTo(pad, warnY);
      ctx.lineTo(W - pad, warnY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Chart area fill
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad + (i / (data.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Close area
    ctx.lineTo(W - pad, H - pad);
    ctx.lineTo(pad, H - pad);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `${color}25`);
    grad.addColorStop(1, `${color}02`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad + (i / (data.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Last point glow
    const lastVal = data[data.length - 1];
    const lastX = W - pad;
    const lastY = H - pad - ((lastVal - min) / range) * (H - pad * 2);

    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [data, color, min, max, warning, danger, width, height, isBoolean]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}

/* ── Main Component ── */
export default function IotDemo() {
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [current, setCurrent] = useState<Record<string, number>>({});
  const [relays, setRelays] = useState<RelayState[]>(defaultRelays);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alertActive, setAlertActive] = useState(false);
  const [pauseSim, setPauseSim] = useState(false);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize
  useEffect(() => {
    const initHistory: Record<string, number[]> = {};
    const initCurrent: Record<string, number> = {};
    sensors.forEach(s => {
      const vals: number[] = [];
      let v = (s.min + s.max) / 2;
      for (let i = 0; i < 30; i++) {
        v = generateValue(s, v, i * 1000);
        vals.push(v);
      }
      initHistory[s.id] = vals;
      initCurrent[s.id] = vals[vals.length - 1];
    });
    setHistory(initHistory);
    setCurrent(initCurrent);
  }, []);

  // Update loop
  useEffect(() => {
    if (pauseSim) return;
    const interval = setInterval(() => {
      setHistory(prev => {
        const next = { ...prev };
        const newCurrent: Record<string, number> = {};
        sensors.forEach(s => {
          const prevVal = (prev[s.id] || []).slice(-1)[0] || (s.min + s.max) / 2;
          const val = generateValue(s, prevVal, Date.now());
          next[s.id] = [...(prev[s.id] || []).slice(-49), val];
          newCurrent[s.id] = val;
        });
        setCurrent(newCurrent);
        return next;
      });
      setLastUpdate(new Date());

      // Auto-relay logic
      setRelays(prev => prev.map(r => {
        if (!r.autoMode || !r.triggerSensor) return r;
        const val = current[r.triggerSensor] ?? 0;
        if (r.triggerAbove !== undefined) {
          return { ...r, on: val > r.triggerAbove };
        }
        if (r.triggerBelow !== undefined) {
          return { ...r, on: val < r.triggerBelow };
        }
        return r;
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [pauseSim, current]);

  // Cleanup
  useEffect(() => {
    return () => { if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current); };
  }, []);

  // Get status
  const getStatus = (sensor: SensorConfig, value: number): "normal" | "warning" | "danger" => {
    if (sensor.isBoolean) return value > 0 ? "warning" : "normal";
    if (sensor.id === "soil") {
      if (value < sensor.danger) return "danger";
      if (value < sensor.warning) return "warning";
      return "normal";
    }
    if (value > sensor.danger) return "danger";
    if (value > sensor.warning) return "warning";
    return "normal";
  };

  const statusColors = { normal: "#87ffbe", warning: "#ffd166", danger: "#ff4444" };

  // Simulate alert
  const triggerAlert = () => {
    setAlertActive(true);
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => {
      setAlertActive(false);
    }, 5000);
  };

  // Toggle relay
  const toggleRelay = (id: string) => {
    setRelays(prev => prev.map(r => r.id === id ? { ...r, on: !r.on, autoMode: false } : r));
  };

  const toggleAuto = (id: string) => {
    setRelays(prev => prev.map(r => r.id === id ? { ...r, autoMode: !r.autoMode } : r));
  };

  // Stats
  const onlineSensors = sensors.filter(s => current[s.id] !== undefined).length;
  const activeAlerts = sensors.filter(s => {
    const v = current[s.id];
    return v !== undefined && getStatus(s, v) === "danger";
  }).length;

  return (
    <section id="iot-demo" className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="max-w-3xl">
        <p className="text-sm font-medium uppercase text-[#a98bff]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">IoT Sensor Dashboard</h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">จำลองระบบ monitoring จริง — ข้อมูล real-time จาก ESP32, auto-relay control, พร้อมกราฟและสถิติ</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10">
        {/* Top status bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0b101a] px-5 py-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-[#87ffbe]">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#87ffbe]" />
              ESP32 Connected
            </span>
            <span className="text-xs text-zinc-500">ชลบุรี, ประเทศไทย</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">
              📡 {onlineSensors}/{sensors.length} sensors
            </span>
            {activeAlerts > 0 && (
              <span className="flex items-center gap-1 text-xs text-[#ff4444]">
                ⚠️ {activeAlerts} alert{activeAlerts > 1 ? "s" : ""}
              </span>
            )}
            <span className="text-xs text-zinc-500">
              {lastUpdate.toLocaleTimeString("th-TH")}
            </span>
          </div>
        </div>

        {/* Alert banner */}
        <AnimatePresence>
          {alertActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-xl border border-[#ff4444]/50 bg-[#ff4444]/10 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="text-sm font-semibold text-[#ff4444]">High Temperature Alert!</p>
                  <p className="text-xs text-zinc-400">Temperature exceeded 38°C threshold — Fan activated automatically</p>
                </div>
                <button onClick={() => setAlertActive(false)} className="ml-auto text-xs text-zinc-500 hover:text-white">Dismiss</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sensor cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sensors.map(sensor => {
            const value = current[sensor.id] ?? 0;
            const data = history[sensor.id] || [];
            const status = getStatus(sensor, value);
            const sColor = statusColors[status];

            return (
              <motion.div
                key={sensor.id}
                layout
                className={`rounded-xl border p-5 transition-colors ${
                  status === "danger"
                    ? "border-[#ff4444]/40 bg-[#1a0a0a]"
                    : status === "warning"
                    ? "border-[#ffd166]/30 bg-[#1a1508]"
                    : "border-white/10 bg-[#0b101a]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{sensor.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{sensor.name}</p>
                      <p className="text-[10px] text-zinc-500">{sensor.thai}</p>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ color: sColor, backgroundColor: `${sColor}15`, border: `1px solid ${sColor}30` }}
                  >
                    {status === "normal" ? "● Normal" : status === "warning" ? "▲ Warning" : "● Danger"}
                  </span>
                </div>

                {/* Value */}
                <div className="mb-3">
                  <span className="text-3xl font-bold tabular-nums text-white" style={status === "danger" ? { color: "#ff4444" } : {}}>
                    {sensor.isBoolean ? (value > 0 ? "DETECTED" : "CLEAR") : value.toFixed(sensor.decimals)}
                  </span>
                  {!sensor.isBoolean && <span className="ml-1 text-sm text-zinc-500">{sensor.unit}</span>}
                </div>

                {/* Chart */}
                <div className="rounded-lg bg-[#05070d]/50 p-2">
                  <SparklineChart
                    data={data}
                    color={status === "danger" ? "#ff4444" : sensor.color}
                    min={sensor.min}
                    max={sensor.max}
                    warning={sensor.warning}
                    danger={sensor.danger}
                    width={260}
                    height={80}
                    isBoolean={sensor.isBoolean}
                  />
                </div>

                {/* Min/Max */}
                {!sensor.isBoolean && data.length > 0 && (
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-600">
                    <span>Min: {Math.min(...data).toFixed(sensor.decimals)}{sensor.unit}</span>
                    <span>Avg: {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(sensor.decimals)}{sensor.unit}</span>
                    <span>Max: {Math.max(...data).toFixed(sensor.decimals)}{sensor.unit}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Relay control */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">⚡ Relay Control</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relays.map(relay => (
              <div
                key={relay.id}
                className={`rounded-xl border p-4 transition-colors ${
                  relay.on
                    ? "border-[#87ffbe]/40 bg-[#0d1a14]"
                    : "border-white/10 bg-[#0b101a]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{relay.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{relay.name}</p>
                      <p className="text-[10px] text-zinc-500">{relay.thai}</p>
                    </div>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${relay.on ? "bg-[#87ffbe] shadow-[#87ffbe]/50 shadow-lg" : "bg-zinc-700"}`} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRelay(relay.id)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      relay.on
                        ? "bg-[#ff4444]/15 text-[#ff4444] border border-[#ff4444]/30 hover:bg-[#ff4444]/25"
                        : "bg-[#87ffbe]/15 text-[#87ffbe] border border-[#87ffbe]/30 hover:bg-[#87ffbe]/25"
                    }`}
                  >
                    {relay.on ? "Turn OFF" : "Turn ON"}
                  </button>
                  <button
                    onClick={() => toggleAuto(relay.id)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      relay.autoMode
                        ? "bg-[#a98bff]/15 text-[#a98bff] border border-[#a98bff]/30"
                        : "bg-white/[0.04] text-zinc-500 border border-white/10"
                    }`}
                    title={relay.autoMode ? "Auto mode ON — click to disable" : "Auto mode OFF — click to enable"}
                  >
                    AUTO
                  </button>
                </div>

                {relay.autoMode && relay.triggerSensor && (
                  <p className="mt-2 text-[10px] text-zinc-600">
                    {relay.triggerAbove !== undefined
                      ? `Auto ON when ${sensors.find(s => s.id === relay.triggerSensor)?.name} > ${relay.triggerAbove}`
                      : `Auto ON when ${sensors.find(s => s.id === relay.triggerSensor)?.name} < ${relay.triggerBelow}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={triggerAlert}
            disabled={alertActive}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              alertActive
                ? "cursor-not-allowed border border-[#ff4444]/40 bg-[#ff4444]/10 text-[#ff4444]"
                : "border border-[#ffd166]/40 bg-[#ffd166]/10 text-[#ffd166] hover:bg-[#ffd166]/20"
            }`}
          >
            {alertActive ? "🚨 Alert Active" : "🚨 Simulate Alert"}
          </button>

          <button
            onClick={() => setPauseSim(!pauseSim)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              pauseSim
                ? "border border-[#87ffbe]/40 bg-[#87ffbe]/10 text-[#87ffbe]"
                : "border border-white/15 bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12]"
            }`}
          >
            {pauseSim ? "▶ Resume" : "⏸ Pause"}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-[#87ffbe]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#87ffbe]" />
              Live
            </span>
            <span className="text-xs text-zinc-500">1.5s interval</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
