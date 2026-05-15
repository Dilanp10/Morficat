"use server";

import { createClient } from "@supabase/supabase-js";

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

export async function enviarSugerencia(
  formData: FormData,
): Promise<SugerenciaResult> {
  const tipoRaw = String(formData.get("tipo") ?? "");
  const contenido = String(formData.get("contenido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!VALID_TIPOS.includes(tipoRaw as Tipo)) {
    return { ok: false, error: "Tipo inválido" };
  }
  if (contenido.length < 5) {
    return { ok: false, error: "Contame un poco más (mínimo 5 caracteres)" };
  }
  if (contenido.length > 2000) {
    return { ok: false, error: "Demasiado largo (máximo 2000 caracteres)" };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supa = createClient(url, anon, { auth: { persistSession: false } });
  const { error } = await supa.from("sugerencias").insert({
    tipo: tipoRaw,
    contenido,
    email: email === "" ? null : email,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
