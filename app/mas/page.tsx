import Link from "next/link";
import {
  ChevronRight,
  Info,
  Lock,
  MessageSquarePlus,
} from "lucide-react";

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

export default function MasPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-terracota mb-5">Más</h1>

      <ul className="space-y-2">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className="flex items-center gap-3 rounded-card border border-white/10 bg-bg-elevated px-4 py-3 hover:bg-bg-tertiary transition-colors"
              >
                <span className="text-white/60">
                  <Icon size={20} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-white">
                    {it.label}
                  </span>
                  <span className="block text-xs text-white/60 truncate">
                    {it.descripcion}
                  </span>
                </span>
                <ChevronRight size={18} className="text-white/35" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-white/35 text-center">
        MorfiCat · Catamarca, Argentina
      </p>
    </main>
  );
}
