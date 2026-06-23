import Link from "next/link";
import {
  ChevronRight,
  Info,
  LogIn,
  LogOut,
  Lock,
  MessageSquarePlus,
  UserPlus,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PushToggle } from "@/components/PushToggle";
import { signOutAction } from "@/lib/auth-actions";
import { getCurrentProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ITEMS = [
  {
    href: "/sugerir",
    label: "Sugerir un local",
    descripcion: "¿Conocés un lugar que no está en Haku?",
    icon: MessageSquarePlus,
  },
  {
    href: "/sobre",
    label: "Sobre Haku",
    descripcion: "por qué la hicimos.",
    icon: Info,
  },
  {
    href: "/admin",
    label: "Panel de admin",
    descripcion: "solo para el equipo.",
    icon: Lock,
  },
];

export default async function MasPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 max-w-2xl mx-auto">
      <h1
        className="font-serif italic mb-8"
        style={{ fontSize: "2.5rem", color: "var(--fg)" }}
      >
        Más.
      </h1>

      {/* Cuenta */}
      <section className="mb-8">
        <p className="text-section mb-3">— Cuenta —</p>
        {profile ? (
          <div
            className="rounded-card p-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--line)" }}
          >
            <p className="text-xs" style={{ color: "var(--fg-50)" }}>Conectado como</p>
            <p className="font-semibold mt-0.5" style={{ color: "var(--fg)" }}>{profile.display_name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-50)" }}>{profile.email}</p>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm transition-opacity hover:opacity-80"
                style={{ border: "1px solid var(--line-2)", color: "var(--fg-70)" }}
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <div
            className="rounded-card p-4 flex items-center gap-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--line)" }}
          >
            <div
              className="size-12 rounded-full flex items-center justify-center text-xl font-serif italic shrink-0"
              style={{ background: "var(--card-2)", color: "var(--fg-30)" }}
            >
              ¿?
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: "var(--fg-50)" }}>
                Iniciá sesión para dejar reseña.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 rounded-button px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ border: "1px solid var(--line-2)", color: "var(--fg-70)" }}
              >
                <LogIn size={12} />
                Entrar
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-1.5 rounded-button px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--terra)", color: "var(--bg)" }}
              >
                <UserPlus size={12} />
                Crear cuenta
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Notificaciones */}
      {profile && (
        <section className="mb-8">
          <p className="text-section mb-3">— Notificaciones —</p>
          <PushToggle />
        </section>
      )}

      {/* Apariencia */}
      <section className="mb-8">
        <p className="text-section mb-3">— Apariencia —</p>
        <ThemeToggle />
      </section>

      {/* Acciones */}
      <section>
        <p className="text-section mb-3">— Acciones —</p>
        <ul>
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.href} className="row-sep last:border-b-0">
                <Link
                  href={it.href}
                  className="flex items-center gap-4 py-4 transition-opacity active:opacity-70"
                >
                  <span
                    className="size-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--card-2)", color: "var(--terra)" }}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium" style={{ color: "var(--fg)" }}>
                      {it.label}
                    </span>
                    <span
                      className="block text-xs mt-0.5 font-serif italic truncate"
                      style={{ color: "var(--fg-50)" }}
                    >
                      {it.descripcion}
                    </span>
                  </span>
                  <ChevronRight size={16} style={{ color: "var(--fg-30)" }} />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-12 text-center">
        <p
          className="font-serif italic text-2xl"
          style={{ color: "var(--terra)" }}
        >
          Haku.
        </p>
        <p className="text-section mt-1">hecho en catamarca · 2026</p>
      </div>
    </main>
  );
}
