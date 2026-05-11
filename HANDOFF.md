# 🍑 Peach Portfolio — Agent Handoff

> Last updated: 2026-05-11 by OpenClaw agent

## Project Overview

Personal portfolio for **Peach (พสธร คุ้มแถว / Photsathon Kumtaew)**.
Dark-themed single-page site with 3D elements, motion design, interactive skills, and real professional content.

**Stack:** Next.js 15.3.2 · React 19 · Tailwind CSS v4 · Framer Motion · Three.js (@react-three/fiber + @react-three/drei) · Lucide Icons

**Repo:** https://github.com/photsathonspd1-create/peach-portfolio

---

## 📁 File Structure

```
peach-portfolio/
├── public/
│   ├── peach-hero-art.png       # Procedural hero background
│   ├── og.png                   # OG social card (1200×630)
│   ├── favicon.svg              # Custom SVG favicon
│   └── favicon.ico              # Fallback ICO
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind v4 + custom styles
│   │   ├── layout.tsx           # Root layout + metadata (lang="en")
│   │   └── page.tsx             # Main page — all sections
│   └── components/
│       ├── Scene3D.tsx          # Three.js 3D scene (client-only)
│       ├── NowSection.tsx       # "What I'm doing now" section
│       ├── Footer.tsx           # Site footer
│       └── ErrorBoundary.tsx    # React error boundary for 3D
├── scripts/
│   └── generate-hero-art.mjs   # Procedural PNG generator
├── HANDOFF.md                   # ← THIS FILE
├── ROADMAP.md                   # Feature backlog
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## ✅ All Completed Work

### Infrastructure & Config
- [x] Next.js 15.3.2 + React 19 + Tailwind v4 + TypeScript strict
- [x] Production build passes (`npm run build`)
- [x] ESLint works with FlatCompat bridge (`@eslint/eslintrc`)
- [x] Dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`
- [x] `lang="en"` (was "th" — content is mostly English)
- [x] Error boundary wrapping Scene3D (`src/components/ErrorBoundary.tsx`)

### Metadata & SEO (`src/app/layout.tsx`)
- [x] Title: "Peach | AI Workflow Builder — PHOTSATHON KUMTAEW"
- [x] Description in Thai (AI Workflow Builder context)
- [x] Open Graph metadata (title, description, image, locale, siteName)
- [x] Twitter Card (`summary_large_image`) with dedicated OG image
- [x] Custom favicon (SVG + ICO fallback)
- [x] `metadataBase` → `https://peach-portfolio.vercel.app`
- [x] Dedicated OG image (`public/og.png`, 1200×630)

### 3D Scene (`src/components/Scene3D.tsx`)
- [x] Floating wireframe icosahedron (cyan) with MeshDistortMaterial + Trail
- [x] Floating wireframe octahedron (peach) with MeshWobbleMaterial
- [x] Floating wireframe torus (mint)
- [x] Ring system — 3 orbiting torus rings (cyan, peach, violet)
- [x] Particle field (80 points) + Stars background
- [x] Dynamic import with `ssr: false` + loading skeleton
- [x] 3 colored point lights (cyan, peach, mint)
- [x] ErrorBoundary fallback if 3D crashes

### Hero Section (`src/app/page.tsx`)
- [x] Real name: PHOTSATHON KUMTAEW
- [x] Title badge: "AI Workflow Builder"
- [x] H1: "AI Automation · Content Systems · Electronics"
- [x] Thai description about AI Workflow + Electronics expertise
- [x] Floating identity cards (Identity, Handle, Location — ชลบุรี)
- [x] Buttons: "ดูโปรเจกต์" + "ติดต่อ"
- [x] Loading skeleton for 3D scene

### Now Section (`src/components/NowSection.tsx`)
- [x] 4 cards: Building (ACEX AI), Focus (AI Agent/n8n/Make), Learning (LangChain/IoT), Open to (Freelance)
- [x] Animated pulsing "Currently active" status badge
- [x] Floating glow effect on each card

### Projects Section
- [x] **ACEX AI** (main project) — Autonomous Workflow System, Plan→Do→Check→Act loop, features list, impact metrics
- [x] **AI Content Automation** — Content production pipeline
- [x] **System & Automation** — Internal ops, CLI tools
- [x] **Hardware + Software Integration** — Arduino/ESP32/IoT
- [x] All cards: hover animations, gradient accent bars, stack tags

### Skills Section (Interactive)
- [x] 6 core skills: AI Workflow, AI Integration, Prompt Engineering, Automation & System, Electronics & Control, Data & Insight
- [x] Hover/focus/click to show detail panel (sticky sidebar)
- [x] Tags per skill (tools/frameworks)
- [x] Responsive grid (1→2 cols)

### Electronics & Embedded Section (NEW)
- [x] 5 hardware skills: Circuit Design, Microcontroller, Sensors & IoT, Automation Control, System Integration
- [x] 5-column responsive grid
- [x] Violet accent color scheme

### Experience Section (NEW)
- [x] 3 columns: AI Content Automation, System & Automation, Creative + Technical
- [x] Each with bullet points from resume
- [x] Color-coded icons (cyan, peach, mint)

### Education Section (NEW)
- [x] วิทยาลัยการอาชีพอมก๋อย / มหาวิทยาลัยทักษิณ
- [x] คณะอิเล็กทรอนิกส์ / อิเล็กทรอนิกส์อุตสาหกรรม (ปริญญาโท)
- [x] GPAX: 3.37, ปีที่สำเร็จ: 2564
- [x] Language bars: ไทย 100%, English 60%
- [x] Strengths: 5 items

### Tools & Technologies Section (NEW)
- [x] 4 categories: AI/Automation, Languages, Hardware, Productivity
- [x] All tools from resume listed as tag chips

### Contact Section
- [x] Email: photsathon.spd1@gmail.com
- [x] Phone: 064-154-6355
- [x] GitHub: @photsathonspd1-create
- [x] Instagram: @peatz21
- [x] Location: ชลบุรี (แหลมฉบัง), ประเทศไทย
- [x] Thai description about expertise
- [x] "Resume coming soon" button (disabled — no PDF yet)

### Footer (`src/components/Footer.tsx`)
- [x] Updated tagline: "AI Workflow Builder"
- [x] Navigation links (Projects, Skills, Now, Contact)
- [x] Back-to-top button
- [x] Copyright with dynamic year

### Accessibility & Polish
- [x] `useReducedMotion` on all animations
- [x] `aria-hidden` on decorative icons
- [x] Focus rings on all interactive elements
- [x] Custom `::selection` color
- [x] Smooth scroll + reduced-motion fallback

---

## ⚠️ Remaining TODO

### Must-Have (from ROADMAP.md)
- [ ] **Smooth page loading / route transitions** — fade-in between sections
- [ ] **Scroll progress indicator** — bar at top showing scroll position
- [ ] **Animated counters** — stats count up when entering viewport
- [ ] **Typing animation** — hero subtitle types character by character
- [ ] **Smooth scroll snap** — snap to each section on scroll

### Should-Have
- [ ] **Cursor spotlight effect** — gradient glow follows mouse on hero
- [ ] **Magnetic buttons** — buttons attract cursor on hover
- [ ] **Staggered text reveal** — headings fade in word by word
- [ ] **Tech stack marquee** — scrolling ticker of technology icons
- [ ] **Copy email on click** — click email → copy + toast "Copied!"

### Nice-to-Have
- [ ] **Terminal-style about section** — bio as CLI
- [ ] **Easter egg** — Konami code or hidden interaction
- [ ] **GitHub contribution graph** — embed activity
- [ ] **Dark/Light mode toggle**

### Content Updates
- [ ] **Resume PDF** — create and place at `public/resume.pdf`
- [ ] **Vercel deployment** — connect repo or run `npx vercel`
- [ ] **Real project screenshots** — add to project detail modals
- [ ] **Project detail modal/page** — click project → see full details

### Technical Polish
- [ ] **Lighthouse 90+ ทุก category**
- [ ] **PWA manifest** — installable on mobile
- [ ] **Sitemap + robots.txt** — SEO basics
- [ ] **Structured data (JSON-LD)** — Person schema
- [ ] **Image optimization** — WebP/AVIF, lazy loading
- [ ] **Bundle analysis** — keep JS under 150kb
- [ ] **Security headers** — CSP, X-Frame-Options

---

## 🔧 Dev Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build ✅ passes
npm run lint       # ESLint ✅ passes
node scripts/generate-hero-art.mjs  # Regenerate hero background
```

---

## 🎨 Design Tokens

| Token      | Hex       | Usage                |
|------------|-----------|----------------------|
| Background | `#05070d` | Main background      |
| Surface    | `#0b101a` | Cards, panels        |
| Cyan       | `#58e1ff` | Primary accent       |
| Peach      | `#ff8462` | Secondary accent     |
| Mint       | `#87ffbe` | Status, type tags    |
| Violet     | `#a98bff` | Tertiary accent      |

---

## 📝 Notes for Next Agent

- 3D scene is **client-only** (`dynamic` import, `ssr: false`). Never SSR it.
- All animations check `prefers-reduced-motion` via `useReducedMotion()`.
- Hero background is **procedurally generated** — regenerate with `node scripts/generate-hero-art.mjs`.
- Tailwind v4 uses CSS-first config (`@import "tailwindcss"` in globals.css) — no `tailwind.config.js`.
- Framer Motion variants (`container`, `item`) are at module scope — reuse for consistency.
- ESLint uses `FlatCompat` from `@eslint/eslintrc` because `eslint-config-next` doesn't support flat config natively.
- `Instagram` icon doesn't exist in `lucide-react` — used `Globe` instead.
- Contact links section has 4 items: Email, Phone, GitHub, Instagram.
- All Thai text is kept as-is (not translated).
- Build size: ~58 kB page, ~159 kB first load (including Three.js).

---

## 📊 Build Status (2026-05-11)

```
Route (app)                    Size      First Load JS
┌ ○ /                         57.9 kB   159 kB
└ ○ /_not-found               977 B     102 kB
+ First Load JS shared all    101 kB

✓ Compiled successfully
✓ Linting passed
✓ TypeScript passed
✓ Static pages generated (5/5)
```
