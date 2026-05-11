# HANDOFF.md — Peach Portfolio

> อัปเดตล่าสุด: 2026-05-11 15:21 GMT+8
> Agent: OpenClaw (main session)
> Commit: `d95b66e` — pushed to `master`

---

## 📋 สถานะปัจจุบัน

Portfolio ของ **PHOTSATHON KUMTAEW (Peach)** — AI Workflow Builder ที่ผสมผสาน AI, Electronics, และ Automation

**Tech Stack:**
- Next.js 15.5.18 + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Three.js + React Three Fiber (3D scene)
- Recharts (IoT charts)
- Lucide React (icons)

**Deploy:** Vercel — https://peach-portfolio.vercel.app/
**Repo:** https://github.com/photsathonspd1-create/peach-portfolio

---

## ✅ สิ่งที่เสร็จแล้ว

### 1. Circuit Simulator (`src/components/CircuitDemo.tsx`)
- ✅ Palette 9 components: Battery, Arduino, LED, Resistor, DHT22 Sensor, Buzzer, DC Motor, Switch, Relay
- ✅ ลาก component จาก palette วางบน canvas
- ✅ ลากย้ายตำแหน่ง component บนบอร์ด
- ✅ ต่อสาย: click pin → click pin อีกตัว = สร้าง wire (bezier curve)
- ✅ Switch: click เพื่อ toggle เปิด/ปิด
- ✅ เปิดไฟ: LED เรืองแสง + glow effect, Motor หมุน 3 แฉก, Buzzer มีคลื่นเสียง, Sensor แสดงค่า real-time
- ✅ Current flow animation: จุดไฟวิ่งตามสายเมื่อวงจรทำงาน
- ✅ Circuit completion detection: ตรวจว่าวงจรสมบูรณ์ (มี battery + Arduino + wires ครบ)
- ✅ 3 Presets: 💡 Blink, 🌡️ Sensor, 📡 Relay
- ✅ Delete selected component, Clear all
- ✅ Info panel แสดงรายละเอียด component ที่เลือก

### 2. AI Workflow Builder (`src/components/WorkflowDemo.tsx`)
- ✅ Palette 8 node types: Trigger, AI Model, Condition, Output, Delay, Code, Filter, Merge
- ✅ ลาก node จาก palette วางบน canvas
- ✅ ลากย้ายตำแหน่ง node
- ✅ ต่อสาย: click output port → click input port = เชื่อมต่อ (bezier curve + arrow)
- ✅ Node Inspector panel: click node → แสดง config fields ที่ editable (model, prompt, expression, etc.)
- ✅ Run Workflow: กด ▶ → data packets วิ่งตาม edges แบบ animated (BFS traversal)
- ✅ Canvas panning: คลิกพื้นว่างแล้วลากเพื่อเลื่อนมุมมอง
- ✅ 3 Presets: 📝 Content Pipeline, 🌡️ IoT Alert, 🤖 AI Agent
- ✅ Delete node (ลบ edges ที่เชื่อมต่อด้วย)
- ✅ Port type validation (trigger/data/condition/any)

### 3. IoT Sensor Dashboard (`src/components/IotDemo.tsx`)
- ✅ 6 Sensors: Temperature, Humidity, Light, CO₂, Soil Moisture, Motion
- ✅ Canvas sparkline charts จริง (ไม่ใช่ bar) — มี gradient fill, glow dot, warning/danger lines
- ✅ Real-time simulation: update ทุก 1.5 วินาที
- ✅ Status system: Normal / Warning / Danger ตาม threshold จริง
- ✅ Min/Avg/Max stats แต่ละ sensor
- ✅ 4 Relay Controls: Fan, Water Pump, Grow Light, Alarm
- ✅ Auto mode: relay เปิด/ปิดอัตโนมัติตาม sensor reading (เช่น temp > 32 → เปิดพัดลม)
- ✅ Manual toggle: click เพื่อเปิด/ปิด relay ด้วยมือ
- ✅ Alert simulation: กด "Simulate Alert" → แสดง alert banner
- ✅ Pause/Resume: ควบคุมการจำลอง
- ✅ Status bar: แสดง ESP32 connected, sensor count, active alerts, timestamp

### 4. ส่วนอื่นๆ ที่มีอยู่แล้ว (ไม่ได้แก้ไข)
- ✅ Hero section + 3D Scene (Three.js)
- ✅ Terminal Hero animation
- ✅ ACEX Demo (Plan→Do→Check→Act)
- ✅ Before/After section
- ✅ Skills Radar (Recharts)
- ✅ Tech Marquee
- ✅ Projects, Skills, Electronics, Experience, Education, Tools sections
- ✅ Contact section + Floating CTA
- ✅ Custom Cursor, Scroll Progress
- ✅ Footer

---

## 📁 โครงสร้างไฟล์

```
src/
├── app/
│   ├── globals.css          # Tailwind + custom animations
│   ├── layout.tsx           # Root layout (Geist font)
│   └── page.tsx             # Main page (~700 lines, contains all data + sections)
├── components/
│   ├── AcexDemo.tsx         # ACEX AI interactive demo
│   ├── BeforeAfter.tsx      # Before/After comparison
│   ├── CircuitDemo.tsx      # ⭐ อัปเกรดแล้ว — Full circuit simulator
│   ├── CustomCursor.tsx     # Custom cursor effect
│   ├── ErrorBoundary.tsx    # Error boundary for 3D
│   ├── FloatingCTA.tsx      # Floating contact button
│   ├── Footer.tsx           # Footer
│   ├── IotDemo.tsx          # ⭐ อัปเกรดแล้ว — Full IoT dashboard
│   ├── NowSection.tsx       # "What I'm doing now"
│   ├── Scene3D.tsx          # Three.js 3D background
│   ├── ScrollProgress.tsx   # Scroll progress bar
│   ├── SkillsRadar.tsx      # Radar chart
│   ├── TechMarquee.tsx      # Scrolling tech stack
│   ├── TerminalHero.tsx     # Terminal typing animation
│   └── WorkflowDemo.tsx     # ⭐ อัปเกรดแล้ว — Full workflow builder
```

---

## 🔧 สิ่งที่ควรทำต่อ (Optional Improvements)

### Priority สูง
1. **Mobile Nav Menu** — nav items 8 ตัวล้นหน้าจอมือถือ ต้องเพิ่ม hamburger menu
2. **Meta Tags / OG Image** — เพิ่ม `metadata` ใน `layout.tsx` สำหรับ SEO + social sharing
3. **Favicon** — ตรวจสอบ/เพิ่ม `icon.png` ใน `public/`

### Priority กลาง
4. **ย้าย data ออกจาก page.tsx** — `projects`, `skills`, `experience`, `tools`, `contactLinks` ควรย้ายไป `src/data/constants.ts`
5. **Canvas responsive** — CircuitDemo/WorkflowDemo ใช้ `minWidth: 600-700` บนมือถือจะ scroll แนวนอน ควรเพิ่ม zoom/pinch support
6. **`<html lang="th">`** — ใน layout.tsx ตั้ง `lang="th"` เพราะ content ส่วนใหญ่เป็นภาษาไทย
7. **Loading state** — 3D Scene โหลดช้า → ควรมี skeleton/shimmer

### Priority ต่ำ
8. **Accessibility** — skip-to-content link, aria labels สำหรับ interactive elements
9. **Performance** — `page.tsx` ใหญ่มาก (~700 lines) ควร split
10. **Error fallback** — ถ้า WebGL ไม่รองรับ 3D scene ไม่มี fallback UI
11. **Resume PDF** — ปุ่ม "Resume coming soon" ยัง disabled

---

## 🎯 Build Status

```
✓ Compiled successfully in 9.0s
✓ 0 warnings
✓ 0 errors
Route (app)                    Size      First Load JS
┌ ○ /                          169 kB    271 kB
└ ○ /_not-found                1 kB      103 kB
```

---

## 📝 Notes สำหรับ Agent ถัดไป

- ทุก component ใช้ `"use client"` (client-side rendering)
- Canvas-based components (Circuit, Workflow, IoT) ใช้ `requestAnimationFrame` สำหรับ animation
- Circuit Simulator: pin system ใช้ relative position จาก component origin (x, y)
- Workflow Builder: port position คำนวณจาก node position + port index + spacing
- IoT Dashboard: sensor data จำลองด้วย `generateValue()` — drift + noise algorithm
- สี accent หลัก: `#58e1ff` (cyan), `#ff8462` (orange), `#87ffbe` (green), `#a98bff` (purple), `#ffd166` (yellow)
- Dark theme: bg `#05070d`, card bg `#0b101a`, text `zinc-100` to `zinc-500`
