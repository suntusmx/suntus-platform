/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. CONTENT: ¡Crucial! Escanea la app web Y la librería UI
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // <--- SIN ESTO, TODO ES BLANCO
  ],
  // 2. PRESET: Usa el mismo de NativeWind para compatibilidad de tokens
  presets: [require("nativewind/preset")],
  // 3. DARK MODE: Habilitar cambio manual del tema
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};