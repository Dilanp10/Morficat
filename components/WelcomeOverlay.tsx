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
      className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-background/95 backdrop-blur-sm animate-fade-in-up"
    >
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-terracota-soft mb-3">
            <span>✨</span>
            <span>Catamarca</span>
          </div>
          <h1
            id="welcome-title"
            className="text-5xl font-black tracking-tight text-terracota"
          >
            Haku
          </h1>
          <p className="text-xs tracking-widest uppercase text-terracota-soft/70 mt-1">
            vamos · quechua
          </p>
          <p className="text-foreground/70 mt-3">
            Encontrá los mejores lugares para comer o tomar algo en Catamarca.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/signup"
            onClick={dismiss}
            className="block rounded-button bg-terracota px-4 py-3 text-center font-medium text-white hover:bg-terracota-deep transition-colors"
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            onClick={dismiss}
            className="block rounded-button border border-foreground/15 px-4 py-3 text-center font-medium text-foreground hover:bg-card transition-colors"
          >
            Ya tengo cuenta
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="block w-full py-2 text-center text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            Continuar como invitado
          </button>
        </div>

        <p className="text-xs text-foreground/35 text-center mt-6">
          La cuenta es opcional. Sin login podés buscar y ver todo;
          solo se necesita para dejar reseñas.
        </p>
      </div>
    </div>
  );
}
