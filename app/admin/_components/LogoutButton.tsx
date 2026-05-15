export function LogoutButton() {
  return (
    <form action="/admin/logout" method="post">
      <button
        type="submit"
        className="rounded-button border border-white/10 px-3 py-1.5 text-sm text-white/60 hover:bg-bg-tertiary hover:text-white transition-colors"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
