"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled, fall through
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Compartir"
      className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm backdrop-blur-sm transition-opacity hover:opacity-80"
      style={{ background: "rgba(20,16,13,0.7)", color: copied ? "var(--moss)" : "var(--fg-70)", border: "1px solid var(--line-2)" }}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      <span>{copied ? "Copiado" : "Compartir"}</span>
    </button>
  );
}
