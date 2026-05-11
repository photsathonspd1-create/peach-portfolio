# HANDOFF.md — Peach Portfolio

> อัปเดตล่าสุด: 2026-05-11 17:24 GMT+8
> Agent: OpenClaw (main session)
> Commit: `01f20b0` — pushed to `master`

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

## 🔄 Workflow การทำงาน

```
User Request → Agent วิเคราะห์ → แก้ไขโค้ด → Build Test → Git Push → Vercel Auto Deploy
                                                                      ↓
                                                              Update HANDOFF.md
```

**ขั้นตอน:**
1. Clone/pull repo จาก GitHub
2. วิเคราะห์ request + อ่านโค้ดที่เกี่ยวข้อง
3. แก้ไข/เพิ่มโค้ดตาม requirement
4. `./node_modules/.bin/next build` เพื่อเช็ค build ผ่าน
5. `git add -A && git commit && git push`
6. อัพเดท HANDOFF.md ด้วยสิ่งที่ทำ + สิ่งที่ต้องทำต่อ

---

## ✅ สิ่งที่เสร็จแล้ว (ทั้งหมด)

### Session 2026-05-11 17:15 — 7 Items (by OpenClaw)

#### 1. Education ✅
- เปลี่ยนจาก `วิทยาลัยการอาชีพอมก๋อย / มหาวิทยาลัยทักษิณ` → **วิทยาลัยการอาชีพนวมินทราชินีมุกดาหาร**
- สาขาอิเล็กทรอนิกส์อุตสาหกรรม (ปวส.2)
- ลบ GPAX + ปีที่สำเร็จออก เปลี่ยนเป็น ระดับการศึกษา: ปวส.2

#### 2. Tech Stack ✅
- เพิ่ม 4 หมวดใหม่ให้ Tools & Technologies section:
  - **Frontend**: React, Next.js, TypeScript, Tailwind CSS, HTML5/CSS3, Framer Motion
  - **Backend**: Node.js, Express.js, Python, REST API, GraphQL, Prisma
  - **Database**: PostgreSQL, MongoDB, MySQL, Firebase, Supabase, Redis
  - **DevOps & Tools**: Git/GitHub, Docker, Vercel, Linux/Bash, CI/CD, AWS
- อัพเดท Languages: เพิ่ม TypeScript, SQL, เปลี่ยน JavaScript → TypeScript
- อัพเดท Productivity: เพิ่ม Figma, Postman

#### 3. Instagram → LINE ✅
- เปลี่ยนจาก Instagram `@peatz21` → **LINE: peatz21** (ไม่มี @)
- ลิงก์ไป `https://line.me/ti/p/~peatz21`
- เปลี่ยน icon จาก Globe → MessageCircle

#### 4. Email ✅
- เปลี่ยนจาก `photsathon.spd1@gmail.com` → **`acex.peachwork@gmail.com`**
- อัพเดททุกจุด: contactLinks, mailto link, EmailToast copy, layout.tsx JSON-LD

#### 5. Resume Section ✅
- เพิ่ม section `#resume` ระหว่าง TechMarquee กับ Contact
- รูปโปรไฟล์: `public/peach-resume.jpg` (จากภาพที่ user ส่งมา)
- Layout: ซ้าย (รูป + ข้อมูลติดต่อ), ขวา (Profile Summary, Education, Skills, Key Projects, Strengths)
- เปลี่ยนปุ่ม "Resume coming soon" → "ดูเรซูเม่" ที่ link ไป #resume
- เพิ่ม "resume" ใน nav items

#### 6. Logo Navbar + Favicon ✅
- ขยาย logo จาก 36px → **56px** + rounded-xl
- เพิ่ม text size เป็น text-lg
- เปลี่ยน favicon จาก `/favicon.svg` → `/logo.png` ใน layout.tsx metadata

#### 7. Realtime Viewer Counter ✅
- สร้าง component ใหม่: `src/components/ViewerCounter.tsx`
- แสดงจำนวนคนกำลังดูมุมขวาล่าง (fixed position)
- ใช้ localStorage + sessionStorage sync ระหว่าง tabs
- Auto-cleanup viewers ที่ inactive > 5 นาที
- Animation: fade-in หลัง 2 วินาที, จุดเขียวกระพริบ, ตัวเลขนับ animated
- Update ทุก 30 วินาที + listen storage events จาก tabs อื่น
- ลบ viewer เมื่อออกจากหน้า (beforeunload via useEffect cleanup)

### Session ก่อนหน้า (ไม่ได้แก้ไขในรอบนี้)
- ✅ Circuit Simulator — Full interactive circuit builder
- ✅ AI Workflow Builder — Drag & drop workflow editor
- ✅ IoT Sensor Dashboard — Real-time sensor simulation
- ✅ Hero + 3D Scene, Terminal Hero, ACEX Demo, Before/After
- ✅ Skills Radar, Tech Marquee, Floating CTA, Custom Cursor
- ✅ Scroll Progress, Footer

---

## 📁 โครงสร้างไฟล์

```
src/
├── app/
│   ├── globals.css          # Tailwind + custom animations
│   ├── layout.tsx           # Root layout (Geist font, metadata, JSON-LD)
│   └── page.tsx             # Main page (contains all data + sections)
├── components/
│   ├── AcexDemo.tsx         # ACEX AI interactive demo
│   ├── BeforeAfter.tsx      # Before/After comparison
│   ├── CircuitDemo.tsx      # Full circuit simulator
│   ├── CustomCursor.tsx     # Custom cursor effect
│   ├── ErrorBoundary.tsx    # Error boundary for 3D
│   ├── FloatingCTA.tsx      # Floating contact button
│   ├── Footer.tsx           # Footer
│   ├── IotDemo.tsx          # Full IoT dashboard
│   ├── NowSection.tsx       # "What I'm doing now"
│   ├── Scene3D.tsx          # Three.js 3D background
│   ├── ScrollProgress.tsx   # Scroll progress bar
│   ├── SkillsRadar.tsx      # Radar chart
│   ├── TechMarquee.tsx      # Scrolling tech stack
│   ├── TerminalHero.tsx     # Terminal typing animation
│   ├── ViewerCounter.tsx    # ⭐ NEW — Realtime viewer counter
│   └── WorkflowDemo.tsx     # Full workflow builder
public/
├── logo.png                 # Logo (ใช้เป็น favicon ด้วย)
├── peach-resume.jpg         # ⭐ NEW — รูปโปรไฟล์สำหรับ resume section
├── peach-hero-art.png       # Hero background art
├── og.png                   # Open Graph image
└── ...
```

---

## 🔧 สิ่งที่ควรทำต่อ (Optional Improvements)

### Priority สูง
1. **Mobile Nav Menu** — nav items 9 ตัวล้นหน้าจอมือถือ ต้องเพิ่ม hamburger menu (ตอนนี้ซ่อน nav บนมือถือด้วย `hidden sm:flex`)
2. **Resume PDF** — สร้าง PDF จริงจาก resume section + เพิ่มปุ่มดาวน์โหลด
3. **Viewer Counter Backend** — ตอนนี้ใช้ localStorage ซึ่ง sync เฉพาะ tabs บน browser เดียวกัน ถ้าอยากให้ cross-device จริง ต้องใช้ backend (Vercel KV, Upstash Redis, หรือ Firebase Realtime)

### Priority กลาง
4. **ย้าย data ออกจาก page.tsx** — `projects`, `skills`, `experience`, `tools`, `contactLinks` ควรย้ายไป `src/data/constants.ts`
5. **Canvas responsive** — CircuitDemo/WorkflowDemo ใช้ `minWidth: 600-700` บนมือถือจะ scroll แนวนอน ควรเพิ่ม zoom/pinch support
6. **`<html lang="th">`** — ใน layout.tsx ตั้ง `lang="th"` เพราะ content ส่วนใหญ่เป็นภาษาไทย
7. **Loading state** — 3D Scene โหลดช้า → ควรมี skeleton/shimmer

### Priority ต่ำ
8. **Accessibility** — skip-to-content link, aria labels สำหรับ interactive elements
9. **Performance** — `page.tsx` ใหญ่มาก ควร split data ออกไป
10. **Error fallback** — ถ้า WebGL ไม่รองรับ 3D scene ไม่มี fallback UI
11. **OG Image Update** — 生成新的 OG image ที่มีข้อมูลปัจจุบัน

---

## 🎯 Build Status

```
✓ Compiled successfully in 17.3s
✓ 0 warnings
✓ 0 errors
Route (app)                    Size      First Load JS
┌ ○ /                          170 kB    273 kB
└ ○ /_not-found                1 kB      103 kB
```

---

## 📝 Notes สำหรับ Agent ถัดไป

- ทุก component ใช้ `"use client"` (client-side rendering)
- Canvas-based components (Circuit, Workflow, IoT) ใช้ `requestAnimationFrame` สำหรับ animation
- Circuit Simulator: pin system ใช้ relative position จาก component origin (x, y)
- Workflow Builder: port position คำนวณจาก node position + port index + spacing
- IoT Dashboard: sensor data จำลองด้วย `generateValue()` — drift + noise algorithm
- ViewerCounter: ใช้ localStorage + sessionStorage, cleanup ทุก 5 นาที, update ทุก 30 วินาที
- สี accent หลัก: `#58e1ff` (cyan), `#ff8462` (orange), `#87ffbe` (green), `#a98bff` (purple), `#ffd166` (yellow)
- Dark theme: bg `#05070d`, card bg `#0b101a`, text `zinc-100` to `zinc-500`
- **ใช้ `./node_modules/.bin/next build`** ไม่ใช่ `npx next build` (npx จะดึง version ใหม่กว่า)
- **Email ปัจจุบัน**: `acex.peachwork@gmail.com` (ไม่ใช่ `photsathon.spd1@gmail.com`)
- **LINE**: peatz21 (ไม่มี @)
- **รูปโปรไฟล์**: `/peach-resume.jpg` (ไฟล์อยู่ใน public/)
