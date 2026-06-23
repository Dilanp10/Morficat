import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { FavoritosProvider } from "@/components/FavoritosProvider";
import { ServiceWorkerInit } from "@/components/ServiceWorkerInit";
import { SplashScreen } from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { listarFavoritosIds } from "@/lib/favoritos";
import { getCurrentUser } from "@/lib/supabase/server";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haku — Comer y tomar en Catamarca",
  description:
    "Descubrí qué locales están abiertos ahora en Catamarca para comer o tomar algo.",
  manifest: "/manifest.json",
  applicationName: "Haku",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Haku",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Haku",
    description: "¿Qué está abierto ahora en Catamarca?",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EDE1" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1612" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('haku-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, initialFavoritos] = await Promise.all([
    getCurrentUser(),
    listarFavoritosIds(),
  ]);

  return (
    <html
      lang="es"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased pb-20">
        <ThemeProvider>
          <FavoritosProvider
            initialFavoritos={initialFavoritos}
            isAuthenticated={!!user}
          >
            <ServiceWorkerInit />
            <SplashScreen />
            {children}
            <WelcomeOverlay isAuthenticated={!!user} />
            <BottomNav />
          </FavoritosProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
