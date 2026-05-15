export function BadgeEstado({ abierto }: { abierto: boolean }) {
  const cls = abierto
    ? "bg-success/15 text-success"
    : "bg-danger/15 text-danger";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-wide ${cls}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          abierto ? "bg-success animate-soft-pulse" : "bg-danger"
        }`}
      />
      {abierto ? "Abierto" : "Cerrado"}
    </span>
  );
}
