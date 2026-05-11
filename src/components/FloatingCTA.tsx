"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail } from "lucide-react";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0b101a]/95 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="text-sm font-semibold text-white">ติดต่อผม</p>
              <p className="mt-1 text-xs text-zinc-500">เลือกช่องทางที่สะดวก</p>
            </div>
            <div className="p-2">
              <a
                href="mailto:acex.peachwork@gmail.com"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58e1ff]/10 text-[#58e1ff]">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-zinc-500">acex.peachwork@gmail.com</p>
                </div>
              </a>
              <a
                href="tel:0641546355"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#87ffbe]/10 text-[#87ffbe]">
                  📱
                </span>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-xs text-zinc-500">064-154-6355</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse rings */}
      {!open && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-[#58e1ff]/20" />
          <span className="absolute inset-0 animate-pulse rounded-full bg-[#58e1ff]/10" />
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#58e1ff] text-[#031018] shadow-lg shadow-[#58e1ff]/30 transition hover:scale-105 hover:bg-[#87ffbe] active:scale-95"
        aria-label={open ? "Close contact menu" : "Open contact menu"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
