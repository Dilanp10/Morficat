export type UUID = string;

export type Atributos = {
  // Espacio
  terraza?: boolean;
  mesas_afuera?: boolean;
  mesas_adentro?: boolean;
  // Servicios
  wifi?: boolean;
  aire_acondicionado?: boolean;
  estacionamiento?: boolean;
  tarjetas?: boolean;
  reservas?: boolean;
  accesible?: boolean;
  acepta_mascotas?: boolean;
  // Música y entretenimiento
  musica_en_vivo?: boolean;
  dj?: boolean;
  karaoke?: boolean;
  juegos_ninos?: boolean;
};

export type Lugar = {
  id: UUID;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoria_id: UUID | null;
  direccion: string;
  barrio: string | null;
  lat: number;
  lng: number;
  telefono: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  imagen_principal: string | null;
  imagenes: string[];
  atributos: Atributos;
  activo: boolean;
  verificado: boolean;
  data_temporal: boolean;
  created_at: string;
  updated_at: string;
};

export type Categoria = {
  id: UUID;
  nombre: string;
  slug: string;
  emoji: string | null;
  orden: number;
  activo: boolean;
};

export type Horario = {
  id: UUID;
  lugar_id: UUID;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  cerrado: boolean;
  cruza_medianoche: boolean;
};

export type TipoComida = {
  id: UUID;
  nombre: string;
  slug: string;
  activo: boolean;
};

export type LugarConRelaciones = Lugar & {
  categoria?: Categoria | null;
  horarios?: Horario[];
  tipos_comida?: TipoComida[];
};

export type SugerenciaTipo =
  | "nuevo_local"
  | "error_horario"
  | "local_cerrado"
  | "otro";

export type Sugerencia = {
  id: UUID;
  tipo: SugerenciaTipo;
  lugar_id: UUID | null;
  contenido: string;
  email: string | null;
  revisado: boolean;
  created_at: string;
};
