// Supabase Edge Function: push-cron
// Corre cada 5 min (pg_cron). Detecta favoritos que abren en ≤30 min y manda
// una notificación push.
//
// Implementa Web Push (RFC 8291 / aes128gcm + VAPID ES256) con Web Crypto
// nativo de Deno — NO usa la librería `web-push` de npm, que no es compatible
// con el runtime edge de Supabase.

import { createClient } from "npm:@supabase/supabase-js@2";

const MINUTOS_ABRE_PRONTO = 30;
const TZ_OFFSET_HOURS = -3;

// ─── helpers base64url ───────────────────────────────────────────────────────
function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
function concat(...arrs: Uint8Array[]): Uint8Array {
  const total = arrs.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs) {
    out.set(a, off);
    off += a.length;
  }
  return out;
}

// ─── HMAC-SHA256 / HKDF manual (RFC 5869, single-block expand) ───────────────
async function hmac(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, data));
}

// ─── VAPID signing key (ES256) ───────────────────────────────────────────────
async function importVapidSigningKey(
  publicKeyB64: string,
  privateKeyB64: string,
): Promise<CryptoKey> {
  const pub = b64urlToBytes(publicKeyB64); // 65 bytes: 0x04 || x(32) || y(32)
  return crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      d: privateKeyB64,
      x: bytesToB64url(pub.slice(1, 33)),
      y: bytesToB64url(pub.slice(33, 65)),
      ext: true,
    },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

async function vapidJwt(
  endpoint: string,
  subject: string,
  signingKey: CryptoKey,
): Promise<string> {
  const aud = new URL(endpoint).origin;
  const header = bytesToB64url(utf8(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = bytesToB64url(
    utf8(
      JSON.stringify({
        aud,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: subject,
      }),
    ),
  );
  const signingInput = `${header}.${payload}`;
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    signingKey,
    utf8(signingInput),
  );
  return `${signingInput}.${bytesToB64url(new Uint8Array(sig))}`;
}

// ─── Cifrado del payload (RFC 8291 — aes128gcm) ──────────────────────────────
async function encryptPayload(
  p256dhB64: string,
  authB64: string,
  plaintext: Uint8Array,
): Promise<{ body: Uint8Array }> {
  const uaPublic = b64urlToBytes(p256dhB64); // 65 bytes
  const authSecret = b64urlToBytes(authB64); // 16 bytes

  // keypair efímero del servidor (application server)
  const asKeys = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const asPublic = new Uint8Array(
    await crypto.subtle.exportKey("raw", asKeys.publicKey),
  ); // 65 bytes

  const uaKey = await crypto.subtle.importKey(
    "raw",
    uaPublic,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const ecdhSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: uaKey },
      asKeys.privateKey,
      256,
    ),
  );

  // IKM = HKDF(auth_secret, ecdh_secret, "WebPush: info"\0 ua_public as_public, 32)
  const keyInfo = concat(
    utf8("WebPush: info"),
    Uint8Array.of(0),
    uaPublic,
    asPublic,
  );
  const prkCombine = await hmac(authSecret, ecdhSecret);
  const ikm = (await hmac(prkCombine, concat(keyInfo, Uint8Array.of(1)))).slice(
    0,
    32,
  );

  // salt aleatorio + derivación de CEK y NONCE (RFC 8188)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (
    await hmac(
      prk,
      concat(utf8("Content-Encoding: aes128gcm"), Uint8Array.of(0, 1)),
    )
  ).slice(0, 16);
  const nonce = (
    await hmac(
      prk,
      concat(utf8("Content-Encoding: nonce"), Uint8Array.of(0, 1)),
    )
  ).slice(0, 12);

  const cekKey = await crypto.subtle.importKey(
    "raw",
    cek,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  // record = plaintext || 0x02 (delimitador de último record)
  const record = concat(plaintext, Uint8Array.of(2));
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce, tagLength: 128 },
      cekKey,
      record,
    ),
  );

  // header del content-coding aes128gcm: salt(16) | rs(4) | idlen(1) | keyid
  const header = new Uint8Array(16 + 4 + 1 + asPublic.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, 4096, false);
  header[20] = asPublic.length;
  header.set(asPublic, 21);

  return { body: concat(header, cipher) };
}

type Sub = { endpoint: string; p256dh: string; auth: string };

async function sendWebPush(
  sub: Sub,
  payloadJson: string,
  vapid: { subject: string; publicKey: string; signingKey: CryptoKey },
): Promise<number> {
  const { body } = await encryptPayload(
    sub.p256dh,
    sub.auth,
    utf8(payloadJson),
  );
  const jwt = await vapidJwt(sub.endpoint, vapid.subject, vapid.signingKey);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`,
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      TTL: "86400",
    },
    body,
  });
  return res.status;
}

// ─── horarios ────────────────────────────────────────────────────────────────
type Horario = {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  cerrado: boolean;
  cruza_medianoche: boolean;
};

function parseHora(h: string): number {
  const [hh, mm] = h.split(":");
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}
function cruza(ap: number, ci: number, flag: boolean): boolean {
  return flag || ci < ap;
}
function estaAbierto(hs: Horario[], dow: number, nowMin: number): boolean {
  for (const h of hs) {
    if (h.cerrado || h.dia_semana !== dow) continue;
    const a = parseHora(h.hora_apertura);
    const c = parseHora(h.hora_cierre);
    if (cruza(a, c, h.cruza_medianoche)) {
      if (nowMin >= a) return true;
    } else if (nowMin >= a && nowMin < c) return true;
  }
  const prev = (dow + 6) % 7;
  for (const h of hs) {
    if (h.cerrado || h.dia_semana !== prev) continue;
    const a = parseHora(h.hora_apertura);
    const c = parseHora(h.hora_cierre);
    if (!cruza(a, c, h.cruza_medianoche)) continue;
    if (nowMin < c) return true;
  }
  return false;
}
function minutosParaApertura(
  hs: Horario[],
  dow: number,
  nowMin: number,
): number | null {
  const next = hs
    .filter(
      (h) =>
        !h.cerrado &&
        h.dia_semana === dow &&
        parseHora(h.hora_apertura) > nowMin,
    )
    .map((h) => parseHora(h.hora_apertura) - nowMin)
    .sort((a, b) => a - b);
  return next.length ? next[0] : null;
}

// ─── handler ─────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
    const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT");

    const env = {
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!SERVICE_ROLE_KEY,
      VAPID_PUBLIC_KEY: !!VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY: !!VAPID_PRIVATE_KEY,
      VAPID_SUBJECT: !!VAPID_SUBJECT,
    };

    if (
      !SUPABASE_URL ||
      !SERVICE_ROLE_KEY ||
      !VAPID_PUBLIC_KEY ||
      !VAPID_PRIVATE_KEY ||
      !VAPID_SUBJECT
    ) {
      return json({ ok: false, reason: "missing_env", env }, 500);
    }

    const signingKey = await importVapidSigningKey(
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY,
    );
    const vapid = {
      subject: VAPID_SUBJECT,
      publicKey: VAPID_PUBLIC_KEY,
      signingKey,
    };

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // hora local Argentina
    const arg = new Date(Date.now() + TZ_OFFSET_HOURS * 60 * 60 * 1000);
    const dow = arg.getUTCDay();
    const nowMin = arg.getUTCHours() * 60 + arg.getUTCMinutes();
    const today = arg.toISOString().slice(0, 10);

    const { data: subs, error: subsErr } = await supabase
      .from("push_subscriptions")
      .select("user_id, endpoint, p256dh, auth");
    if (subsErr) return json({ ok: false, reason: "subs_query", error: subsErr.message }, 500);
    if (!subs?.length) return json({ ok: true, subs: 0, sent: 0 });

    const userIds = [...new Set(subs.map((s) => s.user_id))];
    const { data: favs, error: favsErr } = await supabase
      .from("favoritos")
      .select(
        "user_id, lugar_id, lugares(id, nombre, slug, activo, horarios(dia_semana, hora_apertura, hora_cierre, cerrado, cruza_medianoche))",
      )
      .in("user_id", userIds);
    if (favsErr) return json({ ok: false, reason: "favs_query", error: favsErr.message }, 500);

    // detectar candidatos "abre pronto" por usuario
    type Candidate = { user_id: string; lugar_id: string; nombre: string; slug: string; minutos: number };
    const candByUser = new Map<string, Candidate[]>();
    for (const f of favs ?? []) {
      const lugar = (Array.isArray(f.lugares) ? f.lugares[0] : f.lugares) as
        | { id: string; nombre: string; slug: string; activo: boolean; horarios: Horario[] }
        | null;
      if (!lugar || lugar.activo === false) continue;
      const hs = lugar.horarios ?? [];
      if (estaAbierto(hs, dow, nowMin)) continue;
      const min = minutosParaApertura(hs, dow, nowMin);
      if (min === null || min <= 0 || min > MINUTOS_ABRE_PRONTO) continue;
      const arr = candByUser.get(f.user_id) ?? [];
      arr.push({ user_id: f.user_id, lugar_id: lugar.id, nombre: lugar.nombre, slug: lugar.slug, minutos: min });
      candByUser.set(f.user_id, arr);
    }

    const candidates = [...candByUser.values()].flat();

    if (debug) {
      return json({
        ok: true,
        debug: true,
        env,
        now: { dow, nowMin, today },
        subs: subs.length,
        favs: favs?.length ?? 0,
        candidates,
      });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const sub of subs) {
      const cands = candByUser.get(sub.user_id) ?? [];
      for (const c of cands) {
        // dedup: 1 notif por (user, lugar, día)
        const { data: ya } = await supabase
          .from("push_notif_log")
          .select("user_id")
          .eq("user_id", c.user_id)
          .eq("lugar_id", c.lugar_id)
          .eq("sent_date", today)
          .maybeSingle();
        if (ya) continue;

        try {
          const status = await sendWebPush(
            sub,
            JSON.stringify({
              title: "Haku — Abre pronto",
              body: `${c.nombre} abre en ${c.minutos} min`,
              url: `/local/${c.slug}`,
              tag: `abre-${c.lugar_id}`,
            }),
            vapid,
          );

          if (status >= 200 && status < 300) {
            sent++;
            await supabase.from("push_notif_log").insert({
              user_id: c.user_id,
              lugar_id: c.lugar_id,
              sent_date: today,
            });
          } else if (status === 404 || status === 410) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          } else {
            errors.push(`push ${status} para ${c.slug}`);
          }
        } catch (e) {
          errors.push(`${c.slug}: ${(e as Error).message}`);
        }
      }
    }

    return json({ ok: true, subs: subs.length, candidates: candidates.length, sent, errors });
  } catch (err) {
    return json({ ok: false, reason: "exception", error: (err as Error).message, stack: (err as Error).stack }, 500);
  }
});
