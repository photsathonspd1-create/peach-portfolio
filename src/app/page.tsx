"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Cpu,
  Download,
  FolderGit2,
  Layers3,
  Mail,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import NowSection from "@/components/NowSection";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10" />,
});

const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const projects = [
  {
    name: "Arra Oracle V3",
    type: "AI Command Center",
    summary:
      "A high-signal operations surface for agents, data flows, and rapid decision loops.",
    stack: ["Next.js", "AI UX", "Realtime"],
    metric: "0.8s",
    metricLabel: "decision loop",
    icon: BrainCircuit,
    accent: "from-[#58e1ff] to-[#a98bff]",
  },
  {
    name: "Flow Story Engine",
    type: "Creative Automation",
    summary:
      "A narrative pipeline that turns rough ideas into structured scripts, scenes, and publish-ready systems.",
    stack: ["Motion", "Content Ops", "Design"],
    metric: "12x",
    metricLabel: "faster drafts",
    icon: Sparkles,
    accent: "from-[#ff8462] to-[#ffd166]",
  },
  {
    name: "Agentic Ops Grid",
    type: "Productivity System",
    summary:
      "A dense Bento workspace for monitoring tasks, tools, evidence, and execution state.",
    stack: ["Dashboards", "Automation", "UX"],
    metric: "24/7",
    metricLabel: "system watch",
    icon: Layers3,
    accent: "from-[#87ffbe] to-[#58e1ff]",
  },
  {
    name: "Commerce Intelligence",
    type: "Research Build",
    summary:
      "A compact research cockpit for surfacing weak signals, validating paths, and tracking opportunity quality.",
    stack: ["Data", "Strategy", "Security"],
    metric: "4D",
    metricLabel: "signal map",
    icon: ShieldCheck,
    accent: "from-[#a98bff] to-[#ff8462]",
  },
];

const skills = [
  {
    name: "Frontend Architecture",
    detail:
      "Next.js app router, component systems, responsive layouts, and interfaces that stay fast under real content.",
    tags: ["Next.js", "React", "Tailwind"],
    icon: Code2,
  },
  {
    name: "Motion Systems",
    detail:
      "Framer Motion choreography, hover physics, progressive reveal patterns, and motion that clarifies intent.",
    tags: ["Framer Motion", "Microinteractions", "UI polish"],
    icon: Zap,
  },
  {
    name: "AI Integration",
    detail:
      "Agent workflows, prompt surfaces, orchestration patterns, and practical AI tools built around operator control.",
    tags: ["Agents", "LLMs", "Automation"],
    icon: BrainCircuit,
  },
  {
    name: "Systems Thinking",
    detail:
      "Clear operational models, decision loops, evidence capture, and resilient flows for high-pressure work.",
    tags: ["Ops", "Process", "Reliability"],
    icon: Cpu,
  },
  {
    name: "Security Mindset",
    detail:
      "Threat-aware product thinking, careful boundaries, and clean handling of sensitive workflows.",
    tags: ["Risk", "Validation", "Hardening"],
    icon: ShieldCheck,
  },
  {
    name: "Design Polish",
    detail:
      "Quiet hierarchy, crisp spacing, accessible contrast, and visual systems that feel premium without noise.",
    tags: ["Bento", "Design systems", "A11y"],
    icon: BadgeCheck,
  },
];

const contactLinks = [
  {
    label: "Email",
    value: "acex.peachwork@gmail.com",
    href: "mailto:acex.peachwork@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "@photsathonspd1-create",
    href: "https://github.com/photsathonspd1-create",
    icon: FolderGit2,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
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

  const activeSkillIcon = useMemo(() => activeSkill.icon, [activeSkill]);
  const ActiveIcon = activeSkillIcon;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-zinc-100">
      <Hero shouldReduceMotion={shouldReduceMotion} />

      <NowSection />

      <section
        id="projects"
        className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <SectionIntro
          eyebrow="Selected projects"
          title="Bento-built systems with sharp surfaces."
          copy="Command-center work across automation, interface polish, and research systems — built around clarity, speed, and technical presence."
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
                    : {
                        y: -8,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }
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
                        transition={{
                          duration: 3.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300"
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </motion.div>
                    </div>

                    <p className="mt-8 text-sm font-medium text-[#87ffbe]">
                      {project.type}
                    </p>
                    <h3 className="mt-3 max-w-sm text-2xl font-semibold text-white">
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
                      {project.summary}
                    </p>
                  </div>

                  <div>
                    <div className="mb-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <div>
                        <p className="text-3xl font-semibold text-white">
                          {project.metric}
                        </p>
                        <p className="mt-1 text-xs uppercase text-zinc-500">
                          {project.metricLabel}
                        </p>
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

      <section
        id="skills"
        className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <SectionIntro
          eyebrow="Interactive skills"
          title="A precise stack for ambitious interfaces."
          copy="Capabilities tuned for real product surfaces, from architecture and AI integration to motion systems that make complex work feel controlled."
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
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">
                    {skill.detail}
                  </p>
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
            <p className="mt-8 text-sm font-medium text-[#ffb49e]">
              Active capability
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              {activeSkill.name}
            </h3>
            <p className="mt-5 text-base leading-8 text-zinc-300">
              {activeSkill.detail}
            </p>
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
              {["Clarity", "Speed", "Finish"].map((label, index) => (
                <div key={label} className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-2xl font-semibold text-white">
                    {index === 0 ? "99" : index === 1 ? "12x" : "A+"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

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
            <p className="text-sm font-medium uppercase text-[#87ffbe]">
              Contact
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
              Build the next precise, fast, unforgettable interface.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
              Peach is presented here as a calm technical operator: Thai name
              forward, global-ready identity, and a portfolio system designed
              for serious product conversations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:acex.peachwork@gmail.com"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-[#d9faff] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Start a conversation
              </a>
              <a
                href="#projects"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className="group rounded-lg border border-white/10 bg-[#0b101a] p-5 transition duration-300 hover:border-[#58e1ff]/50 hover:bg-[#10202b]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <p className="mt-6 text-sm text-zinc-500">{link.label}</p>
                  <p className="mt-2 break-words text-lg font-semibold text-white">
                    {link.value}
                  </p>
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>
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

      <Scene3D />

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4"
      >
        <a
          href="#top"
          className="flex items-center gap-3 text-sm font-semibold text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
            P
          </span>
          <span className="hidden sm:inline">Peach / ท่านพีช</span>
        </a>
        <nav className="flex items-center gap-2 text-sm text-zinc-300">
          {["now", "projects", "skills", "contact"].map((navItem) => (
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
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-zinc-200 backdrop-blur"
          >
            <span className="h-2 w-2 bg-[#87ffbe]" />
            Remembering Peach as the signal
          </motion.div>

          <motion.p
            variants={item}
            className="text-sm font-medium uppercase text-[#ffb49e]"
          >
            Phasathorn Khumthaeo
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-4 max-w-6xl break-words text-[clamp(3.25rem,11vw,8.8rem)] font-semibold leading-[0.95] text-white"
          >
            พสธร คุ้มแถว
          </motion.h1>
          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center gap-3 text-xl font-medium text-zinc-200 sm:text-3xl"
          >
            <span>Peach</span>
            <span className="h-px w-10 bg-white/25" />
            <span>ท่านพีช</span>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg"
          >
            A sleek personal portfolio for a builder who blends sharp product
            taste, technical execution, AI systems, and motion-rich digital
            experiences.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#58e1ff] px-5 py-3 text-sm font-semibold text-[#031018] transition hover:bg-[#87ffbe] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#05070d]"
            >
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              View projects
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-[#58e1ff] focus:ring-offset-2 focus:ring-offset-[#05070d]"
            >
              <TerminalSquare className="h-4 w-4" aria-hidden="true" />
              Contact Peach
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
            ["Identity", "พสธร คุ้มแถว"],
            ["Handle", "Peach"],
            ["Mode", "High-polish systems"],
          ].map(([label, value], index) => (
            <motion.div
              key={label}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }
              }
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-lg border border-white/10 bg-[#07101b]/70 p-4 backdrop-blur"
            >
              <p className="text-xs uppercase text-zinc-500">{label}</p>
              <p className="mt-3 break-words text-xl font-semibold text-white">
                {value}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-zinc-300">{copy}</p>
    </motion.div>
  );
}
