"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "morficat_splash_shown";
const HOLD_MS = 700;
const FADE_MS = 300;

export function SplashScreen() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setMounted(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const removeTimer = setTimeout(
      () => setMounted(false),
      HOLD_MS + FADE_MS,
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-terracota transition-opacity duration-300 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-white text-6xl sm:text-7xl font-extrabold tracking-tight">
        MorfiCat
      </div>
    </div>
  );
}
