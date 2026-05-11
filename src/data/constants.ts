import {
 BrainCircuit,
 Cpu,
 Sparkles,
 Zap,
 CircuitBoard,
 Globe,
 Wrench,
 BarChart3,
 Cog,
 MessageCircle,
 Mail,
 Phone,
 FolderGit2,
 Layers3,
 type LucideIcon,
} from "lucide-react";

/* ─── Projects ─── */
export interface Project {
 name: string;
 type: string;
 summary: string;
 stack: string[];
 metric: string;
 metricLabel: string;
 icon: LucideIcon;
 accent: string;
 role?: string;
 features?: string[];
 impact?: string[];
}

export const projects: Project[] = [
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

/* ─── Skills ─── */
export interface Skill {
 name: string;
 detail: string;
 tags: string[];
 icon: LucideIcon;
}

export const skills: Skill[] = [
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

/* ─── Electronics Skills ─── */
export interface ElectronicsSkill {
 name: string;
 detail: string;
 icon: LucideIcon;
}

export const electronicsSkills: ElectronicsSkill[] = [
 { name: "Circuit Design", detail: "ออกแบบวงจรอิเล็กทรอนิกส์ใช้งานจริง", icon: CircuitBoard },
 { name: "Microcontroller", detail: "เขียนโค้ดควบคุม Arduino, ESP32, Raspberry Pi", icon: Cpu },
 { name: "Sensors & IoT", detail: "ใช้งานเซนเซอร์, I2C, GPIO และเชื่อมต่อ IoT", icon: Globe },
 { name: "Automation Control", detail: "ควบคุมอุปกรณ์/รีเลย์ตามเงื่อนไขที่กำหนด", icon: Cog },
 { name: "System Integration", detail: "เชื่อมต่อ Hardware + Software เพื่อทำงานร่วมกัน", icon: Wrench },
];

/* ─── Experience ─── */
export interface Experience {
 title: string;
 icon: LucideIcon;
 accent: string;
 items: string[];
}

export const experience: Experience[] = [
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

/* ─── Tools ─── */
export const tools: Record<string, string[]> = {
 "AI / Automation": ["ChatGPT / Claude", "OpenAI API", "LangChain", "Make (Integromat)", "n8n", "Zapier"],
 Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "Framer Motion"],
 Backend: ["Node.js", "Express.js", "Python", "REST API", "GraphQL", "Prisma"],
 Database: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Supabase", "Redis"],
 "DevOps & Tools": ["Git / GitHub", "Docker", "Vercel", "Linux / Bash", "CI/CD", "AWS"],
 Languages: ["TypeScript", "JavaScript", "Python", "Arduino (C/C++)", "Bash", "SQL"],
 Hardware: ["Arduino", "ESP32", "Raspberry Pi", "Sensor", "รีเลย์", "I2C", "GPIO", "Relay", "Breadboard"],
 Productivity: ["Notion", "Google Workspace", "Airtable", "Slack", "Figma", "Postman"],
};

/* ─── Strengths ─── */
export const strengths: string[] = [
 "คิดเป็นระบบและวิเคราะห์ปัญหาได้ดี",
 "มุ่งมั่นผลลัพธ์และใช้งานได้จริง",
 "เรียนรู้เร็ว ปรับตัวได้ทุกสถานการณ์",
 "ทำงานเป็นทีม สื่อสารชัดเจน",
 "เปิดรับสิ่งใหม่ และพัฒนาตัวเองเสมอ",
];

/* ─── Contact Links ─── */
export interface ContactLink {
 label: string;
 value: string;
 href: string;
 icon: LucideIcon;
}

export const contactLinks: ContactLink[] = [
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

/* ─── Profile Info ─── */
export const profile = {
 name: "PHOTSATHON KUMTAEW",
 handle: "Peach",
 title: "AI Workflow Builder / Full Stack Developer",
 email: "acex.peachwork@gmail.com",
 phone: "064-154-6355",
 location: "ชลบุรี (แหลมฉบัง), ประเทศไทย",
 locationShort: "ชลบุรี, ไทย",
 github: "github.com/photsathonspd1-create",
 githubUrl: "https://github.com/photsathonspd1-create",
 line: "peatz21",
 lineUrl: "https://line.me/ti/p/~peatz21",
 summary:
  "ผู้ที่มีความสนใจและเชี่ยวชาญในการออกแบบ Workflow โดยใช้ AI Tools หลากหลาย ผสานความรู้ด้านอิเล็กทรอนิกส์และการเขียนโค้ด เพื่อสร้างระบบ Automation ทั้งซอฟต์แวร์และฮาร์ดแวร์ ช่วยลดเวลาและเพิ่มประสิทธิภาพธุรกิจ มีทักษะ Full Stack Development สามารถพัฒนา Web Application ได้ครบวงจร",
 summaryShort:
  "ผู้ที่มีความสนใจและเชี่ยวชาญในการออกแบบ Workflow โดยใช้ AI Tools หลากหลาย ผสานความรู้ด้านอิเล็กทรอนิกส์และการเขียนโค้ด เพื่อสร้างระบบ Automation ทั้งซอฟต์แวร์และฮาร์ดแวร์",
 education: {
  school: "วิทยาลัยการอาชีพนวมินทราชินีมุกดาหาร",
  major: "สาขาอิเล็กทรอนิกส์อุตสาหกรรม (ปวส.2)",
  level: "ปวส.2",
 },
 resumeSkills: [
  "React / Next.js", "TypeScript", "Node.js", "Python",
  "Tailwind CSS", "PostgreSQL", "MongoDB", "Docker",
  "REST API / GraphQL", "Git / GitHub", "AI / Automation", "Arduino / ESP32",
 ],
};

/* ─── Nav Items ─── */
export const navItems = [
 "now", "projects", "skills", "electronics", "experience", "education", "resume", "tools", "contact",
];

/* ─── Animation Variants ─── */
export const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const containerVariants = {
 hidden: { opacity: 0 },
 show: {
  opacity: 1,
  transition: { staggerChildren: 0.09, delayChildren: 0.08 },
 },
};

export const itemVariants = {
 hidden: { opacity: 0, y: 24 },
 show: {
  opacity: 1,
  y: 0,
  transition: { duration: 0.7, ease: smoothEase },
 },
};
