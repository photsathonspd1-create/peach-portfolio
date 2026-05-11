"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SensorConfig {
  id: string;
  name: string;
  thai: string;
  icon: string;
  unit: string;
  min: number;
  max: number;
  warningThreshold?: number;
  isBoolean?: boolean;
}

const sensors: SensorConfig[] = [
  { id: "temp", name: "Temperature", thai: "อุณหภูมิห้อง", icon: "🌡️", unit: "°C", min: 25, max: 35, warningThreshold: 32 },
  { id: "humidity", name: "Humidity", thai: "ความชื้นสัมพัทธ์", icon: "💧", unit: "%", min: 40, max: 80, warningThreshold: 75 },
  { id: "light", name: "Light", thai: "ความเข้มแสง", icon: "☀️", unit: "%", min: 0, max: 100 },
  { id: "motion", name: "Motion", thai: "ตรวจจับการเคลื่อนไหว", icon: "👁️", unit: "", min: 0, max: 1, isBoolean: true },
];

function generateReading(sensor: SensorConfig): number {
  if (sensor.isBoolean) return Math.random() > 0.7 ? 1 : 0;
  const range = sensor.max - sensor.min;
  return sensor.min + Math.random() * range;
}

function getStatus(sensor: SensorConfig, value: number): "Normal" | "Warning" | "Alert" {
  if (sensor.isBoolean) return value > 0 ? "Warning" : "Normal";
  if (sensor.warningThreshold && value > sensor.warningThreshold) {
    return value > (sensor.warningThreshold + (sensor.max - sensor.warningThreshold) * 0.5) ? "Alert" : "Warning";
  }
  return "Normal";
}

function getStatusColor(status: "Normal" | "Warning" | "Alert"): string {
  switch (status) {
    case "Normal": return "#87ffbe";
    case "Warning": return "#ffd166";
    case "Alert": return "#ff4444";
  }
}

export default function IotDemo() {
  const [readings, setReadings] = useState<Record<string, number[]>>({});
  const [currentValues, setCurrentValues] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alertMode, setAlertMode] = useState(false);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize readings
  useEffect(() => {
    const initial: Record<string, number[]> = {};
    const current: Record<string, number> = {};
    sensors.forEach((s) => {
      const vals = Array.from({ length: 10 }, () => generateReading(s));
      initial[s.id] = vals;
      current[s.id] = vals[vals.length - 1];
    });
    setReadings(initial);
    setCurrentValues(current);
  }, []);

  // Update readings every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings((prev) => {
        const next = { ...prev };
        const newCurrent: Record<string, number> = {};
        sensors.forEach((s) => {
          const val = alertMode && s.id === "temp" ? 38 : generateReading(s);
          const arr = [...(prev[s.id] || []).slice(-9), val];
          next[s.id] = arr;
          newCurrent[s.id] = val;
        });
        setCurrentValues(newCurrent);
        return next;
      });
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [alertMode]);

  // Cleanup alert timeout
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  const simulateAlert = () => {
    setAlertMode(true);
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlertMode(false), 3000);
  };

  return (
    <section
      id="iot-demo"
      className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65 }}
        className="max-w-3xl"
      >
        <p className="text-sm font-medium uppercase text-[#a98bff]">Interactive Demo</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          IoT Sensor Dashboard
        </h2>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          จำลองข้อมูล real-time จาก ESP32
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10"
      >
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0b101a] px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-[#87ffbe]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#87ffbe]" />
              Connected
            </span>
            <span className="text-sm text-zinc-500">— ESP32 Device · ชลบุรี</span>
          </div>
          <span className="text-xs text-zinc-500">
            Last update: {lastUpdate.toLocaleTimeString("th-TH")}
          </span>
        </div>

        {/* Sensor grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sensors.map((sensor) => {
            const value = currentValues[sensor.id] ?? 0;
            const history = readings[sensor.id] || Array(10).fill(0);
            const status = getStatus(sensor, value);
            const statusColor = getStatusColor(status);
            const maxVal = sensor.isBoolean ? 1 : sensor.max;

            return (
              <div
                key={sensor.id}
                className={`rounded-lg border p-5 transition-colors ${
                  status === "Alert"
                    ? "border-[#ff4444]/50 bg-[#1a0a0a]"
                    : "border-white/10 bg-[#0b101a]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sensor.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{sensor.name}</p>
                      <p className="text-xs text-zinc-500">{sensor.thai}</p>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      color: statusColor,
                      backgroundColor: `${statusColor}15`,
                      border: `1px solid ${statusColor}30`,
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* Value */}
                <div className="mt-4">
                  <p className="text-3xl font-semibold tabular-nums text-white">
                    {sensor.isBoolean
                      ? value > 0 ? "Detected" : "Clear"
                      : `${value.toFixed(1)}${sensor.unit}`}
                  </p>
                </div>

                {/* Sparkline */}
                <div className="mt-3 flex h-10 items-end gap-1">
                  {history.map((v, i) => {
                    const pct = maxVal > 0 ? (v / maxVal) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t transition-all duration-300"
                        style={{
                          height: `${Math.max(4, pct)}%`,
                          backgroundColor: i === history.length - 1 ? statusColor : `${statusColor}40`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulate Alert button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={simulateAlert}
            disabled={alertMode}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              alertMode
                ? "cursor-not-allowed border border-[#ff4444]/40 bg-[#ff4444]/10 text-[#ff4444]"
                : "border border-[#ffd166]/40 bg-[#ffd166]/10 text-[#ffd166] hover:bg-[#ffd166]/20"
            }`}
          >
            {alertMode ? "⚠️ Alert Active — 38°C" : "Simulate Alert"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
