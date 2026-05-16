"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { EstrellasDisplay } from "@/components/EstrellasDisplay";
import { EstrellasInput } from "@/components/EstrellasInput";
import { eliminarResena, upsertResena } from "../_actions";

type Resena = {
  id: string;
  puntuacion: number;
  comentario: string | null;
  created_at: string;
  user_id: string;
  autor_nombre: string;
};

type Props = {
  lugarId: string;
  slug: string;
  resenas: Resena[];
  currentUserId: string | null;
  userResena: { puntuacion: number; comentario: string | null } | null;
  promedio: number;
  total: number;
};

function formatFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ResenasSeccion({
  lugarId,
  slug,
  resenas,
  currentUserId,
  userResena,
  promedio,
  total,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  const onSubmit = (fd: FormData) => {
    setError(null);
    startTransition(async () => {
      const r = await upsertResena(fd);
      if (!r.ok) setError(r.error);
      else setEditing(false);
    });
  };

  const onDelete = (fd: FormData) => {
    setError(null);
    startTransition(async () => {
      const r = await eliminarResena(fd);
      if (!r.ok) setError(r.error);
      else setEditing(false);
    });
  };

  const showForm = currentUserId !== null && (!userResena || editing);
  const mostrarRedaccionExistente =
    currentUserId !== null && userResena && !editing;

  return (
    <div className="space-y-4">
      {/* Header con promedio */}
      <div className="rounded-card border border-foreground/10 bg-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/60">Reseñas</p>
          {total > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">
                {promedio.toFixed(1)}
              </span>
              <EstrellasDisplay puntuacion={Math.round(promedio)} size={16} />
              <span className="text-sm text-foreground/60">
                ({total})
              </span>
            </div>
          ) : (
            <p className="text-foreground/60 text-sm mt-1">Sin reseñas aún.</p>
          )}
        </div>
      </div>

      {/* CTA para invitados */}
      {currentUserId === null && (
        <div className="rounded-card border border-foreground/10 bg-card p-4 text-center">
          <p className="text-foreground font-medium">
            ¿Visitaste este lugar?
          </p>
          <p className="text-foreground/60 text-sm mt-1">
            Iniciá sesión o creá una cuenta para dejar tu reseña.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Link
              href={`/login?redirect=/local/${slug}`}
              className="rounded-button border border-foreground/10 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="rounded-button bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-deep transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}

      {/* Resumen reseña propia + editar/eliminar */}
      {mostrarRedaccionExistente && userResena && (
        <div className="rounded-card border border-terracota/40 bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-terracota-soft font-semibold mb-2">
            Tu reseña
          </p>
          <EstrellasDisplay puntuacion={userResena.puntuacion} size={18} />
          {userResena.comentario && (
            <p className="text-foreground/80 mt-2">{userResena.comentario}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-button border border-foreground/10 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Editar
            </button>
            <form action={onDelete}>
              <input type="hidden" name="lugar_id" value={lugarId} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1 rounded-button border border-danger/30 px-3 py-1.5 text-sm text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Form crear/editar */}
      {showForm && (
        <form
          action={onSubmit}
          className="rounded-card border border-foreground/10 bg-card p-4 space-y-3"
        >
          <input type="hidden" name="lugar_id" value={lugarId} />
          <input type="hidden" name="slug" value={slug} />
          <p className="text-sm font-semibold text-foreground">
            {userResena ? "Editar tu reseña" : "Dejar una reseña"}
          </p>
          <EstrellasInput
            name="puntuacion"
            defaultValue={userResena?.puntuacion ?? 0}
          />
          <textarea
            name="comentario"
            defaultValue={userResena?.comentario ?? ""}
            rows={3}
            maxLength={1000}
            placeholder="Contale a otros qué te pareció (opcional)"
            className="w-full rounded-button bg-muted px-3 py-2 text-foreground outline-none ring-1 ring-foreground/10 focus:ring-terracota"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-button bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-deep disabled:opacity-50 transition-colors"
            >
              {pending ? "Guardando..." : userResena ? "Guardar cambios" : "Publicar"}
            </button>
            {userResena && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-button border border-foreground/10 px-4 py-2 text-sm text-foreground/80 hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      {resenas.length > 0 && (
        <ul className="space-y-3">
          {resenas.map((r) => (
            <li
              key={r.id}
              className="rounded-card border border-foreground/10 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{r.autor_nombre}</p>
                <span className="text-xs text-foreground/35">
                  {formatFecha(r.created_at)}
                </span>
              </div>
              <div className="mt-1">
                <EstrellasDisplay puntuacion={r.puntuacion} size={14} />
              </div>
              {r.comentario && (
                <p className="text-foreground/80 mt-2 text-sm">{r.comentario}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
