"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const animate = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(animate);
    };

    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, [role='button']");
      setIsHovering(!!interactive);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onHover);
    requestAnimationFrame(animate);

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onHover);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Trail (larger, slower) */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
            isHovering
              ? "h-10 w-10 border-2 border-[#58e1ff]/40 bg-[#58e1ff]/5"
              : "h-5 w-5 bg-[#58e1ff]/10"
          }`}
        />
      </div>

      {/* Dot (small, fast) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
            isHovering
              ? "h-3 w-3 bg-[#58e1ff]"
              : "h-2 w-2 bg-[#58e1ff]/80"
          }`}
        />
      </div>
    </>
  );
}
