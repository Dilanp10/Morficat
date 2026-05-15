import "server-only";

import { getSupabaseAdmin } from "./supabase";
import type {
  Categoria,
  Horario,
  Lugar,
  LugarConRelaciones,
  TipoComida,
} from "./types";

export async function listarLugaresAdmin(): Promise<
  Array<Lugar & { categoria: Pick<Categoria, "nombre" | "emoji"> | null }>
> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("lugares")
    .select(
      "*, categoria:categorias(nombre, emoji)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Array<
    Lugar & { categoria: Pick<Categoria, "nombre" | "emoji"> | null }
  >;
}

export async function obtenerLugarParaEditar(
  id: string,
): Promise<LugarConRelaciones | null> {
  const supabase = getSupabaseAdmin();
  const { data: lugar, error } = await supabase
    .from("lugares")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!lugar) return null;

  const [{ data: horarios }, { data: tipos }] = await Promise.all([
    supabase.from("horarios").select("*").eq("lugar_id", id),
    supabase
      .from("lugar_tipos_comida")
      .select("tipo_comida_id")
      .eq("lugar_id", id),
  ]);

  return {
    ...(lugar as Lugar),
    horarios: (horarios ?? []) as Horario[],
    tipos_comida: ((tipos ?? []) as { tipo_comida_id: string }[]).map((t) => ({
      id: t.tipo_comida_id,
    })) as unknown as TipoComida[],
  };
}

export async function listarCategorias(): Promise<Categoria[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Categoria[];
}

export async function listarTiposComida(): Promise<TipoComida[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tipos_comida")
    .select("*")
    .eq("activo", true)
    .order("nombre", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TipoComida[];
}

export async function slugDisponible(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  let q = supabase.from("lugares").select("id").eq("slug", slug);
  if (exceptId) q = q.neq("id", exceptId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return !data;
}
