import "./globals.css";
import type { Metadata } from "next";
import "../../lib/env.validation";

export const metadata: Metadata = {
  title: {
    default: 'suntUS - Panel de Administración',
    template: '%s | suntUS Admin',
  },
  description: 'Panel de administración de la plataforma suntUS',
  keywords: ['fitness', 'nutrición', 'administración', 'suntUS'],
  authors: [{ name: 'suntUS Team' }],
  creator: 'suntUS',
  publisher: 'suntUS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // OJO: Asegúrate que esta variable de entorno exista o ponle un fallback si truena en local
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'suntUS Admin',
    title: 'suntUS - Panel de Administración',
    description: 'Panel de administración de la plataforma suntUS',
  },
  robots: {
    index: false, // Panel admin no debe indexarse
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}