import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AtSign,
  ChevronLeft,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { EstadoBadgeLive } from "@/components/EstadoBadgeLive";
import { EstrellasDisplay } from "@/components/EstrellasDisplay";
import { HorariosTable } from "@/components/HorariosTable";
import { ShareButton } from "@/components/ShareButton";
import { ATRIBUTOS_LABELS } from "@/lib/constants";
import { obtenerLugarPorSlug } from "@/lib/lugares-public";
import {
  calcularPromedio,
  listarResenasPorLugar,
  obtenerResenaUsuario,
} from "@/lib/resenas";
import { getCurrentUser } from "@/lib/supabase/server";
import { ResenasSeccion } from "./_components/ResenasSeccion";

export const dynamic = "force-dynamic";

const MiniMapa = nextDynamic(() => import("@/components/MiniMapa"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full rounded-card animate-pulse" style={{ background: "var(--card-2)" }} />
  ),
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lugar = await obtenerLugarPorSlug(params.slug);
  if (!lugar) return { title: "Lugar no encontrado — Haku" };
  const description =
    lugar.descripcion ??
    `${lugar.nombre}${lugar.barrio ? ` en ${lugar.barrio}, Catamarca` : " en Catamarca"}`;
  return {
    title: `${lugar.nombre} — Haku`,
    description,
    openGraph: {
      title: lugar.nombre,
      description,
      images: lugar.imagen_principal ? [lugar.imagen_principal] : [],
    },
  };
}

function normalizaWhatsapp(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

function normalizaInstagram(raw: string): string {
  const v = raw.trim();
  if (v.startsWith("http")) return v;
  return `https://instagram.com/${v.replace(/^@/, "")}`;
}

function normalizaFacebook(raw: string): string {
  const v = raw.trim();
  if (v.startsWith("http")) return v;
  return `https://facebook.com/${v.replace(/^@/, "")}`;
}

export default async function LocalPage({
  params,
}: {
  params: { slug: string };
}) {
  const lugar = await obtenerLugarPorSlug(params.slug);
  if (!lugar) notFound();

  const [resenas, userResena, currentUser] = await Promise.all([
    listarResenasPorLugar(lugar.id),
    obtenerResenaUsuario(lugar.id),
    getCurrentUser(),
  ]);
  const { promedio, total } = calcularPromedio(resenas.map((r) => r.puntuacion));

  const atributosActivos = Object.entries(lugar.atributos ?? {}).filter(
    ([, v]) => v === true,
  );

  const monogram = lugar.nombre.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen pb-16">
      {/* ── Top bar ── */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-3">
        <Link
          href="/"
          aria-label="Volver"
          className="inline-flex items-center justify-center size-9 rounded-full backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "rgba(20,16,13,0.7)", color: "var(--fg)" }}
        >
          <ChevronLeft size={20} />
        </Link>
        <ShareButton title={lugar.nombre} text={lugar.descripcion ?? ""} />
      </div>

      {/* ── Hero ── */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "16/9", maxHeight: "260px" }}
      >
        {lugar.imagen_principal ? (
          <Image
            src={lugar.imagen_principal}
            alt={lugar.nombre}
            fill
            sizes="(min-width: 768px) 700px, 100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--terra-deep, #A85A30) 0%, var(--card-bg) 100%)",
            }}
          >
            <span
              className="font-serif italic"
              style={{ fontSize: "clamp(3rem,16vw,5.5rem)", color: "rgba(244,237,225,0.15)" }}
            >
              {monogram}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Head */}
        <div className="pt-5 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
          <p
            className="font-mono text-[11px] tracking-widest uppercase mb-1 font-medium"
            style={{ color: "var(--ochre)" }}
          >
            {[lugar.categoria?.nombre, lugar.barrio].filter(Boolean).join(" · ")}
          </p>
          <h1
            className="font-serif italic leading-tight"
            style={{ fontSize: "clamp(2rem,8vw,2.75rem)", color: "var(--fg)" }}
          >
            {lugar.nombre}.
          </h1>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <EstadoBadgeLive horarios={lugar.horarios} />
            {total > 0 && (
              <span
                className="inline-flex items-center gap-1 font-mono text-xs"
                style={{ color: "var(--ochre, #C99347)" }}
              >
                <EstrellasDisplay puntuacion={Math.round(promedio)} size={13} />
                <span>{promedio.toFixed(1)}</span>
                <span style={{ color: "var(--fg-50)" }}>({total})</span>
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {(lugar.whatsapp || lugar.instagram || lugar.telefono) && (
          <div className="flex gap-2 pt-4 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
            {lugar.whatsapp && (
              <a
                href={`https://wa.me/${normalizaWhatsapp(lugar.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-button py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--terra)", color: "var(--bg)" }}
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}
            {lugar.instagram && (
              <a
                href={normalizaInstagram(lugar.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-button py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ border: "1px solid var(--line-2)", color: "var(--fg-70)" }}
              >
                <AtSign size={16} />
                Instagram
              </a>
            )}
            {!lugar.whatsapp && !lugar.instagram && lugar.telefono && (
              <a
                href={`tel:${lugar.telefono}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-button py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--terra)", color: "var(--bg)" }}
              >
                <Phone size={16} />
                {lugar.telefono}
              </a>
            )}
          </div>
        )}

        {lugar.descripcion && (
          <p
            className="py-4 text-sm leading-relaxed whitespace-pre-line"
            style={{ color: "var(--fg-70)", borderBottom: "1px solid var(--line)" }}
          >
            {lugar.descripcion}
          </p>
        )}

        {/* Horarios */}
        <Seccion titulo="Horarios">
          <HorariosTable horarios={lugar.horarios} />
        </Seccion>

        {/* Ubicación */}
        <Seccion titulo={`Ubicación · ${lugar.direccion}`}>
          {lugar.barrio && (
            <p
              className="flex items-center gap-2 text-xs mb-3 font-mono"
              style={{ color: "var(--fg-50)" }}
            >
              <MapPin size={13} />
              {lugar.barrio}, Catamarca
            </p>
          )}
          <MiniMapa lat={lugar.lat} lng={lugar.lng} />
        </Seccion>

        {/* Atributos */}
        {atributosActivos.length > 0 && (
          <Seccion titulo="El local tiene">
            <div className="flex flex-wrap gap-2">
              {atributosActivos.map(([key]) => (
                <span
                  key={key}
                  className="font-mono text-[11px] px-3 py-1.5 rounded-pill"
                  style={{
                    border: "1px solid var(--line-2)",
                    color: "var(--fg-70)",
                  }}
                >
                  {(ATRIBUTOS_LABELS[key] ?? key).toUpperCase()}
                </span>
              ))}
              {(lugar.tipos_comida ?? []).map((t) => (
                <span
                  key={t.slug}
                  className="font-mono text-[11px] px-3 py-1.5 rounded-pill"
                  style={{
                    border: "1px solid var(--line-2)",
                    color: "var(--fg-70)",
                  }}
                >
                  {t.nombre.toUpperCase()}
                </span>
              ))}
            </div>
          </Seccion>
        )}

        {/* Contacto extra */}
        {(lugar.telefono || lugar.facebook) && (
          <Seccion titulo="Contacto">
            <ul>
              {lugar.telefono && (
                <ContactoLink
                  href={`tel:${lugar.telefono}`}
                  icon={<Phone size={15} />}
                  label={lugar.telefono}
                />
              )}
              {lugar.facebook && (
                <ContactoLink
                  href={normalizaFacebook(lugar.facebook)}
                  icon={<Globe size={15} />}
                  label={`Facebook · ${lugar.facebook}`}
                  external
                />
              )}
            </ul>
          </Seccion>
        )}

        {/* Reseñas */}
        <Seccion titulo="Reseñas">
          <ResenasSeccion
            lugarId={lugar.id}
            slug={lugar.slug}
            resenas={resenas}
            currentUserId={currentUser?.id ?? null}
            userResena={userResena}
            promedio={promedio}
            total={total}
          />
        </Seccion>
      </div>
    </main>
  );
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-5 pb-1 mt-1" style={{ borderTop: "1px solid var(--line)" }}>
      <h2 className="text-section mb-3">{titulo}</h2>
      {children}
    </section>
  );
}

function ContactoLink({
  href,
  icon,
  label,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <li className="row-sep last:border-b-0">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 py-3 text-sm transition-opacity hover:opacity-80"
        style={{ color: "var(--fg-70)" }}
      >
        <span style={{ color: "var(--terra)" }}>{icon}</span>
        <span className="truncate">{label}</span>
      </a>
    </li>
  );
}
