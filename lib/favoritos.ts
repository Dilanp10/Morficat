import { createSupabaseServerClient } from "./supabase/server";

/**
 * IDs de los locales que el usuario logueado tiene en favoritos.
 * Devuelve `[]` si es invitado o si la tabla aún no existe (degradación suave).
 *
 * RLS ya restringe a las filas del propio usuario; el `.eq` es explícito.
 */
export async function listarFavoritosIds(): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favoritos")
    .select("lugar_id")
    .eq("user_id", user.id);

  if (error) return [];
  return (data ?? []).map((r) => r.lugar_id as string);
}
