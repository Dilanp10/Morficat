"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { migrarFavoritos, setFavorito } from "@/app/_actions/favoritos";

const STORAGE_KEY = "haku_favoritos";

type FavoritosContextValue = {
  /** true cuando el estado ya está hidratado (server o dispositivo). */
  ready: boolean;
  count: number;
  esFavorito: (lugarId: string) => boolean;
  toggle: (lugarId: string) => void;
};

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

function leerLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function escribirLocal(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // almacenamiento lleno o bloqueado — noop
  }
}

function limpiarLocal() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

/**
 * Provee el estado de favoritos a toda la app (híbrido invitado + cuenta).
 *
 * - Invitado: fuente de verdad = localStorage del dispositivo.
 * - Logueado: fuente de verdad = Supabase (sembrado en SSR vía
 *   `initialFavoritos`); cada toggle persiste con una server action de forma
 *   optimista (revierte si falla). Al montar, migra los favoritos que el
 *   usuario hubiera guardado como invitado y limpia el dispositivo.
 */
export function FavoritosProvider({
  children,
  initialFavoritos = [],
  isAuthenticated = false,
}: {
  children: React.ReactNode;
  initialFavoritos?: string[];
  isAuthenticated?: boolean;
}) {
  const [favoritos, setFavoritos] = useState<Set<string>>(
    () => new Set(initialFavoritos),
  );
  // Logueado: ya tenemos los datos del server → listo sin parpadeo.
  // Invitado: esperamos a leer localStorage tras montar.
  const [ready, setReady] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // Invitado: hidratar desde el dispositivo.
      setFavoritos(new Set(leerLocal()));
      setReady(true);
      return;
    }

    // Logueado: migrar lo guardado como invitado, si hay.
    const localIds = leerLocal();
    if (localIds.length === 0) return;

    setFavoritos((prev) => new Set([...prev, ...localIds])); // merge optimista
    migrarFavoritos(localIds)
      .then((res) => {
        if (res.ok) limpiarLocal();
      })
      .catch(() => {
        // Se mantiene localStorage para reintentar en la próxima carga.
      });
  }, [isAuthenticated]);

  const persistir = useCallback((lugarId: string, favorito: boolean) => {
    setFavorito(lugarId, favorito)
      .then((res) => {
        if (!res.ok) revertir(lugarId, favorito);
      })
      .catch(() => revertir(lugarId, favorito));

    function revertir(id: string, intentado: boolean) {
      setFavoritos((prev) => {
        const next = new Set(prev);
        if (intentado) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  }, []);

  const toggle = useCallback(
    (lugarId: string) => {
      const willBeFav = !favoritos.has(lugarId);

      setFavoritos((prev) => {
        const next = new Set(prev);
        if (willBeFav) next.add(lugarId);
        else next.delete(lugarId);
        if (!isAuthenticated) escribirLocal(Array.from(next));
        return next;
      });

      if (isAuthenticated) persistir(lugarId, willBeFav);
    },
    [favoritos, isAuthenticated, persistir],
  );

  const value = useMemo<FavoritosContextValue>(
    () => ({
      ready,
      count: favoritos.size,
      esFavorito: (id) => favoritos.has(id),
      toggle,
    }),
    [favoritos, ready, toggle],
  );

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos(): FavoritosContextValue {
  const ctx = useContext(FavoritosContext);
  if (!ctx) {
    throw new Error("useFavoritos debe usarse dentro de <FavoritosProvider>");
  }
  return ctx;
}
