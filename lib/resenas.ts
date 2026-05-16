import { supabase } from "./supabase";
import { createSupabaseServerClient, getCurrentUser } from "./supabase/server";

export type ResenaPublica = {
  id: string;
  puntuacion: number;
  comentario: string | null;
  created_at: string;
  user_id: string;
  autor_nombre: string;
};

export async function listarResenasPorLugar(
  lugarId: string,
): Promise<ResenaPublica[]> {
  // Paso 1: obtener las reseñas (sin embed de profiles — no hay FK directa
  // entre resenas y profiles; ambas referencian auth.users).
  const { data: reviews, error: revErr } = await supabase
    .from("resenas")
    .select("id, puntuacion, comentario, created_at, user_id")
    .eq("lugar_id", lugarId)
    .order("created_at", { ascending: false });
  if (revErr) throw revErr;
  if (!reviews || reviews.length === 0) return [];

  // Paso 2: obtener los profiles de los autores en un solo round-trip.
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id)));
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);
  if (profErr) throw profErr;

  const nombrePorId = new Map<string, string>();
  for (const p of profiles ?? []) {
    nombrePorId.set(p.id as string, p.display_name as string);
  }

  return reviews.map((r) => ({
    id: r.id as string,
    puntuacion: r.puntuacion as number,
    comentario: r.comentario as string | null,
    created_at: r.created_at as string,
    user_id: r.user_id as string,
    autor_nombre: nombrePorId.get(r.user_id as string) ?? "Usuario",
  }));
}

export async function obtenerResenaUsuario(
  lugarId: string,
): Promise<{ puntuacion: number; comentario: string | null } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabaseSSR = createSupabaseServerClient();
  const { data, error } = await supabaseSSR
    .from("resenas")
    .select("puntuacion, comentario")
    .eq("lugar_id", lugarId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return null;
  return data
    ? { puntuacion: data.puntuacion, comentario: data.comentario }
    : null;
}

export function calcularPromedio(
  puntuaciones: number[],
): { promedio: number; total: number } {
  if (puntuaciones.length === 0) return { promedio: 0, total: 0 };
  const sum = puntuaciones.reduce((s, p) => s + p, 0);
  return {
    promedio: Math.round((sum / puntuaciones.length) * 10) / 10,
    total: puntuaciones.length,
  };
}
