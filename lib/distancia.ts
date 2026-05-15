const RADIO_TIERRA_KM = 6371;

export function calcularDistanciaKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return RADIO_TIERRA_KM * 2 * Math.asin(Math.sqrt(a));
}

export function formatearDistancia(km: number): string {
  if (km < 1) {
    const metros = Math.round(km * 1000);
    return `${metros}m`;
  }
  return `${km.toFixed(1).replace(".", ",")}km`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
