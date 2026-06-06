"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FavResult = { ok: boolean };

/**
 * Fija el estado de favorito de un local para el usuario logueado.
 * Recibe el estado DESEADO (no togglea a ciegas) → idempotente y a prueba de
 * clics rápidos: insertar si `favorito`, borrar si no.
 */
export async function setFavorito(
  lugarId: string,
  favorito: boolean,
): Promise<FavResult> {
  if (!lugarId) return { ok: false };

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  if (favorito) {
    const { error } = await supabase.from("favoritos").upsert(
      { user_id: user.id, lugar_id: lugarId },
      { onConflict: "user_id,lugar_id", ignoreDuplicates: true },
    );
    if (error) return { ok: false };
  } else {
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("user_id", user.id)
      .eq("lugar_id", lugarId);
    if (error) return { ok: false };
  }

  return { ok: true };
}

/**
 * Migra a la cuenta los favoritos que el usuario guardó como invitado
 * (localStorage). Upsert idempotente: re-correr no duplica ni pisa.
 */
export async function migrarFavoritos(
  lugarIds: string[],
): Promise<FavResult> {
  if (!Array.isArray(lugarIds) || lugarIds.length === 0) return { ok: true };

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const rows = lugarIds
    .filter((id) => typeof id === "string" && id.length > 0)
    .map((lugar_id) => ({ user_id: user.id, lugar_id }));
  if (rows.length === 0) return { ok: true };

  const { error } = await supabase.from("favoritos").upsert(rows, {
    onConflict: "user_id,lugar_id",
    ignoreDuplicates: true,
  });
  if (error) return { ok: false };

  return { ok: true };
}
