/** @type {import('tailwindcss').Config} */
// IMPORTANTE: Este archivo DEBE usar Tailwind v3 (NativeWind solo soporta v3)
// Configuración base para NativeWind (móvil) y Tailwind (web)
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-app/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-pro/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-core/src/**/*.{js,jsx,ts,tsx,mdx}",
    "../../apps/suntus-landing/src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Habilitar dark mode con clase
  theme: {
    extend: {
      // Tokens de diseño de suntUS usando variables CSS con soporte de opacidad
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

