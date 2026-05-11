# 🍑 Peach Portfolio — Agent Handoff

> Last updated: 2026-05-11 by OpenClaw agent

## Project Overview

Personal portfolio for **Peach (พสธร คุ้มแถว / Phasathorn Khumthaeo)**.
Dark-themed single-page site with 3D elements, motion design, and interactive skills section.

**Stack:** Next.js 16.2.6 · React 19 · Tailwind CSS v4 · Framer Motion · Three.js (@react-three/fiber + @react-three/drei) · Lucide Icons

**Repo:** https://github.com/photsathonspd1-create/peach-portfolio

---

## ✅ Completed Work

### Infrastructure
- [x] Project bootstrapped with create-next-app (Next.js 16 + React 19 + Tailwind v4)
- [x] TypeScript strict mode — zero type errors
- [x] Production build passes (`npm run build`)
- [x] Removed `--turbo=false` from dev script (Turbopack is default in Next 16)

### Layout & Metadata (`src/app/layout.tsx`)
- [x] `lang="th"` — correct for Thai-heavy content
- [x] Open Graph metadata (title, description, image, locale `th_TH`, siteName)
- [x] Twitter Card (`summary_large_image`)
- [x] `metadataBase` set (currently `https://peach.dev` — update on deploy)

### 3D Scene (`src/components/Scene3D.tsx`)
- [x] Floating wireframe icosahedron (cyan) with trail effect + distort material
- [x] Floating wireframe octahedron (peach) with wobble material
- [x] Floating wireframe torus (mint)
- [x] Ring system — 3 orbiting torus rings (cyan, peach, violet)
- [x] Particle field (80 points) + Stars background
- [x] Dynamic import with `ssr: false` (no server-side 3D rendering)
- [x] Custom lighting: 3 colored point lights (cyan, peach, mint)

### "Now" Section (`src/components/NowSection.tsx`)
- [x] 4 cards: Building, Focus, Learning, Open to
- [x] Animated pulsing "Currently active" status badge
- [x] Floating glow effect on each card
- [x] Responsive grid layout (1→2→4 columns)
- [x] Integrated into nav bar

### Contact Section (updated in `src/app/page.tsx`)
- [x] Email: `acex.peachwork@gmail.com`
- [x] GitHub: `@photsathonspd1-create` → https://github.com/photsathonspd1-create
- [x] LinkedIn removed (user doesn't have one)
- [x] "Download CV" button added (⚠️ placeholder — needs real PDF)

### Hero Section
- [x] 3D scene integrated behind hero content
- [x] Hero image has meaningful alt text
- [x] Floating identity cards with Framer Motion

### Accessibility & Polish
- [x] `useReducedMotion` support throughout all animations
- [x] `aria-hidden` on decorative icons
- [x] Focus rings on all interactive elements
- [x] Contrast improvements: `zinc-400` → `zinc-300`/`zinc-200` across all body text
- [x] Custom `::selection` color (cyan)
- [x] Smooth scroll behavior with reduced-motion fallback
- [x] Decorative gradient bar removed from project cards (had no function)

---

## ⚠️ TODO — Needs Attention

### High Priority
1. **CV/Resume PDF** — "Download CV" button currently links to `#projects` (placeholder)
   - Action: Place PDF at `public/resume.pdf`, update href in `page.tsx` line ~410

2. **Now Section Content** — Currently placeholder text
   - Action: Edit `src/components/NowSection.tsx` → `nowItems` array with real current focus

3. **Domain / Deploy URL** — `metadataBase` in `layout.tsx` is `https://peach.dev`
   - Action: Update to actual deployment domain (Vercel, custom domain, etc.)

### Medium Priority
4. **Favicon** — Still using default create-next-app favicon
   - Action: Replace `src/app/favicon.ico` with custom Peach favicon

5. **OG Image** — Using `peach-hero-art.png` for social sharing
   - Action: Consider a dedicated OG image (1200×630 recommended) for better social card rendering

6. **Footer** — No footer component exists
   - Action: Add footer with copyright, social links, back-to-top

7. **Loading State** — Scene3D has empty div as loading fallback
   - Action: Add a subtle skeleton or pulse animation as 3D loads

### Low Priority / Nice-to-Have
8. **Blog/Writing Section** — Link to dev blog or articles
9. **Testimonials** — Endorsements from collaborators
10. **GitHub Activity** — Contribution graph or pinned repos
11. **Dark/Light Toggle** — Showcase theme system skills
12. **Page Transitions** — Smooth section-to-section transitions
13. **Cursor Effects** — Custom cursor or hover trails

---

## 📁 File Structure

```
peach-portfolio/
├── public/
│   ├── peach-hero-art.png    # Generated hero background (procedural)
│   └── ...                    # Default Next.js SVGs
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 + custom styles
│   │   ├── layout.tsx         # Root layout with full OG/Twitter metadata
│   │   └── page.tsx           # Main page (Hero, Projects, Skills, Contact)
│   └── components/
│       ├── Scene3D.tsx        # Three.js 3D scene (client-only, dynamic import)
│       └── NowSection.tsx     # "What I'm doing now" section
├── scripts/
│   └── generate-hero-art.mjs  # Procedural PNG generator for hero background
├── HANDOFF.md                  # ← THIS FILE
├── AGENTS.md                   # Project agent config
├── CLAUDE.md                   # Claude-specific config
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 🔧 Dev Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint
```

---

## 🎨 Design System / Color Tokens

| Token       | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| Background  | `#05070d` | Main background              |
| Cyan        | `#58e1ff` | Primary accent, links, hero  |
| Peach       | `#ff8462` | Secondary accent, warm       |
| Mint        | `#87ffbe` | Status indicators, type tags |
| Violet      | `#a98bff` | Tertiary accent              |
| Selection   | `rgba(88,225,255,0.35)` | Text selection   |

---

## 📝 Notes for Next Agent

- The 3D scene is **client-only** (dynamic import, ssr: false). Don't try to SSR it.
- All animations respect `prefers-reduced-motion` via `useReducedMotion()`.
- The hero background image is **procedurally generated** by `scripts/generate-hero-art.mjs` — run it with `node scripts/generate-hero-art.mjs` to regenerate.
- Framer Motion variants are defined at module scope (`container`, `item`) — reuse them for consistency.
- The project uses Tailwind v4 (CSS-first config via `@import "tailwindcss"` in globals.css) — no `tailwind.config.js` file.
- `package-lock.json` is generated but not committed — consider adding it to `.gitignore` or committing it for reproducible builds.
