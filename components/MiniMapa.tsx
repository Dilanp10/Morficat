"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path fill="#E07B4C" stroke="white" stroke-width="2"
    d="M14 1C6.8 1 1 6.8 1 14c0 9.5 13 21 13 21s13-11.5 13-21c0-7.2-5.8-13-13-13z"/>
  <circle cx="14" cy="14" r="4.5" fill="white"/>
</svg>`;

const icon = L.divIcon({
  html: pinSvg,
  className: "morficat-pin",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

export default function MiniMapa({
  lat,
  lng,
  zoom = 16,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="h-48 w-full rounded-card overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon} />
    </MapContainer>
  );
}
