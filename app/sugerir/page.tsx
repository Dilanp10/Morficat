import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SugerenciaForm } from "./_components/SugerenciaForm";

export default function SugerirPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <Link
        href="/mas"
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-terracota mb-2">
        Sugerir un local
      </h1>
      <p className="text-sm text-foreground/60 mb-6">
        Sumá un lugar que falta o avisanos si algo está mal cargado. Lo
        revisamos a mano.
      </p>

      <SugerenciaForm />
    </main>
  );
}
