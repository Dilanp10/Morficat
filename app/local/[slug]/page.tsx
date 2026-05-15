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
import { HorariosTable } from "@/components/HorariosTable";
import { ShareButton } from "@/components/ShareButton";
import { ATRIBUTOS_LABELS } from "@/lib/constants";
import { obtenerLugarPorSlug } from "@/lib/lugares-public";

export const dynamic = "force-dynamic";

const MiniMapa = nextDynamic(() => import("@/components/MiniMapa"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full rounded-card bg-bg-elevated animate-pulse" />
  ),
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lugar = await obtenerLugarPorSlug(params.slug);
  if (!lugar) return { title: "Lugar no encontrado — MorfiCat" };
  const description =
    lugar.descripcion ??
    `${lugar.nombre}${lugar.barrio ? ` en ${lugar.barrio}, Catamarca` : " en Catamarca"}`;
  return {
    title: `${lugar.nombre} — MorfiCat`,
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

  const atributosActivos = Object.entries(lugar.atributos ?? {}).filter(
    ([, v]) => v === true,
  );

  return (
    <main className="min-h-screen pb-12">
      <div className="relative">
        <div className="relative aspect-[16/9] w-full bg-bg-elevated">
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
            <div className="flex h-full w-full items-center justify-center text-5xl text-white/35">
              {lugar.categoria?.emoji ?? "🍽️"}
            </div>
          )}
          <Link
            href="/"
            aria-label="Volver"
            className="absolute top-3 left-3 inline-flex items-center justify-center size-9 rounded-full bg-bg-base/80 backdrop-blur text-white hover:bg-bg-base transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-2xl mx-auto -mt-6 relative">
        <div className="rounded-card border border-white/10 bg-bg-elevated p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white truncate">
                {lugar.nombre}
              </h1>
              {lugar.categoria && (
                <p className="text-sm text-white/60 mt-0.5">
                  {lugar.categoria.emoji} {lugar.categoria.nombre}
                  {lugar.barrio ? ` · ${lugar.barrio}` : ""}
                </p>
              )}
            </div>
            <ShareButton title={lugar.nombre} text={lugar.descripcion ?? ""} />
          </div>

          <div className="mt-3">
            <EstadoBadgeLive horarios={lugar.horarios} />
          </div>

          {lugar.descripcion && (
            <p className="mt-4 text-sm text-white/80 whitespace-pre-line">
              {lugar.descripcion}
            </p>
          )}
        </div>

        <Seccion titulo="Horarios">
          <div className="rounded-card border border-white/10 bg-bg-elevated overflow-hidden">
            <HorariosTable horarios={lugar.horarios} />
          </div>
        </Seccion>

        <Seccion titulo="Ubicación">
          <div className="flex items-start gap-2 text-sm text-white/80 mb-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-white/60" />
            <span>
              {lugar.direccion}
              {lugar.barrio ? ` · ${lugar.barrio}` : ""}
            </span>
          </div>
          <MiniMapa lat={lugar.lat} lng={lugar.lng} />
        </Seccion>

        {(lugar.telefono ||
          lugar.whatsapp ||
          lugar.instagram ||
          lugar.facebook) && (
          <Seccion titulo="Contacto">
            <ul className="space-y-2">
              {lugar.telefono && (
                <ContactoLink
                  href={`tel:${lugar.telefono}`}
                  icon={<Phone size={16} />}
                  label={lugar.telefono}
                />
              )}
              {lugar.whatsapp && (
                <ContactoLink
                  href={`https://wa.me/${normalizaWhatsapp(lugar.whatsapp)}`}
                  icon={<MessageCircle size={16} />}
                  label={lugar.whatsapp}
                  external
                />
              )}
              {lugar.instagram && (
                <ContactoLink
                  href={normalizaInstagram(lugar.instagram)}
                  icon={<AtSign size={16} />}
                  label={`Instagram · ${lugar.instagram.replace(/^@/, "")}`}
                  external
                />
              )}
              {lugar.facebook && (
                <ContactoLink
                  href={normalizaFacebook(lugar.facebook)}
                  icon={<Globe size={16} />}
                  label={`Facebook · ${lugar.facebook}`}
                  external
                />
              )}
            </ul>
          </Seccion>
        )}

        {atributosActivos.length > 0 && (
          <Seccion titulo="El local tiene">
            <div className="flex flex-wrap gap-2">
              {atributosActivos.map(([key]) => (
                <span
                  key={key}
                  className="inline-flex rounded-pill bg-bg-elevated ring-1 ring-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {ATRIBUTOS_LABELS[key] ?? key}
                </span>
              ))}
            </div>
          </Seccion>
        )}

        {(lugar.tipos_comida ?? []).length > 0 && (
          <Seccion titulo="Tipo de comida">
            <div className="flex flex-wrap gap-2">
              {lugar.tipos_comida.map((t) => (
                <span
                  key={t.slug}
                  className="inline-flex rounded-pill bg-bg-elevated ring-1 ring-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {t.nombre}
                </span>
              ))}
            </div>
          </Seccion>
        )}
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
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-2">
        {titulo}
      </h2>
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
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-2 text-sm text-white/80 hover:text-terracota transition-colors"
      >
        <span className="text-white/60">{icon}</span>
        <span className="truncate">{label}</span>
      </a>
    </li>
  );
}
