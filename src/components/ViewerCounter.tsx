"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users } from "lucide-react";

export default function ViewerCounter() {
 const [viewerCount, setViewerCount] = useState(0);
 const [isVisible, setIsVisible] = useState(false);
 const [hasCounted, setHasCounted] = useState(false);

 useEffect(() => {
  // Generate or retrieve session ID
  let sessionId = sessionStorage.getItem("portfolio_session");
  if (!sessionId) {
   sessionId = Math.random().toString(36).substring(2, 15);
   sessionStorage.setItem("portfolio_session", sessionId);
  }

  // Get stored viewers from localStorage
  const stored = localStorage.getItem("portfolio_viewers");
  const viewers: Record<string, number> = stored ? JSON.parse(stored) : {};

  // Clean up viewers older than 5 minutes
  const now = Date.now();
  const active: Record<string, number> = {};
  for (const [id, timestamp] of Object.entries(viewers)) {
   if (now - timestamp < 5 * 60 * 1000) {
    active[id] = timestamp;
   }
  }

  // Add current viewer
  active[sessionId] = now;
  localStorage.setItem("portfolio_viewers", JSON.stringify(active));

  const count = Object.keys(active).length;
  setViewerCount(count);
  setHasCounted(true);

  // Show with animation
  const showTimer = setTimeout(() => setIsVisible(true), 2000);

  // Update timestamp every 30 seconds to stay "active"
  const interval = setInterval(() => {
   const stored2 = localStorage.getItem("portfolio_viewers");
   const viewers2: Record<string, number> = stored2 ? JSON.parse(stored2) : {};
   const now2 = Date.now();
   const active2: Record<string, number> = {};
   for (const [id, timestamp] of Object.entries(viewers2)) {
    if (now2 - (timestamp as number) < 5 * 60 * 1000) {
     active2[id] = timestamp as number;
    }
   }
   if (sessionId) active2[sessionId] = now2;
   localStorage.setItem("portfolio_viewers", JSON.stringify(active2));
   setViewerCount(Object.keys(active2).length);
  }, 30000);

  // Listen for storage changes (other tabs)
  const handleStorage = (e: StorageEvent) => {
   if (e.key === "portfolio_viewers") {
    const data = e.newValue ? JSON.parse(e.newValue) : {};
    const now3 = Date.now();
    const active3: Record<string, number> = {};
    for (const [id, timestamp] of Object.entries(data)) {
     if (now3 - (timestamp as number) < 5 * 60 * 1000) {
      active3[id] = timestamp as number;
     }
    }
    setViewerCount(Object.keys(active3).length);
   }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
   clearTimeout(showTimer);
   clearInterval(interval);
   window.removeEventListener("storage", handleStorage);

   // Remove viewer on leave
   const stored3 = localStorage.getItem("portfolio_viewers");
   if (stored3 && sessionId) {
    const viewers3 = JSON.parse(stored3);
    delete viewers3[sessionId];
    localStorage.setItem("portfolio_viewers", JSON.stringify(viewers3));
   }
  };
 }, []);

 // No fake jitter — keep the count honest

 return (
  <AnimatePresence>
   {isVisible && (
    <motion.div
     initial={{ opacity: 0, y: 20, scale: 0.9 }}
     animate={{ opacity: 1, y: 0, scale: 1 }}
     exit={{ opacity: 0, y: 20, scale: 0.9 }}
     transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
     className="fixed bottom-6 left-6 z-50"
    >
     <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b101a]/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="relative flex items-center justify-center">
       <Eye className="h-4 w-4 text-[#58e1ff]" />
       <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#87ffbe]"
       />
      </div>
      <div className="flex items-center gap-1.5">
       <Users className="h-3.5 w-3.5 text-zinc-400" />
       <motion.span
        key={viewerCount}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold text-white"
       >
        {viewerCount}
       </motion.span>
       <span className="text-xs text-zinc-500">กำลังดู</span>
      </div>
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
}
