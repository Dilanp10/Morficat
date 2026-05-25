import Link from "next/link";
import { ChevronLeft, Inbox, Plus } from "lucide-react";
import { listarLugaresAdmin, listarSugerencias } from "@/lib/admin-data";
import { ActivoBadge } from "./_components/ActivoBadge";
import { LogoutButton } from "./_components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [lugares, sugerencias] = await Promise.all([
    listarLugaresAdmin(),
    listarSugerencias(),
  ]);
  const pendientes = sugerencias.filter((s) => !s.revisado).length;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
      >
        <ChevronLeft size={16} />
        Volver a Haku
      </Link>

      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-terracota">Admin</h1>
          <p className="text-foreground/60 text-sm">
            {lugares.length} lugar{lugares.length === 1 ? "" : "es"} cargado
            {lugares.length === 1 ? "" : "s"}
          </p>
        </div>
        <LogoutButton />
      </header>

      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/admin/lugar/new"
          className="inline-flex items-center gap-2 rounded-button bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-deep transition-colors"
        >
          <Plus size={16} />
          Nuevo lugar
        </Link>
        <Link
          href="/admin/sugerencias"
          className="relative inline-flex items-center gap-2 rounded-button border border-foreground/15 bg-card px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Inbox size={16} />
          Sugerencias
          {pendientes > 0 && (
            <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-5 rounded-full bg-terracota text-[10px] font-bold text-white">
              {pendientes}
            </span>
          )}
        </Link>
      </div>

      {lugares.length === 0 ? (
        <div className="rounded-card border border-foreground/10 bg-card p-8 text-center text-foreground/60">
          Todavía no hay lugares cargados. Empezá creando el primero.
        </div>
      ) : (
        <div className="rounded-card border border-foreground/10 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-foreground/60">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  Categoría
                </th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lugares.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-foreground/10 hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{l.nombre}</div>
                    <div className="text-xs text-foreground/35">{l.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground/60 hidden sm:table-cell">
                    {l.categoria
                      ? `${l.categoria.emoji ?? ""} ${l.categoria.nombre}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ActivoBadge activo={l.activo} />
                    {l.data_temporal && (
                      <span className="ml-2 text-xs text-foreground/35">
                        · temporal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/lugar/${l.id}`}
                      className="text-terracota hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
