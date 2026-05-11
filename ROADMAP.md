# 🍑 Peach Portfolio — Roadmap

> รายการ features ที่ต้องทำ อัปเดต: 2026-05-11

---

## 🔴 Must-Have (portfolio มือโปรต้องมี)

- [ ] **Smooth page loading / route transitions** — fade-in ตอนเปลี่ยน section, ไม่กระพริบ
- [ ] **Scroll progress indicator** — bar ด้านบนบอกว่าอ่านถึงไหนแล้ว
- [ ] **Animated counters** — ตัวเลข stats นับขึ้นตอน scroll เข้า viewport
- [ ] **Project detail modal/page** — คลิก project แล้วเห็นรายละเอียด: screenshots, tech stack breakdown, role, challenges, results
- [ ] **Testimonials / endorsements** — quote จากคนที่เคยร่วมงาน พร้อม avatar + role
- [ ] **GitHub contribution graph** — embed แสดง activity จริง
- [ ] **Typing animation** — hero subtitle พิมพ์ทีละคำ เช่น "Frontend Developer", "AI Engineer", "Motion Designer"
- [ ] **Smooth scroll snap** — section ละ snap ตอน scroll ให้ feel premium
- [ ] **Error boundary** — graceful fallback ถ้า 3D หรือ component crash
- [ ] **Analytics** — Vercel Analytics หรือ Plausible

## 🟡 Should-Have (ยกระดับจากกลาง → โปร)

- [ ] **Cursor spotlight effect** — gradient glow ตามเมาส์บน hero
- [ ] **Parallax layers** — background เคลื่อนช้ากว่า foreground ตอน scroll
- [ ] **Staggered text reveal** — heading แต่ละคำ fade in ทีละตัว
- [ ] **Magnetic buttons** — ปุ่มดูดเมาส์ตอน hover
- [ ] **Tech stack marquee** — scrolling ticker ของ icon technologies
- [ ] **Bento grid stats** — แสดง stats แบบ bento layout (years exp, projects count, etc.)
- [ ] **Animated background mesh** — gradient mesh ขยับเบาๆ ด้านหลัง
- [ ] **Image gallery / lightbox** — สำหรับ project screenshots
- [ ] **Copy email on click** — คลิก email แล้วคัดลอก + toast "Copied!"
- [ ] **Status page indicator** — แสดง availability (Open to work / Busy)

## 🟢 Nice-to-Have (wow factor)

- [ ] **Terminal-style about section** — แสดง bio เป็น command line interface
- [ ] **Easter egg** — Konami code หรือ hidden interaction
- [ ] **Sound effects** — subtle click/hover sounds (ปิดได้)
- [ ] **Keyboard navigation** — `j/k` scroll, `/` focus search
- [ ] **Time-based greeting** — "Good morning/afternoon/evening" ตามเวลาจริง
- [ ] **Weather widget** — แสดงอากาศที่ location ปัจจุบัน
- [ ] **Spotify "Now Playing"** — embed ว่ากำลังฟังเพลงอะไร
- [ ] **Visitor counter** — retro-style hit counter
- [ ] **QR code** — สำหรับ share portfolio link บนมือถือ
- [ ] **Print-friendly resume** — กด print แล้วได้ resume layout สวยๆ

## 🔵 Technical Polish

- [ ] **Lighthouse 90+ ทุก category** — Performance, A11y, Best Practices, SEO
- [ ] **PWA manifest** — install ได้บนมือถือ
- [ ] **Sitemap + robots.txt** — SEO basics
- [ ] **Structured data (JSON-LD)** — Person schema for Google
- [ ] **Image optimization** — WebP/AVIF, lazy loading, srcset
- [ ] **Font subsetting** — โหลดเฉพาะ glyphs ที่ใช้
- [ ] **Bundle analysis** — ตรวจ JS size ไม่ให้เกิน 150kb
- [ ] **Security headers** — CSP, X-Frame-Options
- [ ] **Canonical URL** — ป้องกัน duplicate content
- [ ] **Offline fallback page** — ถ้าเน็ตหลุดแสดง page สวยๆ

---

## ✅ Done

- [x] Next.js 15 + React 19 + Tailwind v4 + TypeScript strict
- [x] 3D Scene (Three.js) — wireframe icosahedron, octahedron, torus, rings, particles
- [x] Framer Motion animations (all with reduced-motion support)
- [x] "What I'm doing now" section (real content: ACEX AI, n8n, LangChain)
- [x] Interactive skills section (hover/focus/click) — 6 core skills
- [x] Contact section with email, phone, GitHub, Instagram
- [x] Footer with nav + back-to-top
- [x] Custom SVG favicon + OG image (1200x630)
- [x] Open Graph + Twitter Card metadata
- [x] `lang="en"` + accessibility improvements
- [x] Loading skeleton for 3D scene
- [x] Error boundary for 3D scene
- [x] `suppressHydrationWarning` for browser extensions
- [x] ESLint config with FlatCompat bridge
- [x] Real personal content from resume (all sections)
- [x] Hero: AI Workflow Builder, Thai description
- [x] Projects: ACEX AI, AI Content, System & Automation, HW+SW
- [x] Electronics & Embedded section (5 hardware skills)
- [x] Experience section (3 columns)
- [x] Education section (GPAX 3.37, ปี 2564)
- [x] Language bars (TH 100%, EN 60%)
- [x] Strengths section (5 items)
- [x] Tools & Technologies (4 categories)
