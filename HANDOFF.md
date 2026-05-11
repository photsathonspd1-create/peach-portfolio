# HANDOFF.md — Acex AI Portfolio

> สร้างเมื่อ: 2026-05-11 | อัปเดต: 2026-05-11 18:44 GMT+8

## 📌 สรุปโปรเจกต์

Portfolio ของ **PHOTSATHON KUMTAEW (Peach)** — AI Workflow Builder  
ชื่อแบรนด์: **Acex AI**  
URL: https://peach-portfolio.vercel.app  
Repo: https://github.com/photsathonspd1-create/peach-portfolio

---

## ✅ สิ่งที่เสร็จแล้ว (11 May 2026)

### Rebrand
- [x] เปลี่ยนชื่อจาก "Peach" → "Acex AI" (header, footer, metadata, terminal prompt)
- [x] อัปเดต OG/Twitter/structured data ทั้งหมด

### UX/UI Improvements
- [x] แก้ ViewerCounter + FloatingCTA ทับกัน (ย้าย viewer ไปซ้าย)
- [x] เพิ่ม dual-row TechMarquee (2 แถว วิ่งสลับทิศ + hover pause)
- [x] Hero title: gradient text (cyan→purple→coral) + font-bold + ใหญ่ขึ้น
- [x] 3D scene loading animation ดีขึ้น (ping + bouncing dots)
- [x] ErrorBoundary เพิ่มปุ่ม Retry
- [x] Custom scrollbar สี cyan
- [x] :focus-visible outline สำหรับ keyboard navigation
- [x] scroll-padding-top: 80px (เผื่อ fixed nav)

### Code Quality
- [x] ลบ unused MapPin import (แก้ build warning)
- [x] FloatingCTA email แก้ให้ตรงกับ constants
- [x] Footer เพิ่ม nav link (Experience)

### SEO
- [x] เพิ่ม keywords, robots meta
- [x] Structured data เต็มรูปแบบ (Person schema with address, knowsAbout, sameAs)

### Documentation
- [x] เขียน README.md ใหม่ (tech stack, features, sections, setup)

### Real-time Viewer Counter
- [x] สร้าง `RealtimeViewerCounter.tsx` ใช้ Supabase Realtime
- [x] สร้าง `src/lib/supabase.ts` — Supabase client
- [x] สร้าง `supabase-setup.sql` — SQL สำหรับสร้าง table + RLS + realtime
- [x] สร้าง `.env.local.example` — ตัวอย่าง env vars
- [x] Fallback กลับ localStorage ถ้าไม่ได้ตั้งค่า Supabase
- [x] ลบ fake jitter ที่สุ่ม +1 ทุก 8 วินาที

### Build
- [x] Build ผ่านไม่มี error (172 kB first load)
- [x] Push ขึ้น GitHub แล้ว

---

## 🏗️ สิ่งที่ต้องทำต่อ

### Supabase Setup (ต้องทำก่อน deploy)
1. ไปที่ https://supabase.com → Dashboard → Project
2. ไปที่ SQL Editor → วาง contents จาก `supabase-setup.sql` → Run
3. ไปที่ Project Settings → API → copy URL + anon key
4. ไปที่ Vercel Dashboard → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
5. Redeploy

### ถ้าอยากปรับปรุงต่อ
- [ ] เพิ่ม dark/light mode toggle
- [ ] เพิ่ม loading skeleton สำหรับ sections ที่อยู่ล่างๆ
- [ ] ปรับ mobile layout สำหรับ canvas demos (Circuit, Workflow)
- [ ] เพิ่ม project screenshots/links จริง
- [ ] เพิ่ม testimonial/recommendation section
- [ ] เพิ่ม blog/articles section
- [ ] Optimize images (ใช้ next/image มากขึ้น)
- [ ] เพิ่ม analytics (Vercel Analytics / Google Analytics)

---

## 📁 โครงสร้างไฟล์หลัก

```
src/
├── app/
│   ├── layout.tsx          — Root layout (metadata, fonts, structured data)
│   ├── page.tsx            — Main page (all sections)
│   └── globals.css         — Global styles, animations
├── components/
│   ├── AcexDemo.tsx        — ACEX AI interactive demo (Plan→Do→Check→Act)
│   ├── BeforeAfter.tsx     — Before/After impact comparison
│   ├── CircuitDemo.tsx     — Interactive circuit simulator
│   ├── CustomCursor.tsx    — Custom cursor with trail
│   ├── ErrorBoundary.tsx   — Error boundary with retry
│   ├── FloatingCTA.tsx     — Floating contact button (bottom-right)
│   ├── Footer.tsx          — Footer with nav links
│   ├── IotDemo.tsx         — IoT sensor dashboard simulation
│   ├── MobileCanvasWrapper.tsx — Canvas zoom/touch wrapper
│   ├── NowSection.tsx      — Current focus section
│   ├── RealtimeViewerCounter.tsx — Supabase real-time viewer counter
│   ├── Scene3D.tsx         — Three.js 3D scene (hero background)
│   ├── ScrollProgress.tsx  — Scroll progress bar
│   ├── SkillsRadar.tsx     — Recharts radar chart
│   ├── TechMarquee.tsx     — Dual-row tech stack marquee
│   ├── TerminalHero.tsx    — Terminal typing animation
│   ├── ViewerCounter.tsx   — Fallback localStorage counter
│   └── WorkflowDemo.tsx    — Visual workflow builder
├── data/
│   └── constants.ts        — All data (projects, skills, contact, etc.)
└── lib/
    └── supabase.ts         — Supabase client
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Static Export)
- **Styling:** Tailwind CSS 4
- **3D:** Three.js + React Three Fiber + Drei
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Realtime:** Supabase Realtime
- **Language:** TypeScript
- **Deploy:** Vercel

---

## 📊 Build Stats

```
Route (app)                    Size      First Load JS
┌ ○ /                          172 kB    274 kB
└ ○ /_not-found                1 kB      103 kB
+ First Load JS shared all     102 kB
```

---

## 🔐 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 📝 Notes

- `.env.local` ถูก gitignore แล้ว — ไม่ต้องกังวลเรื่อง leak credentials
- Supabase RLS เปิดอยู่ — ใครก็ insert/update/delete ได้ (เพราะเป็น public counter)
- ถ้าไม่ตั้งค่า Supabase → fallback ไปใช้ localStorage counter อัตโนมัติ
