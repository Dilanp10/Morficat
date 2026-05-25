import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { getCurrentUser } from "@/lib/supabase/server";

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
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('haku-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased pb-20">
        <ThemeProvider>
          <SplashScreen />
          {children}
          <WelcomeOverlay isAuthenticated={!!user} />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
