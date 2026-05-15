import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "MorfiCat — Comer y tomar en Catamarca",
  description:
    "Descubrí qué locales están abiertos ahora en Catamarca para comer o tomar algo.",
  manifest: "/manifest.json",
  applicationName: "MorfiCat",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MorfiCat",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "MorfiCat",
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

const themeInitScript = `(function(){try{var t=localStorage.getItem('morficat-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased pb-20">
        <ThemeProvider>
          <SplashScreen />
          {children}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
