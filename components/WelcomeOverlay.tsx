"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "haku_welcomed";

export function WelcomeOverlay({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;
    setVisible(true);
  }, [isAuthenticated]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-8 animate-fade-in-up"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* Brand mark */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-section mb-4">Catamarca · gastronomía</p>
        <h1
          id="welcome-title"
          className="font-serif italic leading-none"
          style={{ fontSize: "clamp(3rem,14vw,5rem)", color: "var(--terra)" }}
        >
          Haku.
        </h1>
        <p
          className="font-mono text-xs tracking-widest mt-2"
          style={{ color: "var(--fg-30)" }}
        >
          VAMOS · QUECHUA
        </p>
        <p
          className="mt-5 text-sm leading-relaxed max-w-xs"
          style={{ color: "var(--fg-50)", fontFamily: "var(--font-sans)" }}
        >
          Encontrá los mejores lugares para comer o tomar algo en Catamarca.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3 pb-8">
        <Link
          href="/signup"
          onClick={dismiss}
          className="block w-full rounded-button py-3.5 text-center text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--terra)", color: "var(--bg)" }}
        >
          Crear cuenta
        </Link>
        <Link
          href="/login"
          onClick={dismiss}
          className="block w-full rounded-button py-3.5 text-center text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            border: "1px solid var(--line-2)",
            color: "var(--fg-70)",
            background: "transparent",
          }}
        >
          Ya tengo cuenta
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="block w-full py-2.5 text-center text-sm transition-opacity hover:opacity-80"
          style={{ color: "var(--fg-30)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Continuar como invitado
        </button>
        <p
          className="text-xs text-center pt-1"
          style={{ color: "var(--fg-30)" }}
        >
          La cuenta es opcional — sin login podés buscar y ver todo.
        </p>
      </div>
    </div>
  );
}
