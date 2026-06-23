// Supabase Edge Function: push-cron
// Corre cada 5 min (vía pg_cron). Chequea favoritos y manda push "abre pronto".

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;
const MINUTOS_ABRE_PRONTO = 30;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function parseHora(hora: string): number {
  const [h, m] = hora.split(":");
  return parseInt(h) * 60 + parseInt(m);
}

Deno.serve(async () => {
  try {
    // Hora actual en Argentina (UTC-3)
    const nowUtc = new Date();
    const arg = new Date(nowUtc.getTime() - 3 * 60 * 60 * 1000);
    const dow = arg.getUTCDay();
    const nowMin = arg.getUTCHours() * 60 + arg.getUTCMinutes();
    const today = arg.toISOString().slice(0, 10);

    // 1. Obtener todas las subscripciones con sus favoritos y horarios
    const { data: subs, error: subsError } = await supabase
      .from("push_subscriptions")
      .select("user_id, endpoint, p256dh, auth");

    if (subsError || !subs?.length) {
      return new Response("no subs", { status: 200 });
    }

    // 2. Por cada usuario, obtener sus favoritos
    const userIds = [...new Set(subs.map((s) => s.user_id))];

    const { data: favs, error: favsError } = await supabase
      .from("favoritos")
      .select("user_id, lugar_id, lugares(id, nombre, slug, horarios(dia_semana, hora_apertura, cerrado, cruza_medianoche))")
      .in("user_id", userIds);

    if (favsError || !favs?.length) {
      return new Response("no favs", { status: 200 });
    }

    // 3. Detectar "abre pronto" para cada (user, lugar)
    for (const sub of subs) {
      const userFavs = favs.filter((f) => f.user_id === sub.user_id);

      for (const fav of userFavs) {
        const lugar = fav.lugares as {
          id: string;
          nombre: string;
          slug: string;
          horarios: { dia_semana: number; hora_apertura: string; cerrado: boolean; cruza_medianoche: boolean }[];
        } | null;

        if (!lugar) continue;

        const horarioHoy = (lugar.horarios ?? []).filter(
          (h) => h.dia_semana === dow && !h.cerrado
        );

        for (const h of horarioHoy) {
          const apertura = parseHora(h.hora_apertura);
          const minutos = apertura - nowMin;

          if (minutos <= 0 || minutos > MINUTOS_ABRE_PRONTO) continue;

          // 4. Verificar dedup (ya notificado hoy)
          const { data: ya } = await supabase
            .from("push_notif_log")
            .select("user_id")
            .eq("user_id", sub.user_id)
            .eq("lugar_id", lugar.id)
            .eq("sent_date", today)
            .maybeSingle();

          if (ya) continue;

          // 5. Mandar el push
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              JSON.stringify({
                title: "Haku — Abre pronto",
                body: `${lugar.nombre} abre en ${minutos} min`,
                url: `/local/${lugar.slug}`,
                tag: `abre-${lugar.id}`,
              })
            );

            await supabase.from("push_notif_log").insert({
              user_id: sub.user_id,
              lugar_id: lugar.id,
              sent_date: today,
            });
          } catch (err: unknown) {
            // 410 Gone = subscripción vencida, eliminarla
            if ((err as { statusCode?: number }).statusCode === 410) {
              await supabase
                .from("push_subscriptions")
                .delete()
                .eq("endpoint", sub.endpoint);
            }
          }
        }
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("error", { status: 500 });
  }
});
