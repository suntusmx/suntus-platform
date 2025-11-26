/** @type {import('tailwindcss').Config} */
// IMPORTANTE: Este archivo DEBE usar Tailwind v3 (NativeWind solo soporta v3)
// NO incluir suntus-core aquí porque usa Tailwind v4
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-app/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-pro/**/*.{js,jsx,ts,tsx}",
    // NO incluir suntus-core aquí (usa Tailwind v4)
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Tokens de diseño de suntUS
      // TODO: Agregar colores, tipografía, espaciado personalizados
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};

