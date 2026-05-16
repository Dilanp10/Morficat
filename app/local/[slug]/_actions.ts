"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ResenaResult =
  | { ok: true }
  | { ok: false; error: string };

export async function upsertResena(
  formData: FormData,
): Promise<ResenaResult> {
  const lugarId = String(formData.get("lugar_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const puntuacion = parseInt(String(formData.get("puntuacion") ?? "0"), 10);
  const comentario = String(formData.get("comentario") ?? "").trim();

  if (!lugarId) return { ok: false, error: "Lugar inválido." };
  if (!Number.isFinite(puntuacion) || puntuacion < 1 || puntuacion > 5) {
    return { ok: false, error: "Tocá una estrella primero." };
  }
  if (comentario.length > 1000) {
    return { ok: false, error: "El comentario es demasiado largo." };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Necesitás iniciar sesión." };

  const { error } = await supabase.from("resenas").upsert(
    {
      lugar_id: lugarId,
      user_id: user.id,
      puntuacion,
      comentario: comentario === "" ? null : comentario,
    },
    { onConflict: "lugar_id,user_id" },
  );

  if (error) return { ok: false, error: error.message };

  if (slug) revalidatePath(`/local/${slug}`);
  revalidatePath("/");
  return { ok: true };
}

export async function eliminarResena(
  formData: FormData,
): Promise<ResenaResult> {
  const lugarId = String(formData.get("lugar_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!lugarId) return { ok: false, error: "Lugar inválido." };

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Necesitás iniciar sesión." };

  const { error } = await supabase
    .from("resenas")
    .delete()
    .eq("lugar_id", lugarId)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };

  if (slug) revalidatePath(`/local/${slug}`);
  revalidatePath("/");
  return { ok: true };
}
