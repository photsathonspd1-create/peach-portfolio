"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
 const [progress, setProgress] = useState(0);

 useEffect(() => {
  const handleScroll = () => {
   const scrollTop = window.scrollY;
   const docHeight = document.documentElement.scrollHeight - window.innerHeight;
   const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
   setProgress(scrollPercent);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
  <div className="fixed top-0 left-0 z-50 w-full" style={{ height: 3 }}>
   <div
    className="h-full transition-[width] duration-150 ease-out"
    style={{
     width: `${progress}%`,
     background: "linear-gradient(90deg, #58e1ff 0%, #ff8462 100%)",
    }}
   />
  </div>
 );
}
