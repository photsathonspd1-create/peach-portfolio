"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
 ArrowUpRight,
 BrainCircuit,
 Cpu,
 Download,
 FolderGit2,
 Layers3,
 Mail,
 MousePointer2,
 Phone,
 MapPin,
 Sparkles,
 TerminalSquare,
 Zap,
 CircuitBoard,
 Globe,
 Wrench,
 BarChart3,
 GraduationCap,
 MessageCircle,
 Cog,
} from "lucide-react";
import NowSection from "@/components/NowSection";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import TerminalHero from "@/components/TerminalHero";
import AcexDemo from "@/components/AcexDemo";
import BeforeAfter from "@/components/BeforeAfter";
import SkillsRadar from "@/components/SkillsRadar";
import FloatingCTA from "@/components/FloatingCTA";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import TechMarquee from "@/components/TechMarquee";
import ViewerCounter from "@/components/ViewerCounter";
import CircuitDemo from "@/components/CircuitDemo";
import WorkflowDemo from "@/components/WorkflowDemo";
import IotDemo from "@/components/IotDemo";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
 ssr: false,
 loading: () => (
  <div className="absolute inset-0 -z-10 flex items-center justify-center">
   <div className="flex flex-col items-center gap-4">
    <div className="h-16 w-16 animate-pulse rounded-full border border-white/10 bg-white/[0.04]" />
    <div className="h-2 w-24 animate-pulse rounded-full bg-white/[0.06]" />
   </div>
  </div>
 ),
});

const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const projects = [
 {
  name: "ACEX AI",
  type: "Autonomous Workflow System",
  summary:
   "ระบบ AI ที่ออกแบบมาให้สามารถวางแผนและลงมือทำงานได้ด้วยตัวเอง เพื่อช่วยจัดการงานอัตโนมัติในหลายรูปแบบ ด้วย Plan → Do → Check → Act loop",
  stack: ["AI Agent", "API Integration", "Automation", "Memory System"],
  metric: "Auto",
  metricLabel: "plan & execute",
  icon: BrainCircuit,
  accent: "from-[#58e1ff] to-[#a98bff]",
  role: "THE ARCHITECT — โครงสร้างการทำงานของระบบ",
  features: [
   "AI วางแผนและตัดสินใจให้งานเองอัตโนมัติ",
   "เชื่อมต่อ API และบริการภายนอก",
   "ทำงานแบบ Loop จนกว่าจะสำเร็จ",
   "บันทึกและจัดการ Memory",
   "รองรับการเพิ่ม Module และความสามารถ",
  ],
  impact: [
   "ลดเวลาการทำงานซ้ำซ้อนได้อย่างมีนัยสำคัญ",
   "เปลี่ยนงาน Manual ให้เป็น Automation",
   "เพิ่มความเร็วในการทำงานและการตัดสินใจ",
   "ต่อยอดใช้ได้หลาย Business Use Case",
  ],
 },
 {
  name: "AI Content Automation",
  type: "Content Production Pipeline",
  summary:
   "ระบบผลิตคอนเทนต์อัตโนมัติที่ใช้ AI วิเคราะห์ข้อมูลและกลุ่มเป้าหมาย สร้าง Script, Caption, Ideas และ SEO Keywords",
  stack: ["AI Tools", "Content Ops", "SEO", "Data Analysis"],
  metric: "Auto",
  metricLabel: "content pipeline",
  icon: Sparkles,
  accent: "from-[#ff8462] to-[#ffd166]",
 },
 {
  name: "System & Automation",
  type: "Internal Operations",
  summary:
   "ออกแบบระบบอัตโนมัติภายใน ใช้ AI จัดการข้อมูล ไฟล์ รายงาน และสร้าง CLI Tools พร้อมเชื่อมต่อ API ต่างๆ",
  stack: ["CLI Tools", "API", "Automation", "Data Mgmt"],
  metric: "24/7",
  metricLabel: "auto-ops",
  icon: Cog,
  accent: "from-[#87ffbe] to-[#58e1ff]",
 },
 {
  name: "Hardware + Software Integration",
  type: "Embedded & IoT",
  summary:
   "ผสาน AI เข้ากับงาน Electronics — ออกแบบวงจร เขียนโค้ดควบคุม Arduino/ESP32/Raspberry Pi และเชื่อมต่อ IoT",
  stack: ["Arduino", "ESP32", "IoT", "Sensors"],
  metric: "HW",
  metricLabel: "integrated",
  icon: CircuitBoard,
  accent: "from-[#a98bff] to-[#ff8462]",
 },
];

const skills = [
 {
  name: "AI Workflow",
  detail: "ออกแบบ AI Workflow ใช้ AI วางแผนและทำงานอัตโนมัติ",
  tags: ["AI Agent", "n8n", "Make", "Zapier"],
  icon: BrainCircuit,
 },
 {
  name: "AI Integration",
  detail: "เชื่อมต่อ AI กับ API, Database และเครื่องมือต่าง ๆ",
  tags: ["OpenAI API", "LangChain", "Webhook"],
  icon: Cpu,
 },
 {
  name: "Prompt Engineering",
  detail: "ออกแบบ Prompt ให้ AI ตอบสนองแม่นยำและตรงตามเป้าหมาย",
  tags: ["ChatGPT", "Claude", "System Design"],
  icon: MessageCircle,
 },
 {
  name: "Automation & System",
  detail: "สร้างระบบ Automation และจัดการ Process อย่างมีประสิทธิภาพ",
  tags: ["Python", "Bash", "CLI Tools"],
  icon: Zap,
 },
 {
  name: "Electronics & Control",
  detail: "เขียนโค้ดควบคุม อุปกรณ์/เซนเซอร์ และออกแบบระบบให้ทำงานตามที่ต้องการ",
  tags: ["Arduino", "ESP32", "Raspberry Pi", "GPIO"],
  icon: CircuitBoard,
 },
 {
  name: "Data & Insight",
  detail: "จัดการข้อมูล วิเคราะห์ และสรุปผลเพื่อในการตัดสินใจ",
  tags: ["Data Analysis", "Reports", "Visualization"],
  icon: BarChart3,
 },
];

const electronicsSkills = [
 { name: "Circuit Design", detail: "ออกแบบวงจรอิเล็กทรอนิกส์ใช้งานจริง", icon: CircuitBoard },
 { name: "Microcontroller", detail: "เขียนโค้ดควบคุม Arduino, ESP32, Raspberry Pi", icon: Cpu },
 { name: "Sensors & IoT", detail: "ใช้งานเซนเซอร์, I2C, GPIO และเชื่อมต่อ IoT", icon: Globe },
 { name: "Automation Control", detail: "ควบคุมอุปกรณ์/รีเลย์ตามเงื่อนไขที่กำหนด", icon: Cog },
 { name: "System Integration", detail: "เชื่อมต่อ Hardware + Software เพื่อทำงานร่วมกัน", icon: Wrench },
];

const experience = [
 {
  title: "AI Content Automation",
  icon: Sparkles,
  accent: "#58e1ff",
  items: [
   "ใช้ AI ช่วยวิเคราะห์ข้อมูลและกลุ่มเป้าหมาย",
   "สร้างคอนเทนต์อัตโนมัติ เช่น Script, Caption, Ideas, SEO Keywords",
   "ปรับ Workflow การผลิตสินค้าให้มีประสิทธิภาพ",
   "เพิ่มประสิทธิภาพแผนการเล่าเรื่องให้กลุ่มผู้ชม",
  ],
 },
 {
  title: "System & Automation",
  icon: Cog,
  accent: "#ff8462",
  items: [
   "ออกแบบระบบอัตโนมัติให้สำหรับทำงานภายใน",
   "ใช้ AI จัดการข้อมูล/ไฟล์/รายงานอัตโนมัติ",
   "สร้าง CLI Tools ช่วยจัดการงานต่าง ๆ",
   "เชื่อมต่อ API และเครื่องมือต่าง ๆ เพื่อทำงานร่วมกันอย่างมีประสิทธิภาพ",
  ],
 },
 {
  title: "Creative + Technical",
  icon: Layers3,
  accent: "#87ffbe",
  items: [
   "ผสาน AI เข้ากับงาน Video, Web, Content และระบบต่าง ๆ",
   "ใช้ Logic และ Automation แก้ปัญหาที่ยุ่งยากให้ตรงจุด",
   "เข้าใจกลไกการทำงานขององค์กร Creative และ Technical",
  ],
 },
];

const tools = {
 "AI / Automation": ["ChatGPT / Claude", "OpenAI API", "LangChain", "Make (Integromat)", "n8n", "Zapier"],
 "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "Framer Motion"],
 "Backend": ["Node.js", "Express.js", "Python", "REST API", "GraphQL", "Prisma"],
 "Database": ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Supabase", "Redis"],
 "DevOps & Tools": ["Git / GitHub", "Docker", "Vercel", "Linux / Bash", "CI/CD", "AWS"],
 Languages: ["TypeScript", "JavaScript", "Python", "Arduino (C/C++)", "Bash", "SQL"],
 "Hardware": ["Arduino", "ESP32", "Raspberry Pi", "Sensor", "รีเลย์", "I2C", "GPIO", "Relay", "Breadboard"],
 Productivity: ["Notion", "Google Workspace", "Airtable", "Slack", "Figma", "Postman"],
};

const strengths = [
 "คิดเป็นระบบและวิเคราะห์ปัญหาได้ดี",
 "มุ่งมั่นผลลัพธ์และใช้งานได้จริง",
 "เรียนรู้เร็ว ปรับตัวได้ทุกสถานการณ์",
 "ทำงานเป็นทีม สื่อสารชัดเจน",
 "เปิดรับสิ่งใหม่ และพัฒนาตัวเองเสมอ",
];

const contactLinks = [
 {
  label: "Email",
  value: "acex.peachwork@gmail.com",
  href: "mailto:acex.peachwork@gmail.com",
  icon: Mail,
 },
 {
  label: "Phone",
  value: "064-154-6355",
  href: "tel:0641546355",
  icon: Phone,
 },
 {
  label: "GitHub",
  value: "@photsathonspd1-create",
  href: "https://github.com/photsathonspd1-create",
  icon: FolderGit2,
 },
 {
  label: "LINE",
  value: "peatz21",
  href: "https://line.me/ti/p/~peatz21",
  icon: MessageCircle,
 },
];

const container = {
 hidden: { opacity: 0 },
 show: {
  opacity: 1,
  transition: { staggerChildren: 0.09, delayChildren: 0.08 },
 },
};

const item = {
 hidden: { opacity: 0, y: 24 },
 show: {
  opacity: 1,
  y: 0,
  transition: { duration: 0.7, ease: smoothEase },
 },
};

export default function Home() {
 const [activeSkill, setActiveSkill] = useState(skills[0]);
 const shouldReduceMotion = useReducedMotion();
 const { visible: toastVisible, copyEmail } = EmailToast();

 const activeSkillIcon = useMemo(() => activeSkill.icon, [activeSkill]);
 const ActiveIcon = activeSkillIcon;

 return (
  <main className="min-h-screen overflow-hidden bg-[#05070d] text-zinc-100">
   <ScrollProgress />
   <Hero shouldReduceMotion={shouldReduceMotion} />

   <NowSection />

   <AcexDemo />

   <CircuitDemo />
   <WorkflowDemo />
   <IotDemo />

   {/* Projects */}
   <section
    id="projects"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Key Projects"
     title="ระบบ AI ที่สร้างจากความเข้าใจปัญหาจริง"
     copy="ACEX AI — ระบบ Autonomous Workflow ที่ออกแบบ Architecture เอง ตั้งแต่ Plan → Do → Check → Act พร้อมรองรับการต่อยอดทุกรูปแบบ"
    />

    <motion.div
     variants={container}
     initial="hidden"
     whileInView="show"
     viewport={{ once: true, margin: "-120px" }}
     className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
     {projects.map((project, index) => {
      const Icon = project.icon;
      return (
       <motion.article
        key={project.name}
        variants={item}
        whileHover={
         shouldReduceMotion
          ? undefined
          : { y: -8, transition: { duration: 0.25, ease: "easeOut" } }
        }
        className={`group relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#0b101a]/90 p-5 shadow-2xl shadow-black/20 ${
         index === 0 || index === 2 ? "xl:col-span-2" : ""
        }`}
       >
        <div
         className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accent}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(255,132,98,0.08))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex h-full flex-col justify-between gap-8">
         <div>
          <div className="flex items-start justify-between gap-4">
           <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white">
            <Icon className="h-5 w-5" aria-hidden="true" />
           </div>
           <motion.div
            animate={
             shouldReduceMotion
              ? undefined
              : { x: [0, 4, 0], y: [0, -4, 0] }
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300"
           >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
           </motion.div>
          </div>
          <p className="mt-8 text-sm font-medium text-[#87ffbe]">{project.type}</p>
          <h3 className="mt-3 max-w-sm text-2xl font-semibold text-white">{project.name}</h3>
          {project.role && (
           <p className="mt-2 text-xs font-medium text-[#ffb49e]">{project.role}</p>
          )}
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">{project.summary}</p>
          {project.features && (
           <ul className="mt-4 space-y-1.5">
            {project.features.map((f) => (
             <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#58e1ff]" />
              {f}
             </li>
            ))}
           </ul>
          )}
         </div>
         <div>
          <div className="mb-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
           <div>
            <p className="text-3xl font-semibold text-white">{project.metric}</p>
            <p className="mt-1 text-xs uppercase text-zinc-500">{project.metricLabel}</p>
           </div>
          </div>
          <div className="flex flex-wrap gap-2">
           {project.stack.map((tech) => (
            <span
             key={tech}
             className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300"
            >
             {tech}
            </span>
           ))}
          </div>
         </div>
        </div>
       </motion.article>
      );
     })}
    </motion.div>
   </section>

   <BeforeAfter />

   {/* Skills */}
   <section
    id="skills"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Core Skills"
     title="AI Workflow + Electronics + Automation"
     copy="ทักษะที่ผสมผสานระหว่าง AI, Electronics และ System Design — ออกแบบ Workflow ด้วย AI เขียนโค้ดควบคุม Hardware และสร้างระบบ Automation ที่ใช้งานได้จริง"
    />

    <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.82fr]">
     <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
     >
      {skills.map((skill) => {
       const Icon = skill.icon;
       const isActive = activeSkill.name === skill.name;
       return (
        <motion.button
         key={skill.name}
         type="button"
         variants={item}
         onMouseEnter={() => setActiveSkill(skill)}
         onFocus={() => setActiveSkill(skill)}
         onClick={() => setActiveSkill(skill)}
         whileTap={{ scale: 0.98 }}
         className={`group min-h-32 rounded-lg border p-4 text-left transition duration-300 ${
          isActive
           ? "border-[#58e1ff]/60 bg-[#10202b] text-white shadow-lg shadow-[#58e1ff]/10"
           : "border-white/10 bg-[#0b101a] text-zinc-300 hover:border-white/25 hover:bg-[#111827]"
         }`}
        >
         <div className="flex items-center justify-between gap-3">
          <span
           className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
            isActive
             ? "border-[#58e1ff]/50 bg-[#58e1ff]/15"
             : "border-white/10 bg-white/[0.04]"
           }`}
          >
           <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <MousePointer2 className="h-4 w-4 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
         </div>
         <h3 className="mt-5 text-lg font-semibold">{skill.name}</h3>
         <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">{skill.detail}</p>
        </motion.button>
       );
      })}
     </motion.div>

     <motion.aside
      key={activeSkill.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: smoothEase }}
      className="rounded-lg border border-white/10 bg-[#0b101a] p-5 lg:sticky lg:top-6 lg:min-h-[420px]"
     >
      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#ff8462]/40 bg-[#ff8462]/10 text-[#ffb49e]">
       <ActiveIcon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-8 text-sm font-medium text-[#ffb49e]">Active capability</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{activeSkill.name}</h3>
      <p className="mt-5 text-base leading-8 text-zinc-300">{activeSkill.detail}</p>
      <div className="mt-8 flex flex-wrap gap-2">
       {activeSkill.tags.map((tag) => (
        <span
         key={tag}
         className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-zinc-300"
        >
         {tag}
        </span>
       ))}
      </div>
      <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
       {[
        ["System", "AI"],
        ["Hardware", "Embedded"],
        ["Output", "Real"],
       ].map(([label, value]) => (
        <div key={label} className="rounded-lg bg-white/[0.04] p-3">
         <p className="text-2xl font-semibold text-white">{value}</p>
         <p className="mt-1 text-xs text-zinc-500">{label}</p>
        </div>
       ))}
      </div>
     </motion.aside>
    </div>
   </section>

   {/* Electronics & Embedded */}
   <section
    id="electronics"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Hardware Skills"
     title="Electronics & Embedded Systems"
     copy="ออกแบบวงจร เขียนโค้ดควบคุม Microcontroller และเชื่อมต่อ Hardware + Software ให้ทำงานร่วมกัน"
    />

    <motion.div
     variants={container}
     initial="hidden"
     whileInView="show"
     viewport={{ once: true, margin: "-120px" }}
     className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
     {electronicsSkills.map((skill) => {
      const Icon = skill.icon;
      return (
       <motion.div
        key={skill.name}
        variants={item}
        whileHover={
         shouldReduceMotion ? undefined : { y: -6, transition: { duration: 0.2 } }
        }
        className="group rounded-lg border border-white/10 bg-[#0b101a] p-5 transition duration-300 hover:border-[#a98bff]/40 hover:bg-[#0f1425]"
       >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#a98bff]/30 bg-[#a98bff]/10">
         <Icon className="h-5 w-5 text-[#a98bff]" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-base font-semibold text-white">{skill.name}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{skill.detail}</p>
       </motion.div>
      );
     })}
    </motion.div>
   </section>

   <SkillsRadar />

   {/* Experience */}
   <section
    id="experience"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Experience"
     title="งานที่ทำ — AI, Automation, Creative"
     copy="ผสมผสาน AI เข้ากับ Content Production, System Design และ Hardware Integration"
    />

    <motion.div
     variants={container}
     initial="hidden"
     whileInView="show"
     viewport={{ once: true, margin: "-120px" }}
     className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
     {experience.map((exp) => {
      const Icon = exp.icon;
      return (
       <motion.article
        key={exp.title}
        variants={item}
        className="rounded-lg border border-white/10 bg-[#0b101a] p-6"
       >
        <div className="flex items-center gap-3">
         <span
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
          style={{
           borderColor: `${exp.accent}40`,
           backgroundColor: `${exp.accent}15`,
          }}
         >
          <Icon className="h-5 w-5" style={{ color: exp.accent }} aria-hidden="true" />
         </span>
         <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
        </div>
        <ul className="mt-5 space-y-3">
         {exp.items.map((expItem) => (
          <li key={expItem} className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
           <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: exp.accent }}
           />
           {expItem}
          </li>
         ))}
        </ul>
       </motion.article>
      );
     })}
    </motion.div>
   </section>

   {/* Education */}
   <section
    id="education"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <motion.div
     initial={{ opacity: 0, y: 24 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: "-120px" }}
     transition={{ duration: 0.7, ease: smoothEase }}
     className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
    >
     <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6 sm:p-8 lg:p-10">
      <div className="flex items-center gap-3">
       <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ffd166]/40 bg-[#ffd166]/10">
        <GraduationCap className="h-5 w-5 text-[#ffd166]" aria-hidden="true" />
       </span>
       <p className="text-sm font-medium uppercase text-[#ffd166]">Education</p>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">
       วิทยาลัยการอาชีพนวมินทราชินีมุกดาหาร
      </h3>
      <p className="mt-3 text-base text-zinc-300">
       สาขาอิเล็กทรอนิกส์อุตสาหกรรม (ปวส.2)
      </p>
      <div className="mt-6 flex items-center gap-6">
       <div>
        <p className="text-3xl font-semibold text-white">ปวส.2</p>
        <p className="mt-1 text-xs text-zinc-500">ระดับการศึกษา</p>
       </div>
      </div>
     </div>

     <div className="grid gap-4">
      {/* Language */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <p className="text-sm font-medium uppercase text-[#58e1ff]">Language</p>
       <div className="mt-5 space-y-4">
        <div>
         <div className="flex items-center justify-between text-sm">
          <span className="text-white">ไทย</span>
          <span className="text-zinc-500">Native</span>
         </div>
         <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-full rounded-full bg-[#58e1ff]" />
         </div>
        </div>
        <div>
         <div className="flex items-center justify-between text-sm">
          <span className="text-white">English</span>
          <span className="text-zinc-500">~60%</span>
         </div>
         <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[60%] rounded-full bg-[#ff8462]" />
         </div>
        </div>
       </div>
      </div>

      {/* Strengths */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <p className="text-sm font-medium uppercase text-[#87ffbe]">Strengths</p>
       <ul className="mt-4 space-y-2.5">
        {strengths.map((s) => (
         <li key={s} className="flex items-start gap-3 text-sm text-zinc-300">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#87ffbe]" />
          {s}
         </li>
        ))}
       </ul>
      </div>
     </div>
    </motion.div>
   </section>

   {/* Tools & Technologies */}
   <section
    id="tools"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Tech Stack"
     title="เครื่องมือที่ใช้"
     copy="AI Tools, Languages, Hardware และ Productivity — เลือกใช้ตามงานที่เหมาะสม"
    />

    <motion.div
     variants={container}
     initial="hidden"
     whileInView="show"
     viewport={{ once: true, margin: "-120px" }}
     className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
     {Object.entries(tools).map(([category, items]) => (
      <motion.div
       key={category}
       variants={item}
       className="rounded-lg border border-white/10 bg-[#0b101a] p-5"
      >
       <p className="text-sm font-medium uppercase text-[#ffb49e]">{category}</p>
       <div className="mt-4 flex flex-wrap gap-2">
        {items.map((tool) => (
         <span
          key={tool}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300"
         >
          {tool}
         </span>
        ))}
       </div>
      </motion.div>
     ))}
    </motion.div>
   </section>

   <TechMarquee />

   {/* Resume */}
   <section
    id="resume"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <SectionIntro
     eyebrow="Resume"
     title="เรซูเม่"
     copy="สรุปประวัติการทำงาน ทักษะ และประสบการณ์ทั้งหมด"
    />

    <motion.div
     initial={{ opacity: 0, y: 24 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: "-120px" }}
     transition={{ duration: 0.7, ease: smoothEase }}
     className="mt-10 grid gap-6 lg:grid-cols-[0.45fr_1fr]"
    >
     {/* Photo + Basic Info */}
     <div className="flex flex-col items-center rounded-lg border border-white/10 bg-[#0b101a] p-6 sm:p-8">
      <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-[#58e1ff]/30">
       <Image
        src="/peach-resume.jpg"
        alt="PHOTSATHON KUMTAEW — Profile photo"
        fill
        className="object-cover"
       />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">PHOTSATHON KUMTAEW</h3>
      <p className="mt-2 text-sm text-[#58e1ff]">AI Workflow Builder / Full Stack Developer</p>
      <div className="mt-6 w-full space-y-3 border-t border-white/10 pt-6">
       <div className="flex items-center gap-3 text-sm text-zinc-300">
        <Mail className="h-4 w-4 text-[#ff8462]" />
        acex.peachwork@gmail.com
       </div>
       <div className="flex items-center gap-3 text-sm text-zinc-300">
        <Phone className="h-4 w-4 text-[#ff8462]" />
        064-154-6355
       </div>
       <div className="flex items-center gap-3 text-sm text-zinc-300">
        <MapPin className="h-4 w-4 text-[#ff8462]" />
        ชลบุรี (แหลมฉบัง), ประเทศไทย
       </div>
       <div className="flex items-center gap-3 text-sm text-zinc-300">
        <FolderGit2 className="h-4 w-4 text-[#ff8462]" />
        github.com/photsathonspd1-create
       </div>
       <div className="flex items-center gap-3 text-sm text-zinc-300">
        <MessageCircle className="h-4 w-4 text-[#ff8462]" />
        LINE: peatz21
       </div>
      </div>
     </div>

     {/* Resume Details */}
     <div className="space-y-6">
      {/* Profile Summary */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <h4 className="text-sm font-medium uppercase text-[#58e1ff]">Profile Summary</h4>
       <p className="mt-3 text-sm leading-7 text-zinc-300">
        ผู้ที่มีความสนใจและเชี่ยวชาญในการออกแบบ Workflow โดยใช้ AI Tools หลากหลาย
        ผสานความรู้ด้านอิเล็กทรอนิกส์และการเขียนโค้ด เพื่อสร้างระบบ Automation
        ทั้งซอฟต์แวร์และฮาร์ดแวร์ ช่วยลดเวลาและเพิ่มประสิทธิภาพธุรกิจ
        มีทักษะ Full Stack Development สามารถพัฒนา Web Application ได้ครบวงจร
       </p>
      </div>

      {/* Education */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <h4 className="text-sm font-medium uppercase text-[#ffd166]">Education</h4>
       <div className="mt-3">
        <p className="text-base font-semibold text-white">วิทยาลัยการอาชีพนวมินทราชินีมุกดาหาร</p>
        <p className="mt-1 text-sm text-zinc-400">สาขาอิเล็กทรอนิกส์อุตสาหกรรม (ปวส.2)</p>
       </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <h4 className="text-sm font-medium uppercase text-[#87ffbe]">Technical Skills</h4>
       <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
         "React / Next.js", "TypeScript", "Node.js", "Python",
         "Tailwind CSS", "PostgreSQL", "MongoDB", "Docker",
         "REST API / GraphQL", "Git / GitHub", "AI / Automation", "Arduino / ESP32",
        ].map((skill) => (
         <div
          key={skill}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs text-zinc-300"
         >
          {skill}
         </div>
        ))}
       </div>
      </div>

      {/* Key Projects */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <h4 className="text-sm font-medium uppercase text-[#ffb49e]">Key Projects</h4>
       <ul className="mt-4 space-y-3">
        {[
         { name: "ACEX AI", desc: "ระบบ Autonomous Workflow ด้วย Plan → Do → Check → Act" },
         { name: "AI Content Automation", desc: "ระบบผลิตคอนเทนต์อัตโนมัติด้วย AI" },
         { name: "Hardware + Software Integration", desc: "ผสาน AI เข้ากับ Arduino/ESP32/Raspberry Pi" },
        ].map((proj) => (
         <li key={proj.name} className="text-sm text-zinc-300">
          <span className="font-semibold text-white">{proj.name}</span> — {proj.desc}
         </li>
        ))}
       </ul>
      </div>

      {/* Strengths */}
      <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6">
       <h4 className="text-sm font-medium uppercase text-[#a98bff]">Strengths</h4>
       <div className="mt-4 flex flex-wrap gap-2">
        {strengths.map((s) => (
         <span
          key={s}
          className="rounded-lg border border-[#a98bff]/20 bg-[#a98bff]/10 px-3 py-2 text-xs text-zinc-300"
         >
          {s}
         </span>
        ))}
       </div>
      </div>
     </div>
    </motion.div>
   </section>

   {/* Contact */}
   <section
    id="contact"
    className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
   >
    <motion.div
     initial={{ opacity: 0, y: 24 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: "-120px" }}
     transition={{ duration: 0.7, ease: smoothEase }}
     className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
    >
     <div className="rounded-lg border border-white/10 bg-[#0b101a] p-6 sm:p-8 lg:p-10">
      <p className="text-sm font-medium uppercase text-[#87ffbe]">Contact</p>
      <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
       พร้อมสร้างระบบ AI ที่ทำงานได้จริง
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
       ผู้ที่มีความสนใจและเชี่ยวชาญในการออกแบบ Workflow โดยใช้ AI Tools หลากหลาย
       ผสานความรู้ด้านอิเล็กทรอนิกส์และการเขียนโค้ด เพื่อสร้างระบบ Automation
       ทั้งซอฟต์แวร์และฮาร์ดแวร์ ช่วยลดเวลาและเพิ่มประสิทธิภาพธุรกิจ
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
       <a
        href="mailto:acex.peachwork@gmail.com"
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-[#d9faff] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
       >
        <Mail className="h-4 w-4" aria-hidden="true" />
        ส่งข้อความ
       </a>
       <a
        href="#resume"
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
       >
        <Download className="h-4 w-4" aria-hidden="true" />
        ดูเรซูเม่
       </a>
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
       <MapPin className="h-4 w-4" aria-hidden="true" />
       ชลบุรี (แหลมฉบัง), ประเทศไทย
      </div>
     </div>

     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {contactLinks.map((link) => {
       const Icon = link.icon;
       const isEmail = link.label === "Email";
       return (
        <a
         key={link.label}
         href={link.href}
         target={link.href.startsWith("http") ? "_blank" : undefined}
         rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
         onClick={isEmail ? (e) => { e.preventDefault(); copyEmail(); } : undefined}
         className="group rounded-lg border border-white/10 bg-[#0b101a] p-5 transition duration-300 hover:border-[#58e1ff]/50 hover:bg-[#10202b]"
        >
         <div className="flex items-center justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
           <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-zinc-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
         </div>
         <p className="mt-6 text-sm text-zinc-500">{link.label}</p>
         <p className="mt-2 break-words text-lg font-semibold text-white">{link.value}</p>
        </a>
       );
      })}
     </div>
    </motion.div>

    {/* Toast */}
    {toastVisible && (
     <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-[fadeInUp_0.3s_ease-out] rounded-lg border border-[#87ffbe]/30 bg-[#0b101a] px-5 py-3 text-sm font-medium text-[#87ffbe] shadow-lg shadow-[#87ffbe]/10">
      คัดลอกแล้ว ✓
     </div>
    )}
   </section>
   <Footer />
   <FloatingCTA />
   <CustomCursor />
   <ViewerCounter />
  </main>
 );
}

function Hero({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
 return (
  <section className="relative isolate min-h-[90svh] overflow-hidden bg-[#05070d] px-5 pt-5 text-white sm:px-8 lg:px-10">
   <Image
    src="/peach-hero-art.png"
    alt="Abstract geometric artwork — Peach portfolio hero illustration"
    fill
    priority
    sizes="100vw"
    className="absolute inset-0 -z-20 h-full w-full object-cover opacity-75"
   />
   <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#05070d_0%,rgba(5,7,13,0.84)_36%,rgba(5,7,13,0.34)_100%)]" />
   <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,13,0)_0%,#05070d_94%)]" />

   <ErrorBoundary>
    <Scene3D />
   </ErrorBoundary>

   <motion.header
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: smoothEase }}
    className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4"
   >
    <a href="#top" className="flex items-center gap-3 text-sm font-semibold text-white">
     <Image
      src="/logo.png"
      alt="Peach logo"
      width={56}
      height={56}
      className="rounded-xl"
     />
     <span className="hidden text-lg sm:inline">Peach</span>
    </a>
    <nav className="hidden items-center gap-2 text-sm text-zinc-300 sm:flex">
     {["now", "projects", "skills", "electronics", "experience", "education", "resume", "tools", "contact"].map((navItem) => (
      <a
       key={navItem}
       href={`#${navItem}`}
       className="rounded-lg px-3 py-2 transition hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#58e1ff]"
      >
       {navItem}
      </a>
     ))}
    </nav>
   </motion.header>

   <div
    id="top"
    className="mx-auto grid w-full max-w-7xl items-end gap-10 pb-16 pt-20 sm:pt-28 lg:min-h-[78svh] lg:grid-cols-[1fr_0.72fr] lg:pb-20"
   >
    <motion.div variants={container} initial="animate" className="max-w-5xl">
     <motion.div
      variants={item}
      className="mb-6 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-zinc-200 backdrop-blur"
     >
      <span className="h-2 w-2 bg-[#87ffbe]" />
      AI Workflow Builder
     </motion.div>

     <motion.p variants={item} className="text-sm font-medium uppercase text-[#ffb49e]">
      PHOTSATHON KUMTAEW
     </motion.p>
     <motion.h1
      variants={item}
      className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
     >
      AI Automation
      <br />
      <span className="text-zinc-400">Content Systems · Electronics</span>
     </motion.h1>
     <motion.div
      variants={item}
      className="mt-5 flex flex-wrap items-center gap-3 text-xl font-medium text-zinc-200 sm:text-3xl"
     >
      <span>Peach</span>
     </motion.div>
     <motion.p variants={item} className="mt-7 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
      ผู้ที่มีความสนใจและเชี่ยวชาญในการออกแบบ Workflow โดยใช้ AI Tools หลากหลาย
      ผสานความรู้ด้านอิเล็กทรอนิกส์และการเขียนโค้ด เพื่อสร้างระบบ Automation
      ทั้งซอฟต์แวร์และฮาร์ดแวร์
     </motion.p>
     <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
      <a
       href="#projects"
       className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#58e1ff] px-5 py-3 text-sm font-semibold text-[#031018] transition hover:bg-[#87ffbe] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#05070d]"
      >
       <Layers3 className="h-4 w-4" aria-hidden="true" />
       ดูโปรเจกต์
      </a>
      <a
       href="#contact"
       className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
      >
       <TerminalSquare className="h-4 w-4" aria-hidden="true" />
       ติดต่อ
      </a>
     </motion.div>
    </motion.div>

    <motion.div
     initial={{ opacity: 0, y: 28 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.35, ease: smoothEase }}
     className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
    >
     {[
      ["Identity", "PHOTSATHON KUMTAEW"],
      ["Handle", "Peach"],
      ["Location", "ชลบุรี, ไทย"],
     ].map(([label, value], index) => (
      <motion.div
       key={label}
       animate={
        shouldReduceMotion
         ? undefined
         : { y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }
       }
       transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
       className="rounded-lg border border-white/10 bg-[#07101b]/70 p-4 backdrop-blur"
      >
       <p className="text-xs uppercase text-zinc-500">{label}</p>
       <p className="mt-3 break-words text-xl font-semibold text-white">{value}</p>
      </motion.div>
     ))}
    </motion.div>
   </div>

   {/* Terminal Hero */}
   <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
    <TerminalHero />
   </div>
  </section>
 );
}

function SectionIntro({
 eyebrow,
 title,
 copy,
}: {
 eyebrow: string;
 title: string;
 copy: string;
}) {
 const words = title.split(" ");

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true, margin: "-120px" }}
   transition={{ duration: 0.65, ease: smoothEase }}
   className="max-w-3xl"
  >
   <p className="text-sm font-medium uppercase text-[#58e1ff]">{eyebrow}</p>
   <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
    {words.map((word, i) => (
     <motion.span
      key={i}
      className="mr-[0.3em] inline-block"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
       duration: 0.4,
       delay: i * 0.05,
       ease: smoothEase,
      }}
     >
      {word}
     </motion.span>
    ))}
   </h2>
   <p className="mt-5 text-base leading-7 text-zinc-300">{copy}</p>
  </motion.div>
 );
}

function EmailToast() {
 const [visible, setVisible] = useState(false);
 const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const copyEmail = useCallback(() => {
  navigator.clipboard.writeText("acex.peachwork@gmail.com").then(() => {
   if (timeoutRef.current) clearTimeout(timeoutRef.current);
   setVisible(true);
   timeoutRef.current = setTimeout(() => setVisible(false), 2000);
  });
 }, []);

 useEffect(() => {
  return () => {
   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
 }, []);

 return { visible, copyEmail };
}
