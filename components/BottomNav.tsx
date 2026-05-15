"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Menu, Search } from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: typeof Home;
  isActive: (path: string) => boolean;
};

const TABS: Tab[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    isActive: (p) => p === "/" || p.startsWith("/local"),
  },
  {
    href: "/buscar",
    label: "Buscar",
    icon: Search,
    isActive: (p) => p === "/buscar",
  },
  {
    href: "/mapa",
    label: "Mapa",
    icon: Map,
    isActive: (p) => p === "/mapa",
  },
  {
    href: "/mas",
    label: "Más",
    icon: Menu,
    isActive: (p) =>
      p === "/mas" || p === "/sobre" || p === "/sugerir",
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-bg-base/95 backdrop-blur safe-pb"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch">
        {TABS.map((t) => {
          const active = t.isActive(pathname);
          const Icon = t.icon;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                  active ? "text-terracota" : "text-white/60 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
