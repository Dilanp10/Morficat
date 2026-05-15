export function ActivoBadge({ activo }: { activo: boolean }) {
  const cls = activo
    ? "bg-success/15 text-success"
    : "bg-danger/15 text-danger";
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}
