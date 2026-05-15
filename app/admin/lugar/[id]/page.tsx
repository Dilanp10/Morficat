import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  listarCategorias,
  listarTiposComida,
  obtenerLugarParaEditar,
} from "@/lib/admin-data";
import { LugarForm } from "./_components/LugarForm";

export const dynamic = "force-dynamic";

export default async function AdminLugarPage({
  params,
}: {
  params: { id: string };
}) {
  const esNuevo = params.id === "new";
  const [categorias, tiposComida, lugar] = await Promise.all([
    listarCategorias(),
    listarTiposComida(),
    esNuevo ? Promise.resolve(null) : obtenerLugarParaEditar(params.id),
  ]);

  if (!esNuevo && !lugar) {
    notFound();
  }

  const initial = lugar
    ? {
        id: lugar.id,
        nombre: lugar.nombre,
        slug: lugar.slug,
        descripcion: lugar.descripcion,
        categoria_id: lugar.categoria_id,
        direccion: lugar.direccion,
        barrio: lugar.barrio,
        lat: lugar.lat,
        lng: lugar.lng,
        telefono: lugar.telefono,
        whatsapp: lugar.whatsapp,
        instagram: lugar.instagram,
        facebook: lugar.facebook,
        imagen_principal: lugar.imagen_principal,
        atributos: (lugar.atributos ?? {}) as Record<string, boolean | undefined>,
        activo: lugar.activo,
        verificado: lugar.verificado,
        data_temporal: lugar.data_temporal,
        horarios: (lugar.horarios ?? []).map((h) => ({
          dia_semana: h.dia_semana,
          hora_apertura: h.hora_apertura,
          hora_cierre: h.hora_cierre,
          cerrado: h.cerrado,
          cruza_medianoche: h.cruza_medianoche,
        })),
        tipos_comida_ids: (lugar.tipos_comida ?? []).map((t) => t.id),
      }
    : {
        id: null,
        nombre: "",
        slug: "",
        descripcion: null,
        categoria_id: null,
        direccion: "",
        barrio: null,
        lat: null,
        lng: null,
        telefono: null,
        whatsapp: null,
        instagram: null,
        facebook: null,
        imagen_principal: null,
        atributos: {},
        activo: true,
        verificado: false,
        data_temporal: true,
        horarios: [],
        tipos_comida_ids: [],
      };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-terracota mb-6">
        {esNuevo ? "Nuevo lugar" : `Editar: ${lugar!.nombre}`}
      </h1>

      <LugarForm
        initial={initial}
        categorias={categorias}
        tiposComida={tiposComida}
      />
    </main>
  );
}
