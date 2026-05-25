import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SugerirWizard } from "./_components/SugerirWizard";

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

      <h1 className="text-2xl font-bold text-terracota mb-1">
        Sugerir un local
      </h1>
      <p className="text-sm text-foreground/60 mb-6">
        Solo te pedimos el nombre. El resto es opcional — incluso podés mandar
        un audio.
      </p>

      <SugerirWizard />
    </main>
  );
}
