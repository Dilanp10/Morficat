export const CATAMARCA_CENTER = {
  lat: -28.4685,
  lng: -65.7795,
} as const;

export const TZ_OFFSET_HOURS = -3;

export const DEFAULT_MAP_ZOOM = 14;

/** Minutos de antelación para avisar que un local está por cerrar / abrir. */
export const MINUTOS_CIERRA_PRONTO = 30;
export const MINUTOS_ABRE_PRONTO = 30;

export const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const ATRIBUTOS_LABELS: Record<string, string> = {
  // Espacio
  terraza: "Terraza",
  mesas_afuera: "Mesas afuera",
  mesas_adentro: "Mesas adentro",
  // Servicios
  wifi: "WiFi",
  aire_acondicionado: "Aire acondicionado",
  estacionamiento: "Estacionamiento",
  tarjetas: "Acepta tarjetas",
  reservas: "Acepta reservas",
  accesible: "Accesible",
  acepta_mascotas: "Acepta mascotas",
  // Música y entretenimiento
  musica_en_vivo: "Música en vivo",
  dj: "DJ",
  karaoke: "Karaoke",
  juegos_ninos: "Juegos para niños",
};
