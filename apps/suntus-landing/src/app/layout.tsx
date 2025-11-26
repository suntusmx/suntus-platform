import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from './providers';
import "../../lib/env.validation"; // Valida variables de entorno al importar
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'suntUS - Tu Plataforma de Fitness y Nutrición',
    template: '%s | suntUS',
  },
  description:
    'Conecta con expertos en fitness y nutrición. Planes personalizados, seguimiento de progreso y comunidad activa.',
  keywords: [
    'fitness',
    'nutrición',
    'entrenamiento personalizado',
    'planes de ejercicio',
    'dieta personalizada',
    'entrenadores',
    'nutricionistas',
  ],
  authors: [{ name: 'suntUS Team' }],
  creator: 'suntUS',
  publisher: 'suntUS',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'suntUS',
    title: 'suntUS - Tu Plataforma de Fitness y Nutrición',
    description:
      'Conecta con expertos en fitness y nutrición. Planes personalizados, seguimiento de progreso y comunidad activa.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'suntUS - Plataforma de Fitness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'suntUS - Tu Plataforma de Fitness y Nutrición',
    description:
      'Conecta con expertos en fitness y nutrición. Planes personalizados, seguimiento de progreso y comunidad activa.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* AuthProvider deshabilitado temporalmente por static export */}
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
