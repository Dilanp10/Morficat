import Link from "next/link";
import { ChevronLeft, CheckCheck, Clock, Mail, Volume2 } from "lucide-react";
import { listarSugerencias } from "@/lib/admin-data";
import { toggleRevisadaAction } from "./_actions";

export const dynamic = "force-dynamic";

const TIPO_LABELS: Record<string, string> = {
  nuevo_local: "Nuevo lugar",
  error_horario: "Error en horario",
  local_cerrado: "Local cerrado",
  otro: "Otro",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SugerenciasAdminPage() {
  const sugerencias = await listarSugerencias();
  const pendientes = sugerencias.filter((s) => !s.revisado).length;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
      >
        <ChevronLeft size={16} />
        Volver al admin
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-terracota">Sugerencias</h1>
        <p className="text-foreground/60 text-sm mt-0.5">
          {pendientes > 0
            ? `${pendientes} pendiente${pendientes === 1 ? "" : "s"} · ${sugerencias.length} total`
            : `${sugerencias.length} total · todas revisadas`}
        </p>
      </header>

      {sugerencias.length === 0 ? (
        <div className="rounded-card border border-foreground/10 bg-card p-8 text-center text-foreground/60">
          Todavía no llegaron sugerencias.
        </div>
      ) : (
        <ul className="space-y-3">
          {sugerencias.map((s) => {
            const fotos = s.foto_url
              ? s.foto_url.split("|").filter(Boolean)
              : [];

            return (
              <li
                key={s.id}
                className={`rounded-card border bg-card p-4 space-y-3 transition-opacity ${
                  s.revisado
                    ? "border-foreground/10 opacity-60"
                    : "border-terracota/30"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span
                      className={`inline-flex rounded-pill px-2.5 py-0.5 text-xs font-medium ${
                        s.revisado
                          ? "bg-muted text-foreground/50"
                          : "bg-terracota/15 text-terracota"
                      }`}
                    >
                      {TIPO_LABELS[s.tipo] ?? s.tipo}
                    </span>
                    <p className="text-xs text-foreground/40 flex items-center gap-1">
                      <Clock size={11} />
                      {formatFecha(s.created_at)}
                    </p>
                  </div>

                  {/* Botón toggle revisado */}
                  <form
                    action={async () => {
                      "use server";
                      await toggleRevisadaAction(s.id, !s.revisado);
                    }}
                  >
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-medium transition-colors ${
                        s.revisado
                          ? "bg-muted text-foreground/60 hover:bg-card hover:ring-1 hover:ring-foreground/15"
                          : "bg-success/15 text-success hover:bg-success/25"
                      }`}
                    >
                      <CheckCheck size={13} />
                      {s.revisado ? "Marcar pendiente" : "Marcar revisada"}
                    </button>
                  </form>
                </div>

                {/* Contenido */}
                <p className="text-sm text-foreground/80 whitespace-pre-line">
                  {s.contenido}
                </p>

                {/* Email */}
                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    className="inline-flex items-center gap-1.5 text-xs text-terracota hover:underline"
                  >
                    <Mail size={12} />
                    {s.email}
                  </a>
                )}

                {/* Fotos */}
                {fotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {fotos.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square overflow-hidden rounded-button hover:opacity-90 transition-opacity"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}

                {/* Audio */}
                {s.audio_url && (
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-foreground/40 shrink-0" />
                    <audio
                      controls
                      src={s.audio_url}
                      className="h-8 w-full max-w-xs"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
