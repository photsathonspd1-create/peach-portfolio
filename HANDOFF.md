# 🍑 Peach Portfolio — Agent Handoff

> Last updated: 2026-05-11 14:45 GMT+8 by OpenClaw agent (Round 5 — 3 interactive demos)

---

## ⚡ Quick Status

| Item | Status |
|------|--------|
| Build | ✅ passes (`npm run build`) |
| Lint | ✅ passes |
| Git | ✅ pushed to `master` (Next.js 15.5.18 — CVE-2025-66478 fixed) |
| Deploy | ✅ live at https://peach-portfolio.vercel.app/ |

---

## 🔄 Workflow — วิธีทำงานต่อ

### ถ้าจะ Deploy:
```bash
cd /root/.openclaw/workspace/peach-portfolio
npm install
npx vercel login          # authenticate กับ Vercel
npx vercel --prod         # deploy production
# ได้ URL แล้ว → แก้ metadataBase ใน src/app/layout.tsx แล้ว push ใหม่
```

### ถ้าจะเพิ่ม Feature:
```bash
cd /root/.openclaw/workspace/peach-portfolio
npm install
npm run dev               # dev server ที่ localhost:3000
# แก้ไฟล์ → ทดสอบ → npm run build → git commit → git push
```

### ถ้าจะทำต่อจาก ROADMAP.md:
ดูหัวข้อ **"สิ่งที่ต้องทำต่อ"** ด้านล่าง — เรียงตามลำดับความสำคัญแล้ว

---

## 📁 File Structure

```
peach-portfolio/
├── public/
│   ├── logo.png               # ✅ NEW — รูป logo จริง (แทนตัว P)
│   ├── peach-hero-art.png     # Hero background (procedural)
│   ├── og.png                 # OG social card (1200×630)
│   ├── favicon.svg            # Custom SVG favicon
│   ├── favicon.ico            # Fallback ICO
│   ├── sitemap.xml            # ✅ NEW — SEO sitemap
│   └── robots.txt             # ✅ NEW — SEO robots
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 + custom keyframes (marquee, fadeInUp)
│   │   ├── layout.tsx         # Root layout + metadata + JSON-LD Person schema
│   │   └── page.tsx           # Main page — ALL sections + components
│   └── components/
│       ├── Scene3D.tsx        # Three.js 3D scene (client-only, ssr: false)
│       ├── NowSection.tsx     # "What I'm doing now" section
│       ├── Footer.tsx         # Site footer
│       ├── ErrorBoundary.tsx  # React error boundary for 3D
│       ├── TerminalHero.tsx   # Terminal typewriter animation
│       ├── AcexDemo.tsx       # ACEX AI interactive demo (Plan→Do→Check→Act)
│       ├── BeforeAfter.tsx    # Before/After impact + animated counters
│       ├── SkillsRadar.tsx    # Recharts radar chart
│       ├── FloatingCTA.tsx    # Floating contact button (bottom-right)
│       ├── CustomCursor.tsx   # Custom cursor effect (desktop only)
│       ├── ScrollProgress.tsx # ✅ NEW — scroll progress bar (top, cyan→peach)
│       ├── TechMarquee.tsx    # ✅ NEW — scrolling tech stack ticker
│       ├── CircuitDemo.tsx    # ✅ NEW — 2D circuit board simulation (Canvas)
│       ├── WorkflowDemo.tsx   # ✅ NEW — drag & connect workflow builder (Canvas)
│       └── IotDemo.tsx        # ✅ NEW — IoT sensor dashboard simulation
├── HANDOFF.md                 # ← THIS FILE
├── ROADMAP.md                 # Feature backlog
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## ✅ ทุกอย่างที่เสร็จแล้ว (3 Rounds)

### Round 1 — Base Portfolio
- Next.js 15.3.2 + React 19 + Tailwind v4 + TypeScript strict
- 3D Scene (Three.js): wireframe icosahedron, octahedron, torus, rings, particles
- 12 sections: Hero, Now, ACEX Demo, Projects, Before/After, Skills, Skills Radar, Electronics, Experience, Education, Tools, Contact
- Metadata: OG, Twitter Card, favicon, description (TH)
- Error boundary, loading skeleton, reduced-motion support
- All real personal content from resume

### Round 2 — Interactive Features
- Terminal Hero: typewriter animation 5 บรรทัด
- ACEX Demo: interactive Plan→Do→Check→Act workflow
- Before/After: animated counters (83%, 96%, 100%)
- Skills Radar: Recharts radar chart, animated on scroll
- Floating CTA: pulse animation, email + phone popup
- Custom Cursor: glowing dot + trail, hover expand

### Round 3 — Polish & SEO (ล่าสุด)
- **Scroll Progress Bar** (`ScrollProgress.tsx`): fixed top, z-50, cyan→peach gradient, 3px
- **Tech Stack Marquee** (`TechMarquee.tsx`): 16 tools, auto-scroll, pause on hover
- **Copy Email + Toast**: click email → clipboard → toast "คัดลอกแล้ว ✓" (mint, 2s)
- **Staggered Text Reveal**: SectionIntro headings แยกคำ, stagger 0.05s/คำ
- **Animated Counters**: มีอยู่แล้วใน BeforeAfter.tsx — ไม่ต้องแก้
- **SEO**: sitemap.xml, robots.txt, JSON-LD Person schema
- **Logo**: public/logo.png แทนตัว "P" ใน header
- **Hero h1**: ลดขนาดฟอนต์, แบ่ง 2 บรรทัด

---

## 🎨 Design Tokens (ห้ามเปลี่ยน)

| Token      | Hex       | Usage                |
|------------|-----------|----------------------|
| Background | `#05070d` | Main background      |
| Surface    | `#0b101a` | Cards, panels        |
| Cyan       | `#58e1ff` | Primary accent       |
| Peach      | `#ff8462` | Secondary accent     |
| Mint       | `#87ffbe` | Status, type tags    |
| Violet     | `#a98bff` | Tertiary accent      |

---

## 📋 สิ่งที่ต้องทำต่อ (เรียงตามลำดับ)

### 🔴 ต้องทำ (Must-Have)
1. **Deploy to Vercel** — `npx vercel login` → `npx vercel --prod` → อัปเดต `metadataBase` ใน layout.tsx
2. **Smooth scroll snap** — snap to each section on scroll
3. **Project detail modal** — คลิก project card → popup รายละเอียด (screenshots, tech stack breakdown)
4. **Resume PDF** — สร้างไฟล์ `public/resume.pdf`

### 🟡 ควรทำ (Should-Have)
5. **Magnetic buttons** — ปุ่มดูดเมาส์ตอน hover
6. **Cursor spotlight effect** — gradient glow follows mouse on hero
7. **Bento grid stats** — แสดง stats แบบ bento layout
8. **Animated background mesh** — gradient mesh ขยับเบาๆ ด้านหลัง

### 🟢 ถ้ามีเวลา (Nice-to-Have)
9. **Easter egg** — Konami code หรือ hidden interaction
10. **GitHub contribution graph** — embed activity
11. **Dark/Light mode toggle**
12. **PWA manifest** — installable on mobile

### 🔵 Technical Polish
13. **Lighthouse 90+** ทุก category
14. **Security headers** — CSP, X-Frame-Options (ใน next.config.ts)
15. **Image optimization** — WebP/AVIF, lazy loading
16. **Bundle analysis** — keep JS under 150kb

---

## 📝 Notes for Next Agent

- **3D scene** is client-only (`dynamic` import, `ssr: false`). Never SSR it.
- All animations check `prefers-reduced-motion` via `useReducedMotion()`.
- **Tailwind v4** uses CSS-first config (`@import "tailwindcss"` in globals.css) — no `tailwind.config.js`.
- **Framer Motion** variants (`container`, `item`) are at module scope in page.tsx — reuse for consistency.
- `Instagram` icon doesn't exist in `lucide-react` — used `Globe` instead.
- **All Thai text** is kept as-is (not translated).
- **Build size**: ~157 kB page, ~259 kB first load (including Three.js).
- Hero h1 ใช้ `text-3xl sm:text-4xl lg:text-5xl` (ไม่ใช่ clamp ใหญ่ๆ เหมือนเดิม)
- Logo อยู่ที่ `public/logo.png` ใช้ `<Image src="/logo.png" />` ใน header

---

## 📊 Build Status (Round 3 — 2026-05-11)

```
Route (app)                    Size      First Load JS
┌ ○ /                         157 kB    259 kB
└ ○ /_not-found               986 B     103 kB
+ First Load JS shared all    102 kB

✓ Compiled successfully
✓ Linting passed
✓ TypeScript passed
✓ Static pages generated (5/5)
```

---

## 🔧 Dev Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Turbopack) → localhost:3000
npm run build      # Production build ✅ passes
npm run lint       # ESLint ✅ passes
npx vercel --prod  # Deploy to Vercel (ต้อง login ก่อน)
```

---

## ✅ Bug Fixes (2026-05-11 — Round 4)

### BUG 1: Animated Counters Stuck at 0%
- **Root cause:** IntersectionObserver on individual `<span>` elements with threshold 0.5 — too small to trigger
- **Fix:** Moved observer to section-level `ref` with threshold 0.3; single animation drives all 3 counters
- **File:** `src/components/BeforeAfter.tsx` — rewrote with section ref + shared state

### BUG 2: Radar Chart Shows All Zeros
- **Root cause:** Similar observer issue; legend used `visible` state but values from `animatedData`
- **Fix:** Observer on section ref with threshold 0.3; legend reads `animatedData[i].value` directly
- **File:** `src/components/SkillsRadar.tsx` — removed unused `visible` state, cleaner animation

### BUG 3: Wrong Email Address
- **Root cause:** Code used `acex.peachwork@gmail.com` instead of `photsathon.spd1@gmail.com`
- **Fix:** Replaced all 7 instances across `page.tsx`, `FloatingCTA.tsx`, `layout.tsx`
- **Files:** `src/app/page.tsx`, `src/components/FloatingCTA.tsx`

### Build Status (Round 4)
```
✓ Compiled successfully
✓ Linting passed (0 warnings)
✓ TypeScript passed
✓ Static pages generated (5/5)
```

---

## ✅ Features Added (2026-05-11 — Round 5: Interactive Demos)

### Demo 1: Electronics Circuit Simulator (`src/components/CircuitDemo.tsx`)
- [x] HTML Canvas 700×320px, dark PCB-green background (#0a1a0a) with grid dots
- [x] 6 components: Battery, Arduino Uno, LED, Resistor, Relay, DHT22 Sensor
- [x] Wires: red (power), black (ground), yellow (signal)
- [x] Click any component → info panel with Thai description + use case
- [x] Toggle "เปิดวงจร / ปิดวงจร" button
- [x] When ON: LED glows (yellow shadow), current particles flow along wires
- [x] When OFF: all dark, particles stop
- [x] Responsive canvas (scrollable on mobile)

### Demo 2: AI Workflow Builder (`src/components/WorkflowDemo.tsx`)
- [x] HTML Canvas 700×380px, node-based visual workflow builder
- [x] 6 draggable nodes: Input, AI Process, Decision, Output A, Retry, Done
- [x] Each node: rounded rect 130×50px, colored border
- [x] Bezier curve edges with arrows connecting nodes
- [x] Drag any node → connections update dynamically
- [x] Click node → highlight + description panel below
- [x] "Reset Layout" button → returns to default positions
- [x] Touch events supported (touchAction: "none")
- [x] No external library — pure Canvas + React state

### Demo 3: IoT Sensor Dashboard (`src/components/IotDemo.tsx`)
- [x] 4 sensor cards (2×2 grid): Temperature, Humidity, Light, Motion
- [x] Live readings update every 2 seconds with random variation
- [x] Mini sparkline bar chart (last 10 readings)
- [x] Status badges: Normal / Warning / Alert (color-coded)
- [x] Top bar: "🟢 Connected — ESP32 Device · ชลบุรี" + timestamp
- [x] "Simulate Alert" button → pushes temp to 38°C for 3s → card turns red
- [x] Pulsing green dot on "Connected" status
- [x] Matches dark portfolio color scheme

### Integration in page.tsx
- [x] Placed after `<AcexDemo />`, before Projects section
- [x] Order: CircuitDemo → WorkflowDemo → IotDemo
- [x] Section IDs: circuit-demo, workflow-demo, iot-demo
- [x] Each has "Interactive Demo" label tag

### Build Status (Round 5)
```
Route (app)                    Size      First Load JS
┌ ○ /                         160 kB    263 kB
└ ○ /_not-found               1 kB      103 kB
+ First Load JS shared all    102 kB

✓ Compiled successfully
✓ Linting passed (0 warnings)
✓ TypeScript passed
✓ Static pages generated (5/5)
```

### Files Added (Round 5)
- **Added:** `src/components/CircuitDemo.tsx`
- **Added:** `src/components/WorkflowDemo.tsx`
- **Added:** `src/components/IotDemo.tsx`
- **Modified:** `src/app/page.tsx` (imports + 3 component placements)
- **Modified:** `HANDOFF.md` (this file)

---

## 📊 Section Order ใน page.tsx (ลำดับบนลงล่าง)

1. `<ScrollProgress />` — fixed top bar
2. `<Hero>` — terminal typewriter + h1 + floating cards
3. `<NowSection />` — what I'm doing now
4. `<AcexDemo />` — ACEX AI interactive demo
5. `<CircuitDemo />` — electronics circuit simulator ✅ NEW
6. `<WorkflowDemo />` — AI workflow drag & connect ✅ NEW
7. `<IotDemo />` — IoT sensor dashboard ✅ NEW
8. Projects section — 4 project cards
6. `<BeforeAfter />` — before/after impact + animated counters
7. Skills section — 6 interactive skill cards + sidebar
8. Electronics section — 5 hardware skills
9. `<SkillsRadar />` — radar chart
10. Experience section — 3 columns
11. Education section — GPAX, language, strengths
12. Tools section — 4 categories
13. `<TechMarquee />` — scrolling tech ticker
14. Contact section — email (copy to clipboard), phone, links + toast
15. `<Footer />`
16. `<FloatingCTA />` — fixed bottom-right
17. `<CustomCursor />` — global
