"use server";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase";

const VALID_TIPOS = [
  "nuevo_local",
  "error_horario",
  "local_cerrado",
  "otro",
] as const;
type Tipo = (typeof VALID_TIPOS)[number];

export type SugerenciaResult =
  | { ok: true }
  | { ok: false; error: string };

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

async function uploadToSugerenciasBucket(
  file: File,
  kind: "foto" | "audio",
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("El archivo es demasiado grande (máx 25 MB).");
  }
  const supabase = getSupabaseAdmin();
  const ext =
    file.name.split(".").pop()?.toLowerCase() ??
    (kind === "foto" ? "jpg" : "webm");
  const filename = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("sugerencias")
    .upload(filename, file, {
      contentType: file.type || (kind === "foto" ? "image/jpeg" : "audio/webm"),
      upsert: false,
    });
  if (upErr) throw new Error(`Error subiendo ${kind}: ${upErr.message}`);
  const { data } = supabase.storage.from("sugerencias").getPublicUrl(filename);
  return data.publicUrl;
}

export async function enviarSugerencia(
  formData: FormData,
): Promise<SugerenciaResult> {
  const tipoRaw = String(formData.get("tipo") ?? "nuevo_local");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const comentario = String(formData.get("comentario") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!VALID_TIPOS.includes(tipoRaw as Tipo)) {
    return { ok: false, error: "Tipo inválido." };
  }
  if (!nombre || nombre.length < 2) {
    return { ok: false, error: "Necesitamos al menos el nombre del lugar." };
  }
  if (nombre.length > 120) {
    return { ok: false, error: "El nombre es demasiado largo." };
  }
  if (comentario.length > 2000) {
    return { ok: false, error: "El comentario es demasiado largo." };
  }

  // Construir el "contenido" combinando los datos del wizard.
  // Esto mantiene compatibilidad con el admin que lee `contenido` como texto.
  const lines: string[] = [`Nombre: ${nombre}`];
  if (categoria) lines.push(`Tipo: ${categoria}`);
  if (direccion) lines.push(`Dónde: ${direccion}`);
  if (comentario) lines.push(`\n${comentario}`);
  const contenido = lines.join("\n");

  // Subir archivos si vinieron
  let foto_url: string | null = null;
  let audio_url: string | null = null;
  try {
    const foto = formData.get("foto");
    if (foto instanceof File && foto.size > 0) {
      foto_url = await uploadToSugerenciasBucket(foto, "foto");
    }
    const audio = formData.get("audio");
    if (audio instanceof File && audio.size > 0) {
      audio_url = await uploadToSugerenciasBucket(audio, "audio");
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error subiendo archivo" };
  }

  // INSERT con anon (RLS allow). Usar service_role no es necesario.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createClient(url, anon, { auth: { persistSession: false } });

  // Solo incluir foto_url/audio_url si tienen valor.
  // Así, si las columnas todavía no fueron agregadas a la DB, el INSERT no
  // falla mientras el usuario no haya subido nada.
  const row: Record<string, unknown> = {
    tipo: tipoRaw,
    contenido,
    email: email === "" ? null : email,
  };
  if (foto_url) row.foto_url = foto_url;
  if (audio_url) row.audio_url = audio_url;

  const { error } = await supa.from("sugerencias").insert(row);
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
