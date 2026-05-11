"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

const HEARTBEAT_INTERVAL = 10_000; // 10s
const STALE_THRESHOLD = 30_000; // 30s without heartbeat = offline
const SHOW_DELAY = 1_500;

export default function RealtimeViewerCounter() {
  const [viewerCount, setViewerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    // Generate unique session ID
    const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionIdRef.current = id;

    // Upsert this viewer
    const upsertViewer = async () => {
      await supabase.from("viewers").upsert(
        { id, last_seen: new Date().toISOString() },
        { onConflict: "id" }
      );
    };

    // Update heartbeat
    const heartbeat = async () => {
      await supabase
        .from("viewers")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", id);
    };

    // Count active viewers
    const countViewers = async () => {
      const cutoff = new Date(Date.now() - STALE_THRESHOLD).toISOString();
      const { count } = await supabase
        .from("viewers")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", cutoff);
      if (count !== null) setViewerCount(count);
    };

    // Clean up stale viewers
    const cleanStale = async () => {
      const cutoff = new Date(Date.now() - STALE_THRESHOLD * 2).toISOString();
      await supabase.from("viewers").delete().lt("last_seen", cutoff);
    };

    // Init
    upsertViewer().then(() => {
      countViewers();
      cleanStale();
    });

    // Heartbeat timer
    const heartbeatTimer = setInterval(() => {
      heartbeat();
      countViewers();
      cleanStale();
    }, HEARTBEAT_INTERVAL);

    // Subscribe to real-time changes
    const channel = supabase
      .channel("viewer-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "viewers",
        },
        () => {
          // Any change → recount
          countViewers();
        }
      )
      .subscribe();

    // Show with delay
    const showTimer = setTimeout(() => setIsVisible(true), SHOW_DELAY);

    // Cleanup on leave
    return () => {
      clearTimeout(showTimer);
      clearInterval(heartbeatTimer);
      supabase.removeChannel(channel);
      // Delete self from viewers
      supabase.from("viewers").delete().eq("id", id);
    };
  }, []);

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
