"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, MoonStar, SearchX } from "lucide-react";
import { LocalCard, type LocalCardData } from "./LocalCard";
import { SearchBar } from "./SearchBar";
import { FiltrosChips } from "./FiltrosChips";
import { FiltrosAvanzados } from "./FiltrosAvanzados";
import { calcularDistanciaKm } from "@/lib/distancia";
import { estadoConHorario } from "@/lib/horarios";
import type { CategoriaPublic, LugarPublic } from "@/lib/lugares-public";

type Coords = { lat: number; lng: number };
type GpsState = "loading" | "granted" | "denied" | "unavailable";

export function HomeListClient({
  lugares,
  categorias,
  autoFocusSearch = false,
}: {
  lugares: LugarPublic[];
  categorias: CategoriaPublic[];
  autoFocusSearch?: boolean;
}) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [gpsState, setGpsState] = useState<GpsState>("loading");
  const [soloAbiertos, setSoloAbiertos] = useState(true);
  const [categoriaSlug, setCategoriaSlug] = useState<string | null>(null);
  const [atributosOn, setAtributosOn] = useState<Set<string>>(new Set());
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsState("unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsState("granted");
      },
      () => setGpsState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  type Enriched = {
    lugar: LugarPublic;
    card: LocalCardData;
  };

  const enriquecidos: Enriched[] = useMemo(() => {
    return lugares.map((l) => {
      const estado = estadoConHorario(l.horarios, now);
      const distanciaKm = coords
        ? calcularDistanciaKm(coords.lat, coords.lng, l.lat, l.lng)
        : null;
      const ratings = (l.resenas ?? []).map((r) => r.puntuacion);
      const ratingCount = ratings.length;
      const ratingPromedio =
        ratingCount > 0
          ? Math.round((ratings.reduce((s, p) => s + p, 0) / ratingCount) * 10) /
            10
          : null;
      return {
        lugar: l,
        card: {
          slug: l.slug,
          nombre: l.nombre,
          imagen_principal: l.imagen_principal,
          categoria_nombre: l.categoria?.nombre ?? null,
          categoria_emoji: l.categoria?.emoji ?? null,
          barrio: l.barrio,
          abierto: estado.abierto,
          detalleHorario: estado.detalle,
          distanciaKm,
          ratingPromedio,
          ratingCount,
        },
      };
    });
  }, [lugares, coords, now]);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriquecidos
      .filter(({ lugar, card }) => {
        if (soloAbiertos && !card.abierto) return false;
        if (categoriaSlug && lugar.categoria?.slug !== categoriaSlug)
          return false;
        if (atributosOn.size > 0) {
          for (const attr of atributosOn) {
            if (!lugar.atributos[attr as keyof typeof lugar.atributos])
              return false;
          }
        }
        if (q) {
          const haystack = [
            lugar.nombre,
            lugar.categoria?.nombre ?? "",
            ...(lugar.tipos_comida ?? []).map((t) => t.nombre),
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ad = a.card.distanciaKm;
        const bd = b.card.distanciaKm;
        if (ad !== null && bd !== null) return ad - bd;
        return a.card.nombre.localeCompare(b.card.nombre);
      });
  }, [enriquecidos, soloAbiertos, categoriaSlug, atributosOn, query]);

  const totalAbiertos = enriquecidos.filter((e) => e.card.abierto).length;
  const sinResultados =
    filtrados.length === 0 && enriquecidos.length > 0;

  if (enriquecidos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p style={{ color: "var(--fg-30)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
          Todavía no hay lugares cargados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} autoFocus={autoFocusSearch} />

      <FiltrosChips
        soloAbiertos={soloAbiertos}
        onToggleAbiertos={() => setSoloAbiertos((v) => !v)}
        categoriaSlug={categoriaSlug}
        onSelectCategoria={setCategoriaSlug}
        categorias={categorias}
        atributosCount={atributosOn.size}
        onOpenAvanzados={() => setFiltrosAbiertos((v) => !v)}
      />

      <FiltrosAvanzados
        open={filtrosAbiertos}
        atributosOn={atributosOn}
        onChange={setAtributosOn}
        onClose={() => setFiltrosAbiertos(false)}
      />

      <div
        className="flex items-center justify-between gap-3 py-1"
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-30)" }}
      >
        <span>{filtrados.length} resultado{filtrados.length === 1 ? "" : "s"}</span>
        <span>
          <span style={{ color: "var(--moss)" }}>{totalAbiertos}</span>
          {" "}abierto{totalAbiertos === 1 ? "" : "s"}
          {" · "}{enriquecidos.length} total
        </span>
      </div>

      {gpsState === "denied" && (
        <div
          className="rounded-button px-3 py-2 text-xs flex items-center gap-2"
          style={{ background: "var(--card-2)", color: "var(--fg-50)", border: "1px solid var(--line)" }}
        >
          <MapPin size={13} />
          Activá la ubicación para ver distancias.
        </div>
      )}

      {sinResultados ? (
        <EmptyState
          soloAbiertos={soloAbiertos}
          hasQuery={query.trim().length > 0}
          onReset={() => {
            setSoloAbiertos(false);
            setCategoriaSlug(null);
            setAtributosOn(new Set());
            setQuery("");
          }}
        />
      ) : (
        <ul>
          {filtrados.map(({ card }, idx) => (
            <li key={card.slug}>
              <LocalCard data={card} priority={idx === 0} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  soloAbiertos,
  hasQuery,
  onReset,
}: {
  soloAbiertos: boolean;
  hasQuery: boolean;
  onReset: () => void;
}) {
  const Icon = hasQuery ? SearchX : soloAbiertos ? MoonStar : SearchX;
  const titulo = hasQuery
    ? "No encontramos lugares con ese nombre."
    : soloAbiertos
      ? "No hay locales abiertos ahora."
      : "Ningún lugar coincide con los filtros.";
  const sub = hasQuery
    ? "Probá con otra palabra o sacá los filtros."
    : soloAbiertos
      ? "Tocá 'Limpiar filtros' para ver todos."
      : null;
  return (
    <div className="py-16 text-center animate-fade-in-up">
      <p
        className="font-serif italic text-xl"
        style={{ color: "var(--fg-50)" }}
      >
        {titulo}
      </p>
      {sub && (
        <p className="text-sm mt-1" style={{ color: "var(--fg-30)" }}>
          {sub}
        </p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-button px-4 py-2 text-sm font-medium transition-colors"
        style={{ background: "var(--terra)", color: "#1B1612" }}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
