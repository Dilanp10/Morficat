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
  const { data, error } = await supabase
    .from("resenas")
    .select(
      "id, puntuacion, comentario, created_at, user_id, profile:profiles(display_name)",
    )
    .eq("lugar_id", lugarId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  type Row = {
    id: string;
    puntuacion: number;
    comentario: string | null;
    created_at: string;
    user_id: string;
    profile: { display_name: string } | null;
  };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    puntuacion: r.puntuacion,
    comentario: r.comentario,
    created_at: r.created_at,
    user_id: r.user_id,
    autor_nombre: r.profile?.display_name ?? "Usuario",
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
