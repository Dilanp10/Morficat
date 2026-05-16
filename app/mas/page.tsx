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
import { signOutAction } from "@/lib/auth-actions";
import { getCurrentProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ITEMS = [
  {
    href: "/sugerir",
    label: "Sugerir un local",
    descripcion: "¿Conocés un lugar que no está en MorfiCat?",
    icon: MessageSquarePlus,
  },
  {
    href: "/sobre",
    label: "Sobre MorfiCat",
    descripcion: "Qué es la app y por qué la hicimos.",
    icon: Info,
  },
  {
    href: "/admin",
    label: "Panel de admin",
    descripcion: "Sólo para el equipo (requiere contraseña).",
    icon: Lock,
  },
];

export default async function MasPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-terracota mb-5">Más</h1>

      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-2">
          Cuenta
        </h2>
        {profile ? (
          <div className="rounded-card border border-foreground/10 bg-card p-4">
            <p className="text-sm text-foreground/60">Conectado como</p>
            <p className="font-semibold text-foreground">{profile.display_name}</p>
            <p className="text-xs text-foreground/60 mt-0.5">{profile.email}</p>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-button border border-foreground/10 px-3 py-1.5 text-sm text-foreground/80 hover:bg-muted transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 rounded-button border border-foreground/10 bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LogIn size={14} />
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-button bg-terracota px-3 py-2.5 text-sm font-medium text-white hover:bg-terracota-deep transition-colors"
            >
              <UserPlus size={14} />
              Crear cuenta
            </Link>
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-2">
          Apariencia
        </h2>
        <ThemeToggle />
      </section>

      <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-2">
        Acciones
      </h2>
      <ul className="space-y-2">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className="flex items-center gap-3 rounded-card border border-foreground/10 bg-card px-4 py-3 hover:bg-muted transition-colors"
              >
                <span className="text-foreground/60">
                  <Icon size={20} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-foreground">
                    {it.label}
                  </span>
                  <span className="block text-xs text-foreground/60 truncate">
                    {it.descripcion}
                  </span>
                </span>
                <ChevronRight size={18} className="text-foreground/35" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-foreground/35 text-center">
        MorfiCat · Catamarca, Argentina
      </p>
    </main>
  );
}
