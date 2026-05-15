import { supabase } from "./supabase";
import type { Horario, Lugar, Categoria, TipoComida } from "./types";

export type LugarPublic = Lugar & {
  categoria: Pick<Categoria, "nombre" | "slug" | "emoji"> | null;
  horarios: Pick<
    Horario,
    "dia_semana" | "hora_apertura" | "hora_cierre" | "cerrado" | "cruza_medianoche"
  >[];
  tipos_comida: Pick<TipoComida, "slug" | "nombre">[];
};

export type CategoriaPublic = Pick<Categoria, "id" | "slug" | "nombre" | "emoji">;

export async function listarLugaresActivos(): Promise<LugarPublic[]> {
  const { data, error } = await supabase
    .from("lugares")
    .select(
      `*,
       categoria:categorias(nombre, slug, emoji),
       horarios(dia_semana, hora_apertura, hora_cierre, cerrado, cruza_medianoche),
       tipos_comida(slug, nombre)`,
    )
    .eq("activo", true)
    .order("nombre", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as LugarPublic[];
}

export async function obtenerLugarPorSlug(
  slug: string,
): Promise<LugarPublic | null> {
  const { data, error } = await supabase
    .from("lugares")
    .select(
      `*,
       categoria:categorias(nombre, slug, emoji),
       horarios(dia_semana, hora_apertura, hora_cierre, cerrado, cruza_medianoche),
       tipos_comida(slug, nombre)`,
    )
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as LugarPublic | null;
}

export async function listarCategoriasPublic(): Promise<CategoriaPublic[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, slug, nombre, emoji")
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoriaPublic[];
}
