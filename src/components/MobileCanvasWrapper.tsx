"use client";

import { useState, useCallback, useRef, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Props {
 children: ReactNode;
 className?: string;
}

export default function MobileCanvasWrapper({ children, className = "" }: Props) {
 const [scale, setScale] = useState(1);
 const wrapperRef = useRef<HTMLDivElement>(null);

 const zoomIn = useCallback(() => setScale((s) => Math.min(2, s + 0.25)), []);
 const zoomOut = useCallback(() => setScale((s) => Math.max(0.5, s - 0.25)), []);
 const resetZoom = useCallback(() => setScale(1), []);

 // Translate touch events to mouse events for canvas compatibility
 const handleTouchStart = useCallback((e: ReactTouchEvent) => {
  if (e.touches.length === 1) {
   const touch = e.touches[0];
   const target = e.target as HTMLElement;
   const canvas = target.closest("canvas");
   if (canvas) {
    const mouseEvent = new MouseEvent("mousedown", {
     clientX: touch.clientX,
     clientY: touch.clientY,
     bubbles: true,
    });
    canvas.dispatchEvent(mouseEvent);
   }
  }
 }, []);

 const handleTouchMove = useCallback((e: ReactTouchEvent) => {
  if (e.touches.length === 1) {
   const touch = e.touches[0];
   const target = e.target as HTMLElement;
   const canvas = target.closest("canvas");
   if (canvas) {
    const mouseEvent = new MouseEvent("mousemove", {
     clientX: touch.clientX,
     clientY: touch.clientY,
     bubbles: true,
    });
    canvas.dispatchEvent(mouseEvent);
   }
  }
 }, []);

 const handleTouchEnd = useCallback((e: ReactTouchEvent) => {
  const target = e.target as HTMLElement;
  const canvas = target.closest("canvas");
  if (canvas) {
   canvas.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }
 }, []);

 return (
  <div className={`relative ${className}`}>
   {/* Zoom controls */}
   <div className="absolute right-3 top-3 z-20 flex gap-1.5">
    <button
     type="button"
     onClick={zoomOut}
     className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0b101a]/90 text-zinc-400 backdrop-blur transition hover:border-white/25 hover:text-white"
     aria-label="Zoom out"
    >
     <ZoomOut className="h-4 w-4" />
    </button>
    <button
     type="button"
     onClick={resetZoom}
     className="flex h-8 items-center justify-center rounded-lg border border-white/10 bg-[#0b101a]/90 px-2 text-xs text-zinc-400 backdrop-blur transition hover:border-white/25 hover:text-white"
     aria-label={`Reset zoom (${Math.round(scale * 100)}%)`}
    >
     {Math.round(scale * 100)}%
    </button>
    <button
     type="button"
     onClick={zoomIn}
     className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0b101a]/90 text-zinc-400 backdrop-blur transition hover:border-white/25 hover:text-white"
     aria-label="Zoom in"
    >
     <ZoomIn className="h-4 w-4" />
    </button>
    <button
     type="button"
     onClick={resetZoom}
     className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0b101a]/90 text-zinc-400 backdrop-blur transition hover:border-white/25 hover:text-white"
     aria-label="Reset zoom"
    >
     <RotateCcw className="h-3.5 w-3.5" />
    </button>
   </div>

   {/* Canvas container with zoom */}
   <div
    ref={wrapperRef}
    className="overflow-auto rounded-xl"
    style={{ touchAction: "none" }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
   >
    <div
     style={{
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: scale < 1 ? `${100 / scale}%` : "100%",
     }}
    >
     {children}
    </div>
   </div>
  </div>
 );
}
