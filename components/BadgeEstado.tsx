export function BadgeEstado({
  abierto,
  detalleHorario,
  cierraPronto = false,
  abrePronto = false,
  minutos = null,
}: {
  abierto: boolean;
  detalleHorario?: string | null;
  cierraPronto?: boolean;
  abrePronto?: boolean;
  minutos?: number | null;
}) {
  // Estado "pronto": ámbar (ochre) con cuenta regresiva.
  if ((abierto && cierraPronto) || (!abierto && abrePronto)) {
    const verbo = cierraPronto ? "Cierra" : "Abre";
    const texto = minutos != null ? `${verbo} en ${minutos} min` : `${verbo} pronto`;
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-ochre" />
        <span className="font-mono text-xs tracking-wide text-ochre">{texto}</span>
      </span>
    );
  }

  // Estado normal.
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
          abierto ? "bg-moss animate-soft-pulse" : "bg-rust"
        }`}
      />
      <span
        className={`font-mono text-xs tracking-wide ${
          abierto ? "text-moss" : "text-rust"
        }`}
      >
        {abierto ? "Abierto" : "Cerrado"}
      </span>
      {detalleHorario && (
        <span className="font-mono text-xs" style={{ color: "var(--fg-50)" }}>
          · {detalleHorario}
        </span>
      )}
    </span>
  );
}
