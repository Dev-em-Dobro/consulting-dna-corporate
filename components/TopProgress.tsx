"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Global top loading bar. Starts on any internal link click (works even when
 * the target route is prefetched, unlike a Suspense `loading.tsx`) and finishes
 * when the pathname updates (navigation complete).
 */
export default function TopProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fast, setFast] = useState(false);
  const activeRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const start = () => {
      if (activeRef.current) return;
      activeRef.current = true;
      clearTimers();
      setFast(false);
      setVisible(true);
      setProgress(8);
      timers.current.push(window.setTimeout(() => setProgress(90), 60));
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // same page (or in-page hash) — no navigation
      if (url.pathname === window.location.pathname) return;
      start();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // pathname changed → navigation finished
    if (!activeRef.current) return;
    activeRef.current = false;
    clearTimers();
    setFast(true);
    setProgress(100);
    timers.current.push(window.setTimeout(() => setVisible(false), 250));
    timers.current.push(
      window.setTimeout(() => {
        setProgress(0);
        setFast(false);
      }, 500),
    );
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-[3px]">
      <div
        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: `width ${fast ? 200 : 3000}ms ease-out, opacity 300ms ease-out`,
        }}
      />
    </div>
  );
}
