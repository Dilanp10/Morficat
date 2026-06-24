/**
 * Skeleton de una card de local. Replica la grilla de `LocalCard`
 * (thumb 64px + 2 líneas de texto + badge) para minimizar el layout shift
 * cuando el contenido real reemplaza al fantasma. Server Component estático.
 */
export function LocalCardSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 row-sep" aria-hidden>
      {/* Thumb */}
      <div
        className="shrink-0 size-16 rounded-[10px] skeleton-block"
      />

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-[19px] w-1/2 rounded skeleton-block" />
        <div className="h-3 w-3/4 rounded skeleton-block" />
        <div className="h-3 w-1/3 rounded skeleton-block" />
      </div>
    </div>
  );
}

/**
 * Lista de N skeletons de card. Útil como contenido de un `loading.tsx`.
 */
export function LocalCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <ul aria-label="Cargando lugares" aria-busy>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <LocalCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
