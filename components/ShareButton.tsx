"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or unsupported, fall through to clipboard
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
      className="inline-flex items-center gap-1.5 rounded-button border border-white/10 px-3 py-1.5 text-sm text-white/60 hover:bg-bg-tertiary hover:text-white transition-colors"
    >
      {copied ? (
        <>
          <Check size={14} className="text-success" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Share2 size={14} />
          <span>Compartir</span>
        </>
      )}
    </button>
  );
}
