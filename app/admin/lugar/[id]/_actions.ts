"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { cruzaMedianoche } from "@/lib/horarios";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import type { Atributos } from "@/lib/types";

type HorarioForm = {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  cerrado: boolean;
  cruza_medianoche: boolean;
};

const ATRIBUTO_KEYS = [
  "terraza",
  "mesas_afuera",
  "mesas_adentro",
  "estacionamiento",
  "wifi",
  "acepta_mascotas",
  "accesible",
] as const;

function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}

function txt(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function nullableTxt(v: FormDataEntryValue | null): string | null {
  const s = txt(v);
  return s === "" ? null : s;
}

export async function saveLugar(formData: FormData): Promise<void> {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  const id = txt(formData.get("id"));
  const esNuevo = !id || id === "new";

  const nombre = txt(formData.get("nombre"));
  if (!nombre) throw new Error("El nombre es requerido");

  const slug = slugify(txt(formData.get("slug")) || nombre);
  if (!slug) throw new Error("No se pudo generar un slug válido a partir del nombre");

  const lat = parseFloat(txt(formData.get("lat")));
  const lng = parseFloat(txt(formData.get("lng")));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Latitud y longitud son requeridas");
  }
  // Argentina bounding box (sanity check — atrapa coordenadas sin signo menos)
  if (lat > -21 || lat < -56 || lng > -53 || lng < -74) {
    throw new Error(
      `Las coordenadas (${lat}, ${lng}) están fuera de Argentina. ¿Te olvidaste el signo menos? Catamarca está en lat negativa (~-28) y lng negativa (~-65).`,
    );
  }

  const atributos: Atributos = {};
  for (const key of ATRIBUTO_KEYS) {
    atributos[key] = bool(formData.get(`atributos.${key}`));
  }

  const direccion = txt(formData.get("direccion"));
  if (!direccion) throw new Error("La dirección es requerida");

  const categoriaIdRaw = txt(formData.get("categoria_id"));
  const categoria_id = categoriaIdRaw === "" ? null : categoriaIdRaw;

  let imagen_principal: string | null = nullableTxt(
    formData.get("imagen_principal_existing"),
  );
  const archivo = formData.get("imagen");
  if (archivo instanceof File && archivo.size > 0) {
    const ext = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${slug}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("lugares")
      .upload(filename, archivo, {
        contentType: archivo.type || "image/jpeg",
        upsert: false,
      });
    if (upErr) throw new Error(`Error subiendo imagen: ${upErr.message}`);
    const { data } = supabase.storage.from("lugares").getPublicUrl(filename);
    imagen_principal = data.publicUrl;
  }

  const payload = {
    nombre,
    slug,
    descripcion: nullableTxt(formData.get("descripcion")),
    categoria_id,
    direccion,
    barrio: nullableTxt(formData.get("barrio")),
    lat,
    lng,
    telefono: nullableTxt(formData.get("telefono")),
    whatsapp: nullableTxt(formData.get("whatsapp")),
    instagram: nullableTxt(formData.get("instagram")),
    facebook: nullableTxt(formData.get("facebook")),
    imagen_principal,
    atributos,
    activo: bool(formData.get("activo")),
    verificado: bool(formData.get("verificado")),
    data_temporal: bool(formData.get("data_temporal")),
  };

  let lugarId: string;
  if (esNuevo) {
    const { data, error } = await supabase
      .from("lugares")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(`Error creando lugar: ${error.message}`);
    lugarId = data.id;
  } else {
    const { error } = await supabase
      .from("lugares")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(`Error actualizando lugar: ${error.message}`);
    lugarId = id;
  }

  const horariosJson = txt(formData.get("horarios_json"));
  let horarios: HorarioForm[] = [];
  if (horariosJson) {
    try {
      horarios = JSON.parse(horariosJson);
    } catch {
      throw new Error("Horarios inválidos");
    }
  }

  await supabase.from("horarios").delete().eq("lugar_id", lugarId);
  if (horarios.length > 0) {
    const rows = horarios.map((h) => ({
      lugar_id: lugarId,
      dia_semana: h.dia_semana,
      hora_apertura: h.hora_apertura,
      hora_cierre: h.hora_cierre,
      cerrado: h.cerrado,
      // Normalizar: si el cierre es menor que la apertura, fuerza cruza_medianoche.
      // Evita que el admin tenga que recordar el checkbox.
      cruza_medianoche: cruzaMedianoche(
        h.hora_apertura,
        h.hora_cierre,
        h.cruza_medianoche,
      ),
    }));
    const { error: hErr } = await supabase.from("horarios").insert(rows);
    if (hErr) throw new Error(`Error guardando horarios: ${hErr.message}`);
  }

  const tiposIds = formData.getAll("tipos_comida").map(String).filter(Boolean);
  await supabase.from("lugar_tipos_comida").delete().eq("lugar_id", lugarId);
  if (tiposIds.length > 0) {
    const rows = tiposIds.map((tipoId) => ({
      lugar_id: lugarId,
      tipo_comida_id: tipoId,
    }));
    const { error: tErr } = await supabase
      .from("lugar_tipos_comida")
      .insert(rows);
    if (tErr) throw new Error(`Error guardando tipos de comida: ${tErr.message}`);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/lugar/${lugarId}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function toggleActivo(id: string, activo: boolean): Promise<void> {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("lugares")
    .update({ activo })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/lugar/${id}`);
}
