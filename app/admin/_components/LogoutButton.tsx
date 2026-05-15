export function LogoutButton() {
  return (
    <form action="/admin/logout" method="post">
      <button
        type="submit"
        className="rounded-button border border-foreground/10 px-3 py-1.5 text-sm text-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
