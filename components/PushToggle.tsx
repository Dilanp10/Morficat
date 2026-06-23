"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff } from "lucide-react";
import { subscribePush, unsubscribePush } from "@/app/_actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type State = "loading" | "unsupported" | "denied" | "off" | "on";

export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setState(sub ? "on" : "off");
      });
    });
  }, []);

  if (state === "loading" || state === "unsupported") return null;

  if (state === "denied") {
    return (
      <p className="text-xs px-1" style={{ color: "var(--fg-50)" }}>
        Notificaciones bloqueadas en tu navegador. Activalas desde la
        configuración del sitio.
      </p>
    );
  }

  const toggle = () => {
    startTransition(async () => {
      const reg = await navigator.serviceWorker.ready;

      if (state === "on") {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await unsubscribePush(sub.endpoint);
        }
        setState("off");
        return;
      }

      const perm = await Notification.requestPermission();
      if (perm === "denied") { setState("denied"); return; }
      if (perm !== "granted") return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const keyBuf = sub.getKey("p256dh");
      const authBuf = sub.getKey("auth");
      if (!keyBuf || !authBuf) return;

      const toBase64 = (buf: ArrayBuffer) =>
        btoa(String.fromCharCode(...new Uint8Array(buf)));

      const result = await subscribePush({
        endpoint: sub.endpoint,
        p256dh: toBase64(keyBuf),
        auth: toBase64(authBuf),
      });

      if (!result.error) setState("on");
    });
  };

  const isOn = state === "on";

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="w-full flex items-center gap-4 rounded-card p-4 text-left transition-opacity active:opacity-70 disabled:opacity-50"
      style={{ background: "var(--card-bg)", border: "1px solid var(--line)" }}
    >
      <span
        className="size-9 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "var(--card-2)",
          color: isOn ? "var(--moss)" : "var(--fg-30)",
        }}
      >
        {isOn ? <Bell size={17} /> : <BellOff size={17} />}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block font-medium" style={{ color: "var(--fg)" }}>
          {isOn ? "Notificaciones activas" : "Activar notificaciones"}
        </span>
        <span
          className="block text-xs mt-0.5 font-serif italic"
          style={{ color: "var(--fg-50)" }}
        >
          {isOn
            ? "Te avisamos cuando abre un favorito."
            : "Avisate cuando un favorito esté por abrir."}
        </span>
      </span>

      <span
        className="text-xs font-semibold px-2 py-1 rounded-full shrink-0"
        style={{
          background: isOn ? "color-mix(in srgb, var(--moss) 15%, transparent)" : "var(--card-2)",
          color: isOn ? "var(--moss)" : "var(--fg-50)",
        }}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </button>
  );
}
