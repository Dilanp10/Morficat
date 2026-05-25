export function BadgeEstado({
  abierto,
  detalleHorario,
}: {
  abierto: boolean;
  detalleHorario?: string | null;
}) {
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
