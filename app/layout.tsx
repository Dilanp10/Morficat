import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";

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
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-bg-base text-white antialiased pb-20">
        <SplashScreen />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
