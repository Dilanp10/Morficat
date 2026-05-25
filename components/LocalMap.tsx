"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
} from "react-leaflet";
import { CATAMARCA_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import { estadoConHorario } from "@/lib/horarios";
import type { LugarPublic } from "@/lib/lugares-public";

type Coords = { lat: number; lng: number };

function pinSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path fill="${color}" stroke="white" stroke-width="2"
      d="M14 1C6.8 1 1 6.8 1 14c0 9.5 13 21 13 21s13-11.5 13-21c0-7.2-5.8-13-13-13z"/>
    <circle cx="14" cy="14" r="4.5" fill="white"/>
  </svg>`;
}

function buildIcon(color: string) {
  return L.divIcon({
    html: pinSvg(color),
    className: "haku-pin",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

const iconAbierto = buildIcon("#4CAF82");
const iconCerrado = buildIcon("#E05252");

export default function LocalMap({ lugares }: { lugares: LugarPublic[] }) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const puntos = useMemo(
    () =>
      lugares.map((l) => ({
        lugar: l,
        estado: estadoConHorario(l.horarios, now),
      })),
    [lugares, now],
  );

  return (
    <MapContainer
      center={[CATAMARCA_CENTER.lat, CATAMARCA_CENTER.lng]}
      zoom={DEFAULT_MAP_ZOOM}
      scrollWheelZoom
      className="h-[calc(100vh-9rem)] w-full rounded-card overflow-hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {puntos.map(({ lugar, estado }) => (
        <Marker
          key={lugar.slug}
          position={[lugar.lat, lugar.lng]}
          icon={estado.abierto ? iconAbierto : iconCerrado}
        >
          <Popup>
            <div className="text-foreground">
              <div className="font-semibold text-foreground text-base">
                {lugar.nombre}
              </div>
              {lugar.categoria && (
                <div className="text-xs text-foreground/60 mt-0.5">
                  {lugar.categoria.emoji} {lugar.categoria.nombre}
                  {lugar.barrio ? ` · ${lugar.barrio}` : ""}
                </div>
              )}
              <div className="text-xs mt-1.5">
                <span
                  className={
                    estado.abierto ? "text-success" : "text-danger"
                  }
                >
                  {estado.abierto ? "🟢 Abierto" : "🔴 Cerrado"}
                </span>
                {estado.detalle && (
                  <span className="text-foreground/60"> · {estado.detalle}</span>
                )}
              </div>
              <Link
                href={`/local/${lugar.slug}`}
                className="mt-2 inline-block text-terracota font-medium text-sm"
              >
                Ver ficha →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {coords && (
        <CircleMarker
          center={[coords.lat, coords.lng]}
          radius={8}
          pathOptions={{
            color: "#E07B4C",
            fillColor: "#E07B4C",
            fillOpacity: 0.4,
            weight: 2,
          }}
        />
      )}
    </MapContainer>
  );
}
