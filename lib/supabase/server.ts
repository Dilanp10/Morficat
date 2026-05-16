import "server-only";
import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase server-side con manejo de cookies.
 * Lee la sesión del usuario desde cookies (puesta por el middleware).
 *
 * Usar para: server components, server actions, API routes que necesiten
 * conocer el usuario logueado o escribir como ese usuario (RLS aplica).
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll falla en server components (read-only); el middleware
            // ya refrescó la sesión, así que esto es seguro de ignorar.
          }
        },
      },
    },
  );
}

// React cache: dedup dentro de una misma request (layout + páginas comparten)
export const getCurrentUser = cache(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle();
  return profile
    ? {
        id: user.id,
        email: user.email ?? "",
        display_name: profile.display_name,
      }
    : null;
}
